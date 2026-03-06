import { getPublicKeySync, finalizeEvent, verifySignature } from 'nostr-crypto-utils';
import crypto from 'crypto';
import { NostrError, NostrErrorCode } from '../../types/errors.js';
import { SignedNostrEvent } from '../../types/nostr.js';
import { logger } from '../../utils/logger.js';

/**
 * Create a signed Nostr event
 * Uses finalizeEvent for one-step create+sign and getPublicKeySync for sync pubkey derivation.
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
    const pubkey = getPublicKeySync(privateKey);
    const nonce = crypto.randomBytes(4).readUInt32BE(0) % 1000000;

    // Use finalizeEvent for one-step create + hash + sign
    const signed = await finalizeEvent(
      {
        pubkey,
        kind,
        tags,
        content: `${content}:${nonce}`,
      },
      privateKey
    );

    return {
      pubkey: signed.pubkey as string,
      created_at: signed.created_at,
      kind: signed.kind,
      tags: signed.tags as string[][],
      content: signed.content,
      id: signed.id,
      sig: signed.sig,
    };
  } catch (error) {
    logger.error({ error }, 'Error creating event');
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
    logger.error({ error }, 'Error verifying event');
    return false;
  }
};
