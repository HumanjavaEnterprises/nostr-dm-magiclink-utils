/**
 * NIP-04: Encrypted Direct Messages
 * Implements the Nostr protocol for encrypted direct messages
 * Spec: https://github.com/nostr-protocol/nips/blob/master/04.md
 *
 * Also supports NIP-44 (Versioned Encrypted Payloads) as an opt-in alternative.
 */
import { encrypt } from 'nostr-crypto-utils';
import { encryptNip44 } from '../../nips/nip44.js';
export const NIP04_KIND = 4;
export const NIP44_KIND = 44;
/**
 * Create an encrypted direct message event (NIP-04 or NIP-44)
 * @param content Message content to encrypt
 * @param recipientPubkey Recipient's public key
 * @param senderPrivateKey Sender's private key
 * @param senderPubkey Sender's public key
 * @param encryptionMode Encryption mode: 'nip04' (default) or 'nip44'
 * @returns Promise resolving to a partial NostrEvent
 */
export async function createEncryptedDirectMessage(content, recipientPubkey, senderPrivateKey, senderPubkey, encryptionMode = 'nip04') {
    const useNip44 = encryptionMode === 'nip44';
    const encryptedContent = useNip44
        ? await encryptNip44(content, senderPrivateKey, recipientPubkey)
        : await encrypt(content, senderPrivateKey, recipientPubkey);
    return {
        kind: useNip44 ? NIP44_KIND : NIP04_KIND,
        pubkey: senderPubkey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', recipientPubkey]],
        content: encryptedContent
    };
}
/**
 * Validate a NIP-04 event
 * @param event NostrEvent to validate
 * @returns boolean indicating whether the event is a valid NIP-04 event
 */
export function isValidNIP04Event(event) {
    return (event.kind === NIP04_KIND &&
        Array.isArray(event.tags) &&
        event.tags.some(tag => tag[0] === 'p' && typeof tag[1] === 'string') &&
        typeof event.content === 'string' &&
        event.content.length > 0);
}
/**
 * Validate a NIP-44 event
 * @param event NostrEvent to validate
 * @returns boolean indicating whether the event is a valid NIP-44 event
 */
export function isValidNIP44Event(event) {
    return (event.kind === NIP44_KIND &&
        Array.isArray(event.tags) &&
        event.tags.some(tag => tag[0] === 'p' && typeof tag[1] === 'string') &&
        typeof event.content === 'string' &&
        event.content.length > 0);
}
//# sourceMappingURL=nip04.js.map