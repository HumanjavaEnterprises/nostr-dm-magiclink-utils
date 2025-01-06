/**
 * NIP-04: Encrypted Direct Messages
 * Implements the Nostr protocol for encrypted direct messages
 * Spec: https://github.com/nostr-protocol/nips/blob/master/04.md
 */
import { NostrEvent } from '../../types/nostr.js';
export declare const NIP04_KIND = 4;
export interface NIP04Message {
    content: string;
    recipient: string;
    created_at?: number;
}
/**
 * Create a NIP-04 compliant encrypted direct message event
 * @param content Message content to encrypt
 * @param recipientPubkey Recipient's public key
 * @param senderPrivateKey Sender's private key
 * @param senderPubkey Sender's public key
 * @returns Promise<NostrEvent>
 */
export declare function createEncryptedDirectMessage(content: string, recipientPubkey: string, senderPrivateKey: string, senderPubkey: string): Promise<Partial<NostrEvent>>;
/**
 * Validate a NIP-04 event
 * @param event NostrEvent to validate
 * @returns boolean
 */
export declare function isValidNIP04Event(event: NostrEvent): boolean;
//# sourceMappingURL=nip04.d.ts.map