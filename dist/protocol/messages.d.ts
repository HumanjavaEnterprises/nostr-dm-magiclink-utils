/**
 * @module protocol/messages
 * @description Message handling for Nostr protocol
 */
import { SignedNostrEvent } from '../types/nostr.js';
import { EncryptionMode } from '../types/config.js';
/**
 * Manages message encryption and verification for Nostr protocol
 * Provides utilities for secure message handling between users
 */
export declare class MessageManager {
    /**
     * Logger instance for message handling
     */
    private logger;
    constructor();
    /**
     * Encrypt a message for a recipient
     * @param content Message content to encrypt
     * @param recipientPubkey Recipient's public key
     * @param senderPrivateKey Sender's private key
     * @param encryptionMode Encryption mode: 'nip04' (default) or 'nip44'
     * @returns Encrypted message content
     * @throws {NostrError} If encryption fails
     */
    encryptMessage(content: string, recipientPubkey: string, senderPrivateKey: string, encryptionMode?: EncryptionMode): Promise<string>;
    /**
     * Verify a received message's signature and structure
     * @param event Signed Nostr event to verify
     * @returns True if message signature and structure are valid
     * @throws {NostrError} If verification fails
     */
    verifyMessage(event: SignedNostrEvent): Promise<boolean>;
}
//# sourceMappingURL=messages.d.ts.map