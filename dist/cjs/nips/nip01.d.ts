/**
 * @module nips/nip01
 * @description Implementation of NIP-01 functionality for direct messages
 */
import { NostrEvent, SignedNostrEvent, EventParams, SignEventParams } from '../types/nostr.js';
/**
 * Creates a new Nostr event with the specified parameters (NIP-01)
 * @param params - Event parameters
 * @returns Created event
 */
export declare function createEvent(params: EventParams): NostrEvent;
/**
 * Serializes a Nostr event for signing/hashing (NIP-01)
 * @param event - Event to serialize
 * @returns Serialized event JSON string
 */
export declare function serializeEvent(event: NostrEvent): string;
/**
 * Calculates the hash of a Nostr event (NIP-01)
 * @param event - Event to hash
 * @returns Event hash in hex format
 */
export declare function calculateEventHash(event: NostrEvent): string;
/**
 * Creates and signs a Nostr event (NIP-01)
 * @param params - Event parameters including private key
 * @returns Signed event
 */
export declare function signedEvent(params: SignEventParams): Promise<SignedNostrEvent>;
/**
 * Verifies a Nostr event's signature (NIP-01)
 * @param event - Event to verify
 * @returns True if signature is valid
 */
export declare function verifyEvent(event: SignedNostrEvent): Promise<boolean>;
/**
 * Validates a Nostr event structure (NIP-01)
 * @param event - Event to validate
 * @returns True if event structure is valid
 */
export declare function validateEvent(event: NostrEvent): boolean;
//# sourceMappingURL=nip01.d.ts.map