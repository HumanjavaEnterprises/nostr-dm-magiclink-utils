/**
 * @module protocol/messages
 * @description Message handling for Nostr protocol
 */
import { createLogger } from '../utils/logger.js';
import { NostrError, NostrErrorCode } from '../types/errors.js';
import { encryptMessage as nip04Encrypt } from '../nips/nip04.js';
import { encryptNip44 } from '../nips/nip44.js';
import { verifyEvent } from '../nips/nip01.js';
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
     * @param encryptionMode Encryption mode: 'nip04' (default) or 'nip44'
     * @returns Encrypted message content
     * @throws {NostrError} If encryption fails
     */
    async encryptMessage(content, recipientPubkey, senderPrivateKey, encryptionMode = 'nip04') {
        try {
            if (encryptionMode === 'nip44') {
                return await encryptNip44(content, senderPrivateKey, recipientPubkey);
            }
            return await nip04Encrypt(content, senderPrivateKey, recipientPubkey);
        }
        catch (error) {
            throw new NostrError('Failed to encrypt message', NostrErrorCode.ENCRYPTION_FAILED, error);
        }
    }
    /**
     * Verify a received message's signature and structure
     * @param event Signed Nostr event to verify
     * @returns True if message signature and structure are valid
     * @throws {NostrError} If verification fails
     */
    async verifyMessage(event) {
        try {
            // Validate required fields exist
            if (!event || typeof event !== 'object') {
                this.logger.warn('Message verification failed: event is not an object');
                return false;
            }
            if (!event.id || typeof event.id !== 'string') {
                this.logger.warn('Message verification failed: missing or invalid event id');
                return false;
            }
            if (!event.sig || typeof event.sig !== 'string') {
                this.logger.warn('Message verification failed: missing or invalid event signature');
                return false;
            }
            if (!event.pubkey || typeof event.pubkey !== 'string') {
                this.logger.warn('Message verification failed: missing or invalid event pubkey');
                return false;
            }
            // Validate key format (64 hex characters)
            if (!/^[a-f0-9]{64}$/i.test(event.pubkey)) {
                this.logger.warn('Message verification failed: pubkey is not valid 64-char hex');
                return false;
            }
            if (!/^[a-f0-9]{64}$/i.test(event.id)) {
                this.logger.warn('Message verification failed: id is not valid 64-char hex');
                return false;
            }
            if (!/^[a-f0-9]{128}$/i.test(event.sig)) {
                this.logger.warn('Message verification failed: sig is not valid 128-char hex');
                return false;
            }
            // Verify the event signature using NIP-01 Schnorr verification
            const isValid = await verifyEvent(event);
            if (isValid) {
                this.logger.info('Message verified from: %s', event.pubkey);
            }
            else {
                this.logger.warn('Message signature verification failed for pubkey: %s', event.pubkey);
            }
            return isValid;
        }
        catch (error) {
            throw new NostrError('Failed to verify message', NostrErrorCode.EVENT_VERIFICATION_FAILED, error);
        }
    }
}
//# sourceMappingURL=messages.js.map