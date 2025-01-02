/**
 * @module nips/nip01
 * @description Implementation of NIP-01 functionality for direct messages
 */

import { getPublicKey, signEvent as cryptoSignEvent, verifySignature as cryptoVerifySignature } from 'nostr-crypto-utils';
import { NostrError, NostrErrorCode } from '../types/errors';
import { NostrEvent, SignedNostrEvent, EventParams, SignEventParams } from '../types/nostr';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

/**
 * Creates a new Nostr event with the specified parameters (NIP-01)
 * @param params - Event parameters
 * @returns Created event
 */
export function createEvent(params: EventParams): NostrEvent {
  const { 
    kind, 
    content, 
    tags = [], 
    created_at = Math.floor(Date.now() / 1000), 
    pubkey = '' 
  } = params;
  
  return {
    kind,
    content,
    tags,
    created_at,
    pubkey,
  };
}

/**
 * Serializes a Nostr event for signing/hashing (NIP-01)
 * @param event - Event to serialize
 * @returns Serialized event JSON string
 */
export function serializeEvent(event: NostrEvent): string {
  return JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content
  ]);
}

/**
 * Calculates the hash of a Nostr event (NIP-01)
 * @param event - Event to hash
 * @returns Event hash in hex format
 */
export function calculateEventHash(event: NostrEvent): string {
  const serialized = serializeEvent(event);
  const hash = sha256(new TextEncoder().encode(serialized));
  return bytesToHex(hash);
}

/**
 * Creates and signs a Nostr event (NIP-01)
 * @param params - Event parameters including private key
 * @returns Signed event
 */
export async function signedEvent(params: SignEventParams): Promise<SignedNostrEvent> {
  try {
    const { privateKey, ...eventParams } = params;
    
    // Get public key if not provided
    const pubkey = eventParams.pubkey || await getPublicKey(privateKey);
    
    // Create the base event
    const event = createEvent({ ...eventParams, pubkey });
    
    // Calculate event hash/id
    const id = calculateEventHash(event);
    
    // Sign the event and get signature
    const signature = await cryptoSignEvent(event, privateKey);
    if (typeof signature !== 'string') {
      throw new Error('Invalid signature format');
    }

    // Return the signed event
    return {
      ...event,
      id,
      sig: signature
    };
  } catch (error) {
    throw new NostrError(
      'Failed to create signed event',
      NostrErrorCode.EVENT_CREATION_FAILED
    );
  }
}

/**
 * Verifies a Nostr event's signature (NIP-01)
 * @param event - Event to verify
 * @returns True if signature is valid
 */
export async function verifyEvent(event: SignedNostrEvent): Promise<boolean> {
  try {
    return await cryptoVerifySignature(event);
  } catch (error) {
    throw new NostrError(
      'Failed to verify event',
      NostrErrorCode.EVENT_VERIFICATION_FAILED
    );
  }
}

/**
 * Validates a Nostr event structure (NIP-01)
 * @param event - Event to validate
 * @returns True if event structure is valid
 */
export function validateEvent(event: NostrEvent): boolean {
  try {
    if (!event.pubkey || !event.created_at || event.kind === undefined || !event.content) {
      return false;
    }

    // Check timestamp is not in the future
    const now = Math.floor(Date.now() / 1000);
    if (event.created_at > now) {
      return false;
    }

    // Validate tags structure
    if (!Array.isArray(event.tags)) {
      return false;
    }

    for (const tag of event.tags) {
      if (!Array.isArray(tag)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}
