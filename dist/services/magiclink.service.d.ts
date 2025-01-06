import { NostrServiceInterface, MagicLinkServiceInterface } from '../types/service.js';
import { MagicLinkConfig, SendMagicLinkOptions, MagicLinkResponse } from '../types/config.js';
import { Logger } from 'pino';
/**
 * Service for handling magic link authentication
 * Manages generation, sending, and verification of magic links through Nostr protocol
 */
export declare class MagicLinkService implements MagicLinkServiceInterface {
    private readonly nostrService;
    private readonly config;
    private readonly logger;
    private readonly defaultTemplate;
    /**
     * Creates a new instance of MagicLinkService
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
     * Generates a token for magic link authentication
     * @returns Promise resolving to the generated token
     * @throws {NostrError} If token generation fails
     */
    private generateToken;
    /**
     * Formats a message with the given template and variables
     * @param link - The magic link URL
     * @param options - Message formatting options
     * @returns Formatted message string
     */
    private formatMessage;
}
//# sourceMappingURL=magiclink.service.d.ts.map