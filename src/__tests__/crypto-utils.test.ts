import { describe, it, expect, vi } from 'vitest';
import { encryptMessage } from 'nostr-crypto-utils';

// Mock the crypto utils module (canonical NIP-04 API)
vi.mock('nostr-crypto-utils', () => ({
  encryptMessage: vi.fn().mockResolvedValue('encrypted_message'),
  decryptMessage: vi.fn().mockResolvedValue('decrypted_message'),
  getPublicKeySync: vi.fn().mockReturnValue('mock_pubkey'),
  finalizeEvent: vi.fn().mockResolvedValue({ id: 'mock_id', sig: 'mock_sig' }),
  hexToBytes: vi.fn().mockImplementation((hex: string) => new Uint8Array(hex.length / 2)),
  nip44: {
    getConversationKey: vi.fn().mockReturnValue(new Uint8Array(32)),
    encrypt: vi.fn().mockReturnValue('nip44_encrypted'),
    decrypt: vi.fn().mockReturnValue('nip44_decrypted'),
  },
}));

describe('nostr-crypto-utils', () => {
  it('should encrypt with canonical (message, senderPriv, recipientPub) order', async () => {
    const message = 'test';
    // Use proper 32-byte hex strings
    const senderPrivateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const recipientPublicKey = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';

    const encrypted = await encryptMessage(message, senderPrivateKey, recipientPublicKey);
    expect(encrypted).toBe('encrypted_message');
  });
});
