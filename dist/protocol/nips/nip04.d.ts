/**
 * NIP-04: Encrypted Direct Messages
 * Implements the Nostr protocol for encrypted direct messages
 * Spec: https://github.com/nostr-protocol/nips/blob/master/04.md
 *
 * Also supports NIP-44 (Versioned Encrypted Payloads) as an opt-in alternative.
 */
import { NostrEvent } from '../../types/nostr.js';
import { EncryptionMode } from '../../types/config.js';
export declare const NIP04_KIND = 4;
export declare const NIP44_KIND = 44;
export interface NIP04Message {
    content: string;
    recipient: string;
    created_at?: number;
}
/**
 * Create an encrypted direct message event (NIP-04 or NIP-44)
 * @param content Message content to encrypt
 * @param recipientPubkey Recipient's public key
 * @param senderPrivateKey Sender's private key
 * @param senderPubkey Sender's public key
 * @param encryptionMode Encryption mode: 'nip04' (default) or 'nip44'
 * @returns Promise resolving to a partial NostrEvent
 */
export declare function createEncryptedDirectMessage(content: string, recipientPubkey: string, senderPrivateKey: string, senderPubkey: string, encryptionMode?: EncryptionMode): Promise<Partial<NostrEvent>>;
/**
 * Validate a NIP-04 event
 * @param event NostrEvent to validate
 * @returns boolean indicating whether the event is a valid NIP-04 event
 */
export declare function isValidNIP04Event(event: NostrEvent): boolean;
/**
 * Validate a NIP-44 event
 * @param event NostrEvent to validate
 * @returns boolean indicating whether the event is a valid NIP-44 event
 */
export declare function isValidNIP44Event(event: NostrEvent): boolean;
//# sourceMappingURL=nip04.d.ts.map