"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNpub = exports.formatPubkey = exports.validatePublicKey = exports.validatePrivateKey = void 0;
const errors_js_1 = require("../types/errors.js");
const logger_js_1 = require("./logger.js");
const base_1 = require("@scure/base");
/**
 * Validate a Nostr private key
 * @param key Private key to validate
 * @returns True if valid, false otherwise
 */
const validatePrivateKey = (key) => {
    try {
        // Check if it's a valid hex string of correct length (64 characters = 32 bytes)
        return /^[0-9a-f]{64}$/i.test(key);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to validate private key');
        return false;
    }
};
exports.validatePrivateKey = validatePrivateKey;
/**
 * Validate a Nostr public key
 * @param key Public key to validate
 * @returns True if valid, false otherwise
 */
const validatePublicKey = (key) => {
    try {
        // Check if it's a valid hex string of correct length (64 characters = 32 bytes)
        return /^[0-9a-f]{64}$/i.test(key);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to validate public key');
        return false;
    }
};
exports.validatePublicKey = validatePublicKey;
/**
 * Format a public key as an npub
 * @param pubkey Public key to format
 * @returns Formatted npub
 */
const formatPubkey = (pubkey) => {
    try {
        if (!(0, exports.validatePublicKey)(pubkey)) {
            throw new errors_js_1.NostrError('Invalid public key format', errors_js_1.NostrErrorCode.INVALID_PARAMETERS);
        }
        // Convert hex to bytes
        const bytes = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            bytes[i] = parseInt(pubkey.substring(i * 2, i * 2 + 2), 16);
        }
        // Encode as bech32 with npub prefix
        return base_1.bech32.encode('npub', base_1.bech32.toWords(bytes));
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to format public key');
        throw new errors_js_1.NostrError('Failed to format public key', errors_js_1.NostrErrorCode.INVALID_PARAMETERS, error instanceof Error ? error : new Error(String(error)));
    }
};
exports.formatPubkey = formatPubkey;
/**
 * Check if a string is a valid npub
 * @param npub String to check
 * @returns True if valid npub, false otherwise
 */
const isValidNpub = (npub) => {
    try {
        if (!npub.startsWith('npub1'))
            return false;
        // Decode bech32
        const { prefix, words } = base_1.bech32.decode(npub);
        if (prefix !== 'npub')
            return false;
        // Convert words back to bytes
        const bytes = base_1.bech32.fromWords(words);
        if (bytes.length !== 32)
            return false;
        // Convert bytes to hex
        const hex = Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        return (0, exports.validatePublicKey)(hex);
    }
    catch {
        return false;
    }
};
exports.isValidNpub = isValidNpub;
//# sourceMappingURL=key.utils.js.map