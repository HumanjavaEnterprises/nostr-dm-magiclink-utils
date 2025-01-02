import { NostrEvent } from 'nostr-crypto-utils';
import { SendMagicLinkOptions, MagicLinkResponse, NostrMagicLinkConfig } from './config';

export interface NostrServiceInterface {
  /** Connect to the Nostr relay */
  connect(): Promise<void>;
  /** Disconnect from the Nostr relay */
  disconnect(): Promise<void>;
  /** Send a direct message to a public key */
  sendDirectMessage(pubkey: string, content: string): Promise<NostrEvent>;
  /** Get the current connection status */
  getStatus(): { connected: boolean; error?: string };
  /** Add a new relay at runtime */
  addRelay(url: string): Promise<void>;
  /** Remove a relay at runtime */
  removeRelay(url: string): Promise<void>;
}

export interface MagicLinkServiceInterface {
  /** Send a magic link via DM */
  sendMagicLink(options: SendMagicLinkOptions): Promise<MagicLinkResponse>;
  /** Verify a magic link token */
  verifyMagicLink(token: string): Promise<string | null>;
}

export interface NostrMagicLinkInterface {
  /** Initialize the service with configuration */
  init(config: NostrMagicLinkConfig): Promise<void>;
  /** Send a magic link via DM */
  sendMagicLink(options: SendMagicLinkOptions): Promise<MagicLinkResponse>;
}