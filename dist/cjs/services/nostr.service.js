"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostrService = void 0;
const nostr_crypto_utils_1 = require("nostr-crypto-utils");
const nostr_websocket_utils_1 = require("nostr-websocket-utils");
const errors_js_1 = require("../types/errors.js");
const nip01_js_1 = require("../nips/nip01.js");
const nip44_js_1 = require("../nips/nip44.js");
const logger_js_1 = require("../utils/logger.js");
/**
 * Implementation of the Nostr service for handling direct messages
 */
class NostrService {
    config;
    logger;
    wsClients;
    isConnected = false;
    lastError;
    /**
     * Creates a new instance of NostrService
     * @param config - Service configuration
     * @param logger - Optional logger instance. If not provided, creates a new logger
     */
    constructor(config, logger) {
        this.config = config;
        this.logger = logger || (0, logger_js_1.createLogger)('NostrService');
        this.wsClients = new Map();
    }
    /**
     * Connect to all configured relays
     */
    async connect() {
        try {
            if (!this.config.relayUrls?.length) {
                throw new errors_js_1.NostrError('No relay URLs configured', errors_js_1.NostrErrorCode.CONFIGURATION_ERROR);
            }
            await Promise.all(this.config.relayUrls.map(url => this.connectToRelay(url)));
            this.isConnected = true;
            this.lastError = undefined;
        }
        catch (error) {
            this.isConnected = false;
            this.lastError = error instanceof Error ? error : new Error('Unknown error occurred');
            throw error;
        }
    }
    /**
     * Disconnect from all relays
     */
    async disconnect() {
        try {
            await Promise.all(Array.from(this.wsClients.values()).map(async (client) => {
                if (isNostrWSClient(client)) {
                    return client.disconnect();
                }
                throw new Error('Invalid client type');
            }));
            this.wsClients.clear();
            this.isConnected = false;
            this.lastError = undefined;
        }
        catch (error) {
            this.lastError = error instanceof Error ? error : new Error('Unknown error occurred');
            throw error;
        }
    }
    /**
     * Get the current connection status of the service
     * @returns {object} The current status object containing connection state and any error
     */
    getStatus() {
        return {
            connected: this.isConnected,
            error: this.lastError?.message
        };
    }
    /**
     * Add a new relay
     * @param url - URL of the relay to add
     */
    async addRelay(url) {
        if (this.wsClients.has(url)) {
            return;
        }
        try {
            await this.connectToRelay(url);
            if (!this.config.relayUrls.includes(url)) {
                this.config.relayUrls.push(url);
            }
        }
        catch {
            throw new errors_js_1.NostrError(`Failed to add relay ${url}`, errors_js_1.NostrErrorCode.RELAY_ERROR);
        }
    }
    /**
     * Remove a relay
     * @param url - URL of the relay to remove
     */
    async removeRelay(url) {
        const client = this.wsClients.get(url);
        if (!client) {
            return;
        }
        try {
            await client.disconnect();
            this.wsClients.delete(url);
            this.config.relayUrls = this.config.relayUrls.filter(u => u !== url);
        }
        catch {
            throw new errors_js_1.NostrError(`Failed to remove relay ${url}`, errors_js_1.NostrErrorCode.RELAY_ERROR);
        }
    }
    /**
     * Connects to a Nostr relay
     * @param url - URL of the relay to connect to
     */
    async connectToRelay(url) {
        try {
            const client = new nostr_websocket_utils_1.NostrWSClient([url]);
            await client.connect();
            this.wsClients.set(url, client);
        }
        catch {
            throw new errors_js_1.NostrError(`Failed to connect to relay ${url}`, errors_js_1.NostrErrorCode.RELAY_CONNECTION_FAILED);
        }
    }
    /**
     * Sends a direct message to a recipient
     * @param pubkey - Public key of the recipient
     * @param content - Content of the message
     * @returns The sent event
     */
    async sendDirectMessage(pubkey, content) {
        try {
            // Validate configuration
            if (!this.config.privateKey || this.config.privateKey.trim() === '') {
                throw new errors_js_1.NostrError('Private key is required', errors_js_1.NostrErrorCode.CONFIGURATION_ERROR);
            }
            if (!this.config.relayUrls || this.config.relayUrls.length === 0) {
                throw new errors_js_1.NostrError('At least one relay URL is required', errors_js_1.NostrErrorCode.CONFIGURATION_ERROR);
            }
            // Connect to relays if not already connected
            if (!this.isConnected) {
                await this.connect();
            }
            // Encrypt the message using the configured encryption mode
            const useNip44 = this.config.encryptionMode === 'nip44';
            const encryptedContent = useNip44
                ? await (0, nip44_js_1.encryptNip44)(content, this.config.privateKey, pubkey)
                : await (0, nostr_crypto_utils_1.encrypt)(content, this.config.privateKey, pubkey);
            // Create and sign the Nostr event
            // NIP-04 uses kind 4; NIP-44 uses kind 44
            const eventParams = {
                privateKey: this.config.privateKey,
                content: encryptedContent,
                kind: useNip44 ? 44 : 4,
                tags: [['p', pubkey]]
            };
            const event = await (0, nip01_js_1.signedEvent)(eventParams);
            // Send the event to all connected relays
            const sendPromises = Array.from(this.wsClients.entries())
                .map(async ([url, client]) => {
                try {
                    await client.sendMessage(['EVENT', event]);
                }
                catch (error) {
                    this.logger.error({ relayUrl: url, error }, 'Failed to send event to relay');
                    throw new errors_js_1.NostrError(`Failed to send event to relay ${url}`, errors_js_1.NostrErrorCode.RELAY_ERROR);
                }
            });
            await Promise.all(sendPromises);
            return event;
        }
        catch (error) {
            if (error instanceof errors_js_1.NostrError) {
                throw error;
            }
            throw new errors_js_1.NostrError('Failed to send direct message', errors_js_1.NostrErrorCode.MESSAGE_SEND_FAILED);
        }
    }
}
exports.NostrService = NostrService;
function isNostrWSClient(client) {
    return client instanceof nostr_websocket_utils_1.NostrWSClient;
}
//# sourceMappingURL=nostr.service.js.map