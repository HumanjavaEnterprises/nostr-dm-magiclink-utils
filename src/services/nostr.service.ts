import { encrypt } from 'nostr-crypto-utils';
import { NostrWSClient } from 'nostr-websocket-utils';
import { NostrServiceInterface } from '../types/service.js';
import { NostrError, NostrErrorCode } from '../types/errors.js';
import { NostrServiceConfig } from '../types/config.js';
import { SignEventParams, NostrEvent } from '../types/nostr.js';
import { signedEvent } from '../nips/nip01.js';
import { Logger } from 'pino';
import { createLogger } from '../utils/logger.js';

/**
 * Implementation of the Nostr service for handling direct messages
 */
export class NostrService implements NostrServiceInterface {
  private readonly logger: Logger;
  private readonly wsClients: Map<string, NostrWSClient>;
  private isConnected: boolean = false;
  private lastError?: Error;

  /**
   * Creates a new instance of NostrService
   * @param config - Service configuration
   * @param logger - Optional logger instance. If not provided, creates a new logger
   */
  constructor(
    private readonly config: NostrServiceConfig,
    logger?: Logger
  ) {
    this.logger = logger || createLogger('NostrService');
    this.wsClients = new Map();
  }

  /**
   * Connect to all configured relays
   */
  public async connect(): Promise<void> {
    try {
      if (!this.config.relayUrls?.length) {
        throw new NostrError(
          'No relay URLs configured',
          NostrErrorCode.CONFIGURATION_ERROR
        );
      }

      await Promise.all(
        this.config.relayUrls.map(url => this.connectToRelay(url))
      );
      this.isConnected = true;
      this.lastError = undefined;
    } catch (error) {
      this.isConnected = false;
      this.lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      throw error;
    }
  }

  /**
   * Disconnect from all relays
   */
  public async disconnect(): Promise<void> {
    try {
      await Promise.all(
        Array.from(this.wsClients.values()).map(async client => {
          if (isNostrWSClient(client)) {
            return client.disconnect();
          }
          throw new Error('Invalid client type');
        })
      );
      this.wsClients.clear();
      this.isConnected = false;
      this.lastError = undefined;
    } catch (error) {
      this.lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      throw error;
    }
  }

  /**
   * Get the current connection status of the service
   * @returns {object} The current status object containing connection state and any error
   */
  public getStatus(): { connected: boolean; error?: string } {
    return {
      connected: this.isConnected,
      error: this.lastError?.message
    };
  }

  /**
   * Add a new relay
   * @param url - URL of the relay to add
   */
  public async addRelay(url: string): Promise<void> {
    if (this.wsClients.has(url)) {
      return;
    }

    try {
      await this.connectToRelay(url);
      if (!this.config.relayUrls.includes(url)) {
        this.config.relayUrls.push(url);
      }
    } catch (error) {
      throw new NostrError(
        `Failed to add relay ${url}`,
        NostrErrorCode.RELAY_ERROR
      );
    }
  }

  /**
   * Remove a relay
   * @param url - URL of the relay to remove
   */
  public async removeRelay(url: string): Promise<void> {
    const client = this.wsClients.get(url);
    if (!client) {
      return;
    }

    try {
      await client.disconnect();
      this.wsClients.delete(url);
      this.config.relayUrls = this.config.relayUrls.filter(u => u !== url);
    } catch (error) {
      throw new NostrError(
        `Failed to remove relay ${url}`,
        NostrErrorCode.RELAY_ERROR
      );
    }
  }

  /**
   * Connects to a Nostr relay
   * @param url - URL of the relay to connect to
   */
  private async connectToRelay(url: string): Promise<void> {
    try {
      const client = new NostrWSClient([url]);
      await client.connect();
      this.wsClients.set(url, client);
    } catch (error) {
      throw new NostrError(
        `Failed to connect to relay ${url}`,
        NostrErrorCode.RELAY_CONNECTION_FAILED
      );
    }
  }

  /**
   * Sends a direct message to a recipient
   * @param pubkey - Public key of the recipient
   * @param content - Content of the message
   * @returns The sent event
   */
  public async sendDirectMessage(pubkey: string, content: string): Promise<NostrEvent> {
    try {
      // Validate configuration
      if (!this.config.privateKey || this.config.privateKey.trim() === '') {
        throw new NostrError(
          'Private key is required',
          NostrErrorCode.CONFIGURATION_ERROR
        );
      }

      if (!this.config.relayUrls || this.config.relayUrls.length === 0) {
        throw new NostrError(
          'At least one relay URL is required',
          NostrErrorCode.CONFIGURATION_ERROR
        );
      }

      // Connect to relays if not already connected
      if (!this.isConnected) {
        await this.connect();
      }

      // Encrypt the message
      const encryptedContent = await encrypt(
        content,
        this.config.privateKey,
        pubkey
      );

      // Create and sign the Nostr event
      const eventParams: SignEventParams = {
        privateKey: this.config.privateKey,
        content: encryptedContent,
        kind: 4, // Direct Message
        tags: [['p', pubkey]]
      };
      const event = await signedEvent(eventParams);

      // Send the event to all connected relays
      const sendPromises = Array.from(this.wsClients.entries())
        .map(async ([url, client]) => {
          try {
            await client.sendMessage(['EVENT', event]);
          } catch (error) {
            this.logger.error(
              { relayUrl: url, error },
              'Failed to send event to relay'
            );
            throw new NostrError(
              `Failed to send event to relay ${url}`,
              NostrErrorCode.RELAY_ERROR
            );
          }
        });

      await Promise.all(sendPromises);
      return event;
    } catch (error) {
      if (error instanceof NostrError) {
        throw error;
      }
      throw new NostrError(
        'Failed to send direct message',
        NostrErrorCode.MESSAGE_SEND_FAILED
      );
    }
  }
}

function isNostrWSClient(client: NostrWSClient | unknown): client is NostrWSClient {
  return client instanceof NostrWSClient;
}
