import { Event, getEventHash, getPublicKey, getSignature, validateEvent, verifySignature } from 'nostr-tools';
import { NostrError, NostrErrorCode } from '../../types/index.js';
import { logger } from '../../utils/logger.js';

/**
 * Create a signed Nostr event
 * @param content Event content
 * @param kind Event kind
 * @param privateKey Private key to sign the event
 * @param tags Optional event tags
 * @returns Signed Nostr event
 */
export const createEvent = (
  content: string,
  kind: number,
  privateKey: string,
  tags: string[][] = []
): Event => {
  try {
    const pubkey = getPublicKey(privateKey);
    const nonce = Math.random().toString(36).substring(2);
    const event: Event = {
      content: `${content}:${nonce}`,
      kind,
      tags,
      created_at: Math.floor(Date.now() / 1000),
      pubkey,
      id: '',
      sig: ''
    };

    event.id = getEventHash(event);
    event.sig = getSignature(event, privateKey);

    return event;
  } catch (error) {
    logger.error('Failed to create event', { error });
    throw new NostrError(
      'Failed to create event',
      NostrErrorCode.EVENT_CREATION_FAILED,
      error instanceof Error ? error : undefined
    );
  }
};

/**
 * Verify a Nostr event's signature and structure
 * @param event Event to verify
 * @returns True if event is valid, false otherwise
 */
export const verifyEvent = (event: Event): boolean => {
  try {
    // Check basic event structure
    if (!validateEvent(event)) {
      return false;
    }

    // Verify signature
    if (!verifySignature(event)) {
      return false;
    }

    // Check timestamp is not in the future
    const now = Math.floor(Date.now() / 1000);
    if (event.created_at > now + 60) { // Allow 1 minute clock skew
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to verify event', { error });
    return false;
  }
};
