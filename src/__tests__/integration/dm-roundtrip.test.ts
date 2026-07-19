/**
 * End-to-end integration tests using the REAL nostr-crypto-utils implementation
 * (not the global mocks). These exercise the actual NIP-04 encryption path and
 * would have caught the swapped-argument / wrong-kind bugs that shipped in
 * 0.3.2.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NostrService } from '../../services/nostr.service.js';

// Force the REAL nostr-crypto-utils for this file, overriding the global mock
// installed in the shared setup files.
vi.mock('nostr-crypto-utils', async () => {
  const actual = await vi.importActual<typeof import('nostr-crypto-utils')>('nostr-crypto-utils');
  return actual;
});

// Mock only the websocket transport so no network is required.
vi.mock('nostr-websocket-utils', () => ({
  NostrWSClient: class {
    connect = vi.fn().mockResolvedValue(undefined);
    disconnect = vi.fn().mockResolvedValue(undefined);
    sendMessage = vi.fn().mockResolvedValue(undefined);
  },
}));

describe('DM magic-link end-to-end (real NIP-04 crypto)', () => {
  let crypto: typeof import('nostr-crypto-utils');
  let sender: Awaited<ReturnType<typeof import('nostr-crypto-utils').generateKeyPair>>;
  let recipient: Awaited<ReturnType<typeof import('nostr-crypto-utils').generateKeyPair>>;

  beforeEach(async () => {
    crypto = await import('nostr-crypto-utils');
    sender = await crypto.generateKeyPair();
    recipient = await crypto.generateKeyPair();
  });

  it('round-trips a magic link: sender encrypts to recipient, recipient decrypts (canonical NIP-04 arg order)', async () => {
    const magicLink = 'https://auth.example.com/verify?token=header.payload.signature';

    // Sender -> recipient. Canonical: encryptMessage(message, senderPriv, recipientPub)
    const ciphertext = await crypto.encryptMessage(
      magicLink,
      sender.privateKey,
      recipient.publicKey.hex
    );
    expect(ciphertext).not.toBe(magicLink);

    // Recipient decrypts. Canonical: decryptMessage(ciphertext, recipientPriv, senderPub)
    const recovered = await crypto.decryptMessage(
      ciphertext,
      recipient.privateKey,
      sender.publicKey.hex
    );
    expect(recovered).toBe(magicLink);
  });

  it('previously-throwing default send path now succeeds and emits a standard kind-4 DM', async () => {
    const service = new NostrService({
      privateKey: sender.privateKey,
      relayUrls: ['wss://relay.example.com'],
      // encryptionMode omitted -> default (nip04) path, which used to throw
    });
    await service.connect();

    const magicLink = 'https://auth.example.com/verify?token=abc.def.ghi';
    const event = await service.sendDirectMessage(recipient.publicKey.hex, magicLink);

    // Bug #2: must be kind 4 (a real Nostr DM), never the non-standard kind 44
    expect(event.kind).toBe(4);
    expect(event.tags).toContainEqual(['p', recipient.publicKey.hex]);
    expect(event.id).toBeTruthy();
    expect(event.sig).toBeTruthy();

    // Bug #1: the encrypted content must decrypt back to the original magic link
    const recovered = await crypto.decryptMessage(
      event.content,
      recipient.privateKey,
      sender.publicKey.hex
    );
    expect(recovered).toBe(magicLink);
  });

  it('nip44 encryption mode also emits a kind-4 DM (not kind 44)', async () => {
    const service = new NostrService({
      privateKey: sender.privateKey,
      relayUrls: ['wss://relay.example.com'],
      encryptionMode: 'nip44',
    });
    await service.connect();

    const event = await service.sendDirectMessage(
      recipient.publicKey.hex,
      'https://auth.example.com/verify?token=xyz'
    );

    expect(event.kind).toBe(4);
    expect(event.tags).toContainEqual(['p', recipient.publicKey.hex]);
  });

  it('rejects an invalid recipient pubkey before doing any crypto', async () => {
    const service = new NostrService({
      privateKey: sender.privateKey,
      relayUrls: ['wss://relay.example.com'],
    });
    await service.connect();

    await expect(
      service.sendDirectMessage('deadbeef', 'https://auth.example.com/verify?token=abc')
    ).rejects.toThrow(/Invalid recipient public key/);
  });
});
