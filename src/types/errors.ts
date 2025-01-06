/**
 * Custom error class for Nostr-related errors
 */
export enum NostrErrorCode {
  INVALID_CONFIG = 'INVALID_CONFIG',
  RELAY_ERROR = 'RELAY_ERROR',
  MESSAGE_SEND_FAILED = 'MESSAGE_SEND_FAILED',
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  EVENT_CREATION_FAILED = 'EVENT_CREATION_FAILED',
  EVENT_VERIFICATION_FAILED = 'EVENT_VERIFICATION_FAILED',
  RELAY_CONNECTION_FAILED = 'RELAY_CONNECTION_FAILED',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  TOKEN_GENERATION_ERROR = 'TOKEN_GENERATION_ERROR',
  GENERAL_ERROR = 'GENERAL_ERROR',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS'
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
    public readonly code: NostrErrorCode | string = NostrErrorCode.INVALID_PARAMETERS,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'NostrError';
  }
}

/**
 * Interface for error details
 */
export interface ErrorDetails {
  message: string;
  code: NostrErrorCode | string;
  originalError?: Error;
}
