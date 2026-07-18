"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptMessage = encryptMessage;
exports.decryptMessage = decryptMessage;
const nostr_crypto_utils_1 = require("nostr-crypto-utils");
const errors_js_1 = require("../types/errors.js");
/**
 * Encrypts a message following NIP-04 specification
 * @param message - The message to encrypt
 * @param privateKey - The sender's private key (hex format)
 * @param publicKey - The recipient's public key (hex format)
 * @returns Promise resolving to the encrypted message
 * @throws NostrError if encryption fails or inputs are invalid
 */
async function encryptMessage(message, privateKey, publicKey) {
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
        // Validate key formats
        if (!privateKey || typeof privateKey !== 'string' || !/^[a-f0-9]{64}$/i.test(privateKey)) {
            throw new Error('Invalid key format: must be 64 hex characters');
        }
        if (!publicKey || typeof publicKey !== 'string' || !/^[a-f0-9]{64}$/i.test(publicKey)) {
            throw new Error('Invalid key format: must be 64 hex characters');
        }
        // Handle empty messages
        if (message === '') {
            message = ' ';
        }
        // Canonical NIP-04 API: encryptMessage(message, senderPrivkey, recipientPubkey)
        const result = await (0, nostr_crypto_utils_1.encryptMessage)(message, privateKey, publicKey);
        return result;
    }
    catch (error) {
        throw new errors_js_1.NostrError('Message encryption failed: ' + error.message, 'ENCRYPTION_FAILED');
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
async function decryptMessage(encryptedMessage, privateKey, publicKey) {
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
        // Validate key formats
        if (!privateKey || typeof privateKey !== 'string' || !/^[a-f0-9]{64}$/i.test(privateKey)) {
            throw new Error('Invalid key format: must be 64 hex characters');
        }
        if (!publicKey || typeof publicKey !== 'string' || !/^[a-f0-9]{64}$/i.test(publicKey)) {
            throw new Error('Invalid key format: must be 64 hex characters');
        }
        // Canonical NIP-04 API: decryptMessage(ciphertext, recipientPrivkey, senderPubkey)
        const result = await (0, nostr_crypto_utils_1.decryptMessage)(encryptedMessage, privateKey, publicKey);
        return result;
    }
    catch (error) {
        throw new errors_js_1.NostrError('Message decryption failed: ' + error.message, 'DECRYPTION_FAILED');
    }
}
//# sourceMappingURL=nip04.js.map