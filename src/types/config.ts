/**
 * Configuration types for the nostr-dm-magiclink-utils package
 */

/**
 * Encryption mode for direct messages.
 * - 'nip04': Legacy AES-CBC encryption (NIP-04, default for backward compatibility)
 * - 'nip44': Modern ChaCha20 + HMAC encryption (NIP-44, recommended)
 */
export type EncryptionMode = 'nip04' | 'nip44';

export interface NostrConfig {
  /** Nostr private key in hex format (nsec) */
  privateKey: string;
  /** List of relay URLs to connect to */
  relayUrls: string[];
  /**
   * Encryption mode for direct messages.
   * - 'nip04': Legacy AES-CBC encryption (default)
   * - 'nip44': Modern ChaCha20 + HMAC encryption (recommended)
   * @default 'nip04'
   */
  encryptionMode?: EncryptionMode;
}

export interface MagicLinkConfig {
  /** Base URL for magic link verification */
  verifyUrl: string;
  /**
   * JWT signing secret used to sign and verify magic link tokens.
   * This should be a strong, random secret kept server-side.
   */
  jwtSecret?: string;
  /**
   * @deprecated Use `jwtSecret` instead. If `jwtSecret` is not set, this value
   * is used as the JWT signing secret for backwards compatibility. When `token`
   * is a function, its return value is included as additional data in the JWT
   * payload (not used as the signing secret).
   */
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
  /**
   * Encryption mode for direct messages.
   * - 'nip04': Legacy AES-CBC encryption (default)
   * - 'nip44': Modern ChaCha20 + HMAC encryption (recommended)
   * @default 'nip04'
   */
  encryptionMode?: EncryptionMode;
}
