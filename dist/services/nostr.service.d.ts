import { NostrServiceInterface } from '../types/service.js';
import { NostrServiceConfig } from '../types/config.js';
import { NostrEvent } from '../types/nostr.js';
import { Logger } from 'pino';
/**
 * Implementation of the Nostr service for handling direct messages
 */
export declare class NostrService implements NostrServiceInterface {
    private readonly config;
    private readonly logger;
    private readonly wsClients;
    private isConnected;
    private lastError?;
    /**
     * Creates a new instance of NostrService
     * @param config - Service configuration
     * @param logger - Optional logger instance. If not provided, creates a new logger
     */
    constructor(config: NostrServiceConfig, logger?: Logger);
    /**
     * Connect to all configured relays
     */
    connect(): Promise<void>;
    /**
     * Disconnect from all relays
     */
    disconnect(): Promise<void>;
    /**
     * Get the current connection status of the service
     * @returns {object} The current status object containing connection state and any error
     */
    getStatus(): {
        connected: boolean;
        error?: string;
    };
    /**
     * Add a new relay
     * @param url - URL of the relay to add
     */
    addRelay(url: string): Promise<void>;
    /**
     * Remove a relay
     * @param url - URL of the relay to remove
     */
    removeRelay(url: string): Promise<void>;
    /**
     * Connects to a Nostr relay
     * @param url - URL of the relay to connect to
     */
    private connectToRelay;
    /**
     * Sends a direct message to a recipient
     * @param pubkey - Public key of the recipient
     * @param content - Content of the message
     * @returns The sent event
     */
    sendDirectMessage(pubkey: string, content: string): Promise<NostrEvent>;
}
//# sourceMappingURL=nostr.service.d.ts.map