import { nip19, validateEvent } from 'nostr-tools';
import { NostrError, NostrErrorCode } from '../types/nostr';
import { logger } from './logger';

/**
 * Validate a Nostr private key
 * @param key Private key to validate
 * @returns True if valid, false otherwise
 */
export const validatePrivateKey = (key: string): boolean => {
  try {
    // Check if it's a valid hex string of correct length (64 characters = 32 bytes)
    return /^[0-9a-f]{64}$/i.test(key);
  } catch (error) {
    logger.error('Failed to validate private key', { error });
    return false;
  }
};

/**
 * Validate a Nostr public key
 * @param key Public key to validate
 * @returns True if valid, false otherwise
 */
export const validatePublicKey = (key: string): boolean => {
  try {
    // Check if it's a valid hex string of correct length (64 characters = 32 bytes)
    if (!/^[0-9a-f]{64}$/i.test(key)) {
      return false;
    }

    // Create a dummy event to validate the public key
    const dummyEvent = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: '',
      pubkey: key,
      id: '',
      sig: ''
    };

    return validateEvent(dummyEvent);
  } catch (error) {
    logger.error('Failed to validate public key', { error });
    return false;
  }
};

/**
 * Format a public key as an npub
 * @param pubkey Public key to format
 * @returns Formatted npub
 */
export const formatPubkey = (pubkey: string): string => {
  try {
    if (!validatePublicKey(pubkey)) {
      throw new NostrError(
        'Invalid public key',
        NostrErrorCode.INVALID_KEY
      );
    }
    return nip19.npubEncode(pubkey);
  } catch (error) {
    logger.error('Failed to format public key', { error });
    throw new NostrError(
      'Failed to format public key',
      NostrErrorCode.FORMATTING_ERROR,
      { cause: error }
    );
  }
};

/**
 * Check if a string is a valid npub
 * @param npub String to check
 * @returns True if valid npub, false otherwise
 */
export const isValidNpub = (npub: string): boolean => {
  try {
    if (!npub.startsWith('npub1')) {
      return false;
    }
    
    const decoded = nip19.decode(npub);
    return decoded.type === 'npub' && validatePublicKey(decoded.data);
  } catch (error) {
    logger.error('Failed to validate npub', { error });
    return false;
  }
};
