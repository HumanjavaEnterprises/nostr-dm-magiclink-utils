import { NostrError, NostrErrorCode } from '../types/errors.js';
import { logger } from './logger.js';
import { bech32 } from '@scure/base';
/**
 * Validate a Nostr private key
 * @param key Private key to validate
 * @returns True if valid, false otherwise
 */
export const validatePrivateKey = (key) => {
    try {
        // Check if it's a valid hex string of correct length (64 characters = 32 bytes)
        return /^[0-9a-f]{64}$/i.test(key);
    }
    catch (error) {
        logger.error('Failed to validate private key', { error });
        return false;
    }
};
/**
 * Validate a Nostr public key
 * @param key Public key to validate
 * @returns True if valid, false otherwise
 */
export const validatePublicKey = (key) => {
    try {
        // Check if it's a valid hex string of correct length (64 characters = 32 bytes)
        return /^[0-9a-f]{64}$/i.test(key);
    }
    catch (error) {
        logger.error('Failed to validate public key', { error });
        return false;
    }
};
/**
 * Format a public key as an npub
 * @param pubkey Public key to format
 * @returns Formatted npub
 */
export const formatPubkey = (pubkey) => {
    try {
        if (!validatePublicKey(pubkey)) {
            throw new NostrError('Invalid public key format', NostrErrorCode.INVALID_PARAMETERS);
        }
        // Convert hex to bytes
        const bytes = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            bytes[i] = parseInt(pubkey.substring(i * 2, i * 2 + 2), 16);
        }
        // Encode as bech32 with npub prefix
        return bech32.encode('npub', bech32.toWords(bytes));
    }
    catch (error) {
        logger.error('Failed to format public key', { error });
        throw new NostrError('Failed to format public key', NostrErrorCode.INVALID_PARAMETERS, error instanceof Error ? error : new Error(String(error)));
    }
};
/**
 * Check if a string is a valid npub
 * @param npub String to check
 * @returns True if valid npub, false otherwise
 */
export const isValidNpub = (npub) => {
    try {
        if (!npub.startsWith('npub1'))
            return false;
        // Decode bech32
        const { prefix, words } = bech32.decode(npub);
        if (prefix !== 'npub')
            return false;
        // Convert words back to bytes
        const bytes = bech32.fromWords(words);
        if (bytes.length !== 32)
            return false;
        // Convert bytes to hex
        const hex = Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        return validatePublicKey(hex);
    }
    catch {
        return false;
    }
};
//# sourceMappingURL=key.utils.js.map