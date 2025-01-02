/**
 * Custom error class for Nostr-related errors
 */
export enum NostrErrorCode {
  EVENT_CREATION_FAILED = 'EVENT_CREATION_FAILED',
  EVENT_VERIFICATION_FAILED = 'EVENT_VERIFICATION_FAILED',
  RELAY_CONNECTION_FAILED = 'RELAY_CONNECTION_FAILED',
  RELAY_ERROR = 'RELAY_ERROR',
  MESSAGE_SEND_FAILED = 'MESSAGE_SEND_FAILED',
  INVALID_KEY = 'INVALID_KEY',
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS'
}

/**
 * Custom error class for Nostr-related errors
 * Extends the base Error class with additional Nostr-specific properties
 */
export class NostrError extends Error {
  /**
   * Creates a new NostrError instance
   * @param message - The error message
   * @param code - The error code
   * @param originalError - The original error that caused this error
   */
  constructor(
    message: string,
    public code: NostrErrorCode,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'NostrError';
    Object.setPrototypeOf(this, NostrError.prototype);
  }
}
