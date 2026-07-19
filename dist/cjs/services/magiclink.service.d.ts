import { NostrServiceInterface, MagicLinkServiceInterface } from '../types/service.js';
import { MagicLinkConfig, SendMagicLinkOptions, MagicLinkResponse } from '../types/config.js';
import { Logger } from 'pino';
import { ConsumedTokenStore } from './consumed-token-store.js';
/**
 * Manager for handling magic link authentication
 * Manages generation, sending, and verification of magic links through Nostr protocol
 */
export declare class MagicLinkManager implements MagicLinkServiceInterface {
    private readonly nostrService;
    private readonly config;
    private readonly logger;
    /**
     * Store of consumed token JTIs used to prevent replay attacks.
     *
     * Defaults to an in-memory store (single-instance only). Inject a
     * shared/persistent {@link ConsumedTokenStore} (e.g. Redis/DB) via the
     * constructor for multi-instance or serverless deployments — otherwise replay
     * protection does not survive restarts or span instances. See README.
     */
    private readonly consumedTokens;
    private readonly defaultTemplate;
    /**
     * Creates a new instance of MagicLinkManager
     * @param nostrService - Service for handling Nostr protocol operations
     * @param config - Configuration for magic link functionality
     * @param logger - Optional logger instance. If not provided, creates a new logger
     * @param consumedTokenStore - Optional pluggable store for consumed token JTIs
     *   (replay protection). Defaults to an in-memory store suitable only for
     *   single-instance deployments; inject a shared/persistent implementation for
     *   multi-instance or serverless environments.
     */
    constructor(nostrService: NostrServiceInterface, config: MagicLinkConfig, logger?: Logger, consumedTokenStore?: ConsumedTokenStore);
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
     * Asks the consumed-token store to remove expired entries.
     * Called during verification to prevent unbounded memory growth. Stores with
     * native TTL (e.g. Redis) may implement this as a no-op.
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