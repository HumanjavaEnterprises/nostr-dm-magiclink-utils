import { getPublicKey, signEvent, verifySignature } from 'nostr-crypto-utils';
import { NostrError, NostrErrorCode } from '../../types/errors.js';
import { NostrEvent, SignedNostrEvent } from '../../types/nostr.js';
import { logger } from '../../utils/logger.js';

/**
 * Create a signed Nostr event
 * @param content Event content
 * @param kind Event kind
 * @param privateKey Private key to sign the event
 * @param tags Optional event tags
 * @returns Signed Nostr event
 */
export const createEvent = async (
  content: string,
  kind: number,
  privateKey: string,
  tags: string[][] = []
): Promise<SignedNostrEvent> => {
  try {
    const pubkey = await getPublicKey(privateKey);
    const created_at = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    const event: NostrEvent = {
      pubkey,
      created_at,
      kind,
      tags,
      content: `${content}:${nonce}`,
    };

    // Sign the event
    const signedEventStr = await signEvent(event, privateKey);
    const signedEvent = JSON.parse(signedEventStr) as SignedNostrEvent;
    return signedEvent;

  } catch (error) {
    logger.error('Error creating event:', error);
    throw new NostrError(
      'Failed to create event',
      NostrErrorCode.EVENT_CREATION_FAILED,
      error instanceof Error ? error : new Error(String(error))
    );
  }
};

/**
 * Verify a Nostr event's signature and structure
 * @param event Event to verify
 * @returns True if event is valid, false otherwise
 */
export const verifyEvent = async (event: SignedNostrEvent): Promise<boolean> => {
  try {
    const now = Math.floor(Date.now() / 1000);

    // Check timestamp
    if (event.created_at > now + 60) { // Allow 1 minute clock skew
      logger.warn('Event from future');
      return false;
    }

    if (event.created_at < now - 60 * 60 * 24 * 365) { // Reject events older than 1 year
      logger.warn('Event too old');
      return false;
    }

    // Verify signature
    return await verifySignature(event);
  } catch (error) {
    logger.error('Error verifying event:', error);
    return false;
  }
};
