import { encrypt as cryptoEncryptMessage, decrypt as cryptoDecryptMessage } from 'nostr-crypto-utils';
import { NostrError } from '../types/errors.js';
/**
 * Encrypts a message following NIP-04 specification
 * @param message - The message to encrypt
 * @param privateKey - The sender's private key (hex format)
 * @param publicKey - The recipient's public key (hex format)
 * @returns Promise resolving to the encrypted message
 * @throws NostrError if encryption fails or inputs are invalid
 */
export async function encryptMessage(message, privateKey, publicKey) {
    try {
        // Validate inputs
        if (!message) {
            throw new Error('Message cannot be empty');
        }
        if (!privateKey) {
            throw new Error('Private key is required');
        }
        if (!publicKey) {
            throw new Error('Public key is required');
        }
        // In production, validate key formats
        if (process.env.NODE_ENV === 'production') {
            if (privateKey.length !== 64) {
                throw new Error('Invalid private key format');
            }
            if (publicKey.length !== 64) {
                throw new Error('Invalid public key format');
            }
        }
        // Handle empty messages
        if (message === '') {
            message = ' ';
        }
        // Note: encryptMessage expects (message, senderPrivkey, recipientPubkey)
        const result = await cryptoEncryptMessage(message, privateKey, publicKey);
        return result;
    }
    catch (error) {
        throw new NostrError('Message encryption failed: ' + error.message, 'ENCRYPTION_FAILED');
    }
}
/**
 * Decrypts a message following NIP-04 specification
 * @param encryptedMessage - The encrypted message to decrypt
 * @param privateKey - The recipient's private key
 * @param publicKey - The sender's public key
 * @returns Promise resolving to the decrypted message
 * @throws NostrError if decryption fails
 */
export async function decryptMessage(encryptedMessage, privateKey, publicKey) {
    try {
        // Validate inputs
        if (!encryptedMessage) {
            throw new Error('Encrypted message cannot be empty');
        }
        if (!privateKey) {
            throw new Error('Private key is required');
        }
        if (!publicKey) {
            throw new Error('Public key is required');
        }
        // In production, validate key formats
        if (process.env.NODE_ENV === 'production') {
            if (privateKey.length !== 64) {
                throw new Error('Invalid private key format');
            }
            if (publicKey.length !== 64) {
                throw new Error('Invalid public key format');
            }
        }
        // Note: decryptMessage expects (encryptedMessage, senderPubkey, recipientPrivkey)
        const result = await cryptoDecryptMessage(encryptedMessage, publicKey, privateKey);
        return result;
    }
    catch (error) {
        throw new NostrError('Message decryption failed: ' + error.message, 'DECRYPTION_FAILED');
    }
}
//# sourceMappingURL=nip04.js.map