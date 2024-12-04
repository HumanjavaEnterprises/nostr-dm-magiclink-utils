import { getPublicKey } from 'nostr-tools';
import { createLogger } from './logger.js';

const logger = createLogger('KeyUtils');

export function validatePrivateKey(key: string | undefined): string {
    if (!key) {
        throw new Error('NOSTR_PRIVATE_KEY is required');
    }

    try {
        // Remove any whitespace and '0x' prefix
        const cleanKey = key.replace('0x', '').trim();
        
        // Validate key format - must be 64 hex characters
        if (!/^[0-9a-f]{64}$/.test(cleanKey)) {
            throw new Error('NOSTR_PRIVATE_KEY must be a 64-character hex string');
        }

        // Test key derivation with nostr-tools
        const pubkey = getPublicKey(cleanKey);
        logger.info('Nostr keys validated. Public key:', pubkey);
        
        return cleanKey;
    } catch (error) {
        logger.error('Invalid NOSTR_PRIVATE_KEY:', error);
        throw error;
    }
}
