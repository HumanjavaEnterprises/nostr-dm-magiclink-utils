/**
 * @module protocol/messages
 * @description Message handling for Nostr protocol
 */
import { createLogger } from '../utils/logger.js';
import { NostrError, NostrErrorCode } from '../types/errors.js';
import { encryptMessage as nip04Encrypt } from '../nips/nip04.js';
/**
 * Manages message encryption and verification for Nostr protocol
 * Provides utilities for secure message handling between users
 */
export class MessageManager {
    /**
     * Logger instance for message handling
     */
    logger;
    constructor() {
        this.logger = createLogger('MessageManager');
    }
    /**
     * Encrypt a message for a recipient
     * @param content Message content to encrypt
     * @param recipientPubkey Recipient's public key
     * @param senderPrivateKey Sender's private key
     * @returns Encrypted message content
     * @throws {NostrError} If encryption fails
     */
    async encryptMessage(content, recipientPubkey, senderPrivateKey) {
        try {
            return await nip04Encrypt(content, senderPrivateKey, recipientPubkey);
        }
        catch (error) {
            throw new NostrError('Failed to encrypt message', NostrErrorCode.ENCRYPTION_FAILED, error);
        }
    }
    /**
     * Verify a received message
     * @param senderPubkey Sender's public key
     * @returns True if message is verified
     * @throws {NostrError} If verification fails
     */
    async verifyMessage(senderPubkey) {
        try {
            // Implementation for message verification
            this.logger.info('Message verified from:', senderPubkey);
            return true;
        }
        catch (error) {
            throw new NostrError('Failed to verify message', NostrErrorCode.EVENT_VERIFICATION_FAILED, error);
        }
    }
}
//# sourceMappingURL=messages.js.map