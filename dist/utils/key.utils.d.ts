/**
 * Validate a Nostr private key
 * @param key Private key to validate
 * @returns True if valid, false otherwise
 */
export declare const validatePrivateKey: (key: string) => boolean;
/**
 * Validate a Nostr public key
 * @param key Public key to validate
 * @returns True if valid, false otherwise
 */
export declare const validatePublicKey: (key: string) => boolean;
/**
 * Format a public key as an npub
 * @param pubkey Public key to format
 * @returns Formatted npub
 */
export declare const formatPubkey: (pubkey: string) => string;
/**
 * Check if a string is a valid npub
 * @param npub String to check
 * @returns True if valid npub, false otherwise
 */
export declare const isValidNpub: (npub: string) => boolean;
//# sourceMappingURL=key.utils.d.ts.map