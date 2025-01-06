/**
 * @module protocol/messages
 * @description Message handling for Nostr protocol
 */
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
     * @returns Encrypted message content
     * @throws {NostrError} If encryption fails
     */
    encryptMessage(content: string, recipientPubkey: string, senderPrivateKey: string): Promise<string>;
    /**
     * Verify a received message
     * @param senderPubkey Sender's public key
     * @returns True if message is verified
     * @throws {NostrError} If verification fails
     */
    verifyMessage(senderPubkey: string): Promise<boolean>;
}
//# sourceMappingURL=messages.d.ts.map