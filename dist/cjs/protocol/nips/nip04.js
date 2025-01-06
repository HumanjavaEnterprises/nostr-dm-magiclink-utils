/**
 * NIP-04: Encrypted Direct Messages
 * Implements the Nostr protocol for encrypted direct messages
 * Spec: https://github.com/nostr-protocol/nips/blob/master/04.md
 */
import { encrypt } from 'nostr-crypto-utils';
export const NIP04_KIND = 4;
/**
 * Create a NIP-04 compliant encrypted direct message event
 * @param content Message content to encrypt
 * @param recipientPubkey Recipient's public key
 * @param senderPrivateKey Sender's private key
 * @param senderPubkey Sender's public key
 * @returns Promise<NostrEvent>
 */
export async function createEncryptedDirectMessage(content, recipientPubkey, senderPrivateKey, senderPubkey) {
    const encryptedContent = await encrypt(content, senderPrivateKey, recipientPubkey);
    return {
        kind: NIP04_KIND,
        pubkey: senderPubkey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', recipientPubkey]],
        content: encryptedContent
    };
}
/**
 * Validate a NIP-04 event
 * @param event NostrEvent to validate
 * @returns boolean
 */
export function isValidNIP04Event(event) {
    return (event.kind === NIP04_KIND &&
        Array.isArray(event.tags) &&
        event.tags.some(tag => tag[0] === 'p' && typeof tag[1] === 'string') &&
        typeof event.content === 'string' &&
        event.content.length > 0);
}
//# sourceMappingURL=nip04.js.map