/**
 * Custom error class for Nostr-related errors
 */
export declare enum NostrErrorCode {
    INVALID_CONFIG = "INVALID_CONFIG",
    RELAY_ERROR = "RELAY_ERROR",
    MESSAGE_SEND_FAILED = "MESSAGE_SEND_FAILED",
    ENCRYPTION_FAILED = "ENCRYPTION_FAILED",
    DECRYPTION_FAILED = "DECRYPTION_FAILED",
    EVENT_CREATION_FAILED = "EVENT_CREATION_FAILED",
    EVENT_VERIFICATION_FAILED = "EVENT_VERIFICATION_FAILED",
    RELAY_CONNECTION_FAILED = "RELAY_CONNECTION_FAILED",
    CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
    TOKEN_GENERATION_ERROR = "TOKEN_GENERATION_ERROR",
    GENERAL_ERROR = "GENERAL_ERROR",
    INVALID_PARAMETERS = "INVALID_PARAMETERS"
}
/**
 * Custom error class for Nostr-related errors
 * Extends the base Error class with additional Nostr-specific properties
 */
export declare class NostrError extends Error {
    readonly code: NostrErrorCode | string;
    readonly originalError?: Error | undefined;
    /**
     * Creates a new NostrError instance
     * @param message - The error message
     * @param code - The error code
     * @param originalError - The original error that caused this error
     */
    constructor(message: string, code?: NostrErrorCode | string, originalError?: Error | undefined);
}
/**
 * Interface for error details
 */
export interface ErrorDetails {
    message: string;
    code: NostrErrorCode | string;
    originalError?: Error;
}
//# sourceMappingURL=errors.d.ts.map