/**
 * Configuration types for the nostr-dm-magiclink-utils package
 */

export interface NostrConfig {
  /** Nostr private key in hex format (nsec) */
  privateKey: string;
  /** List of relay URLs to connect to */
  relayUrls: string[];
}

export interface MagicLinkConfig {
  /** Base URL for magic link verification */
  verifyUrl: string;
  /** JWT token or token generation function */
  token: string | (() => Promise<string>);
  /** Default locale for messages */
  defaultLocale?: string;
  /** Default text direction */
  defaultTextDirection?: 'ltr' | 'rtl';
}

export interface MessageOptions {
  /** Override default locale per message */
  locale?: string;
  /** Override text direction per message */
  textDirection?: 'ltr' | 'rtl';
  /** Optional custom template */
  template?: string;
  /** Optional custom variables */
  variables?: Record<string, string>;
}

export interface NostrMagicLinkConfig {
  /** Nostr configuration */
  nostr: NostrConfig;
  /** Magic link configuration */
  magicLink: MagicLinkConfig;
}

export interface SendMagicLinkOptions {
  /** Recipient's public key (npub) */
  recipientPubkey: string;
  /** Message options for localization and customization */
  messageOptions?: MessageOptions;
}

export interface MagicLinkResponse {
  /** Whether the magic link was sent successfully */
  success: boolean;
  /** Error message if the operation failed */
  error?: string;
  /** The generated magic link if successful */
  magicLink?: string;
  /** The event ID of the sent DM if successful */
  eventId?: string;
}

/**
 * Configuration for the Nostr service
 */
export interface NostrServiceConfig {
  /** Nostr private key in hex format (nsec) */
  privateKey: string;
  relayUrls: string[];
  retryAttempts?: number;
  retryDelay?: number;
}
