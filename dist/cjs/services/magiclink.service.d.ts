import { NostrServiceInterface, MagicLinkServiceInterface } from '../types/service.js';
import { MagicLinkConfig, SendMagicLinkOptions, MagicLinkResponse } from '../types/config.js';
import { Logger } from 'pino';
/**
 * Manager for handling magic link authentication
 * Manages generation, sending, and verification of magic links through Nostr protocol
 */
export declare class MagicLinkManager implements MagicLinkServiceInterface {
    private readonly nostrService;
    private readonly config;
    private readonly logger;
    /**
     * Tracks consumed token JTIs to prevent replay attacks.
     * Maps jti -> expiry timestamp (seconds since epoch).
     * Expired entries are periodically cleaned up during verification.
     */
    private readonly consumedTokens;
    private readonly defaultTemplate;
    /**
     * Creates a new instance of MagicLinkManager
     * @param nostrService - Service for handling Nostr protocol operations
     * @param config - Configuration for magic link functionality
     * @param logger - Optional logger instance. If not provided, creates a new logger
     */
    constructor(nostrService: NostrServiceInterface, config: MagicLinkConfig, logger?: Logger);
    /**
     * Sends a magic link to a recipient via Nostr direct message
     * @param options - Options for sending the magic link
     * @param options.recipientPubkey - Public key of the recipient
     * @param options.messageOptions - Optional message formatting options
     * @returns Promise resolving to a response object containing success status and magic link or error
     */
    sendMagicLink(options: SendMagicLinkOptions): Promise<MagicLinkResponse>;
    /**
     * Verifies a magic link token and returns the associated public key
     * @param token - The token to verify
     * @returns Promise resolving to the public key if verification succeeds, null otherwise
     */
    verifyMagicLink(token: string): Promise<string | null>;
    /**
     * Returns the JWT signing secret.
     * Prefers config.jwtSecret; falls back to config.token (string) for backwards compatibility.
     * @returns The JWT signing secret string
     */
    private getJwtSecret;
    /**
     * Generates a per-request JWT token for magic link authentication.
     * Each token contains the recipient's pubkey, a unique jti, and a 15-minute expiration.
     * @param pubkey - The recipient's public key to embed in the token
     * @returns Promise resolving to the generated JWT token string
     * @throws {NostrError} If token generation fails
     */
    private generateToken;
    /**
     * Removes expired entries from the consumed tokens map.
     * Called during verification to prevent unbounded memory growth.
     */
    private cleanupConsumedTokens;
    /**
     * Formats a message with the given template and variables
     * @param link - The magic link URL
     * @param options - Message formatting options
     * @returns Formatted message string
     */
    private formatMessage;
}
//# sourceMappingURL=magiclink.service.d.ts.map