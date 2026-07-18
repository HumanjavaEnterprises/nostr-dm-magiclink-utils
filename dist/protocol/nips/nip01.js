import { getPublicKeySync, finalizeEvent, verifySignature } from 'nostr-crypto-utils';
import { NostrError, NostrErrorCode } from '../../types/errors.js';
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
export const createEvent = async (content, kind, privateKey, tags = []) => {
    try {
        const pubkey = getPublicKeySync(privateKey);
        // Sign the content exactly as provided. Do NOT append a nonce to the
        // content: doing so corrupts the payload (e.g. mangles NIP-04 ciphertext so
        // the recipient cannot decrypt it). NIP-01 event uniqueness already derives
        // from created_at + pubkey + the event id hash, so no extra nonce is needed.
        const signed = await finalizeEvent({
            pubkey,
            kind,
            tags,
            content,
        }, privateKey);
        return {
            pubkey: signed.pubkey,
            created_at: signed.created_at,
            kind: signed.kind,
            tags: signed.tags,
            content: signed.content,
            id: signed.id,
            sig: signed.sig,
        };
    }
    catch (error) {
        logger.error({ error }, 'Error creating event');
        throw new NostrError('Failed to create event', NostrErrorCode.EVENT_CREATION_FAILED, error instanceof Error ? error : new Error(String(error)));
    }
};
/**
 * Verify a Nostr event's signature and structure
 * @param event Event to verify
 * @returns True if event is valid, false otherwise
 */
export const verifyEvent = async (event) => {
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
    }
    catch (error) {
        logger.error({ error }, 'Error verifying event');
        return false;
    }
};
//# sourceMappingURL=nip01.js.map