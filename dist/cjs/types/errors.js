/**
 * Custom error class for Nostr-related errors
 */
export var NostrErrorCode;
(function (NostrErrorCode) {
    NostrErrorCode["INVALID_CONFIG"] = "INVALID_CONFIG";
    NostrErrorCode["RELAY_ERROR"] = "RELAY_ERROR";
    NostrErrorCode["MESSAGE_SEND_FAILED"] = "MESSAGE_SEND_FAILED";
    NostrErrorCode["ENCRYPTION_FAILED"] = "ENCRYPTION_FAILED";
    NostrErrorCode["DECRYPTION_FAILED"] = "DECRYPTION_FAILED";
    NostrErrorCode["EVENT_CREATION_FAILED"] = "EVENT_CREATION_FAILED";
    NostrErrorCode["EVENT_VERIFICATION_FAILED"] = "EVENT_VERIFICATION_FAILED";
    NostrErrorCode["RELAY_CONNECTION_FAILED"] = "RELAY_CONNECTION_FAILED";
    NostrErrorCode["CONFIGURATION_ERROR"] = "CONFIGURATION_ERROR";
    NostrErrorCode["TOKEN_GENERATION_ERROR"] = "TOKEN_GENERATION_ERROR";
    NostrErrorCode["GENERAL_ERROR"] = "GENERAL_ERROR";
    NostrErrorCode["INVALID_PARAMETERS"] = "INVALID_PARAMETERS";
})(NostrErrorCode || (NostrErrorCode = {}));
/**
 * Custom error class for Nostr-related errors
 * Extends the base Error class with additional Nostr-specific properties
 */
export class NostrError extends Error {
    code;
    originalError;
    /**
     * Creates a new NostrError instance
     * @param message - The error message
     * @param code - The error code
     * @param originalError - The original error that caused this error
     */
    constructor(message, code = NostrErrorCode.INVALID_PARAMETERS, originalError) {
        super(message);
        this.code = code;
        this.originalError = originalError;
        this.name = 'NostrError';
    }
}
//# sourceMappingURL=errors.js.map