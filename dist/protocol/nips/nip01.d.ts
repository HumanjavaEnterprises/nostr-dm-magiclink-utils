import { Event } from 'nostr-tools';
/**
 * Create a signed Nostr event
 * @param content Event content
 * @param kind Event kind
 * @param privateKey Private key to sign the event
 * @param tags Optional event tags
 * @returns Signed Nostr event
 */
export declare const createEvent: (content: string, kind: number, privateKey: string, tags?: string[][]) => Event;
/**
 * Verify a Nostr event's signature and structure
 * @param event Event to verify
 * @returns True if event is valid, false otherwise
 */
export declare const verifyEvent: (event: Event) => boolean;
//# sourceMappingURL=nip01.d.ts.map