/**
 * Core Nostr types for magic link functionality
 */
/**
 * Type guard to check if an object is a valid SignedNostrEvent
 * @param obj The object to check
 * @returns True if the object is a valid SignedNostrEvent
 */
export function isSignedNostrEvent(obj) {
    if (!isNostrEvent(obj)) {
        return false;
    }
    const signedEvent = obj;
    return typeof signedEvent.id === 'string' && typeof signedEvent.sig === 'string';
}
/**
 * Type guard to check if an object is a valid SignEventParams
 * @param obj The object to check
 * @returns True if the object is a valid SignEventParams
 */
export function isSignEventParams(obj) {
    if (!isEventParams(obj)) {
        return false;
    }
    const signParams = obj;
    return typeof signParams.privateKey === 'string';
}
/**
 * Type guard to check if an object is a valid EventParams
 * @param obj The object to check
 * @returns True if the object is a valid EventParams
 */
export function isEventParams(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const eventParams = obj;
    return (typeof eventParams.kind === 'number' &&
        typeof eventParams.content === 'string' &&
        (eventParams.tags === undefined || (Array.isArray(eventParams.tags) && eventParams.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string')))) &&
        (eventParams.created_at === undefined || typeof eventParams.created_at === 'number') &&
        (eventParams.pubkey === undefined || typeof eventParams.pubkey === 'string'));
}
/**
 * Type guard to check if an object is a valid NostrFilter
 * @param obj The object to check
 * @returns True if the object is a valid NostrFilter
 */
export function isNostrFilter(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const filter = obj;
    return ((filter.ids === undefined || Array.isArray(filter.ids) && filter.ids.every(id => typeof id === 'string')) &&
        (filter.authors === undefined || Array.isArray(filter.authors) && filter.authors.every(author => typeof author === 'string')) &&
        (filter.kinds === undefined || Array.isArray(filter.kinds) && filter.kinds.every(kind => typeof kind === 'number')) &&
        (filter.since === undefined || typeof filter.since === 'number') &&
        (filter.until === undefined || typeof filter.until === 'number') &&
        (filter.limit === undefined || typeof filter.limit === 'number'));
}
/**
 * Type guard to check if an object is a valid NostrRelay
 * @param obj The object to check
 * @returns True if the object is a valid NostrRelay
 */
export function isNostrRelay(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const relay = obj;
    return (typeof relay.url === 'string' &&
        (relay.status === 'connected' || relay.status === 'disconnected' || relay.status === 'connecting' || relay.status === 'error') &&
        (relay.error === undefined || typeof relay.error === 'string'));
}
/**
 * Type guard to check if an object is a valid NostrKeyPair
 * @param obj The object to check
 * @returns True if the object is a valid NostrKeyPair
 */
export function isNostrKeyPair(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const keyPair = obj;
    return (typeof keyPair.publicKey === 'string' &&
        typeof keyPair.privateKey === 'string' &&
        (keyPair.seedPhrase === undefined || typeof keyPair.seedPhrase === 'string'));
}
/**
 * Type guard to check if an object is a valid EncryptedMessage
 * @param obj The object to check
 * @returns True if the object is a valid EncryptedMessage
 */
export function isEncryptedMessage(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const message = obj;
    return (typeof message.content === 'string' &&
        typeof message.iv === 'string' &&
        typeof message.sender === 'string' &&
        typeof message.recipient === 'string' &&
        typeof message.timestamp === 'number');
}
/**
 * Type guard to check if an object is a valid NostrMessage
 * @param obj The object to check
 * @returns True if the object is a valid NostrMessage
 */
export function isNostrMessage(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const message = obj;
    return (typeof message.type === 'string' &&
        (isNostrEvent(message.payload) || isSignedNostrEvent(message.payload) || isNostrFilter(message.payload) || isNostrRelay(message.payload) || isNostrKeyPair(message.payload) || isEncryptedMessage(message.payload)));
}
/**
 * Type guard to check if an object is a valid NostrSubscription
 * @param obj The object to check
 * @returns True if the object is a valid NostrSubscription
 */
export function isNostrSubscription(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const subscription = obj;
    return (typeof subscription.id === 'string' &&
        Array.isArray(subscription.filters) &&
        subscription.filters.every(filter => isNostrFilter(filter)));
}
/**
 * Type guard to check if an object is a valid ErrorDetails
 * @param obj The object to check
 * @returns True if the object is a valid ErrorDetails
 */
export function isErrorDetails(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const details = obj;
    return ((details.relayUrl === undefined || typeof details.relayUrl === 'string') &&
        (details.pubkey === undefined || typeof details.pubkey === 'string') &&
        (details.event === undefined || isPartialNostrEvent(details.event)) &&
        (details.cause === undefined || details.cause instanceof Error || details.cause === undefined));
}
/**
 * Type guard to check if an object is a valid Partial<NostrEvent>
 * @param obj The object to check
 * @returns True if the object is a valid Partial<NostrEvent>
 */
export function isPartialNostrEvent(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const event = obj;
    return ((event.pubkey === undefined || typeof event.pubkey === 'string') &&
        (event.created_at === undefined || typeof event.created_at === 'number') &&
        (event.kind === undefined || typeof event.kind === 'number') &&
        (event.tags === undefined || (Array.isArray(event.tags) && event.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string')))) &&
        (event.content === undefined || typeof event.content === 'string'));
}
/**
 * Custom error class for Nostr-related errors
 */
export class NostrError extends Error {
    code;
    details;
    /**
     * Creates a new NostrError
     * @param message - Error message
     * @param code - Error code from NostrErrorCode
     * @param details - Additional error details
     */
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'NostrError';
    }
}
export var NostrErrorCode;
(function (NostrErrorCode) {
    NostrErrorCode["INVALID_KEY"] = "INVALID_KEY";
    NostrErrorCode["ENCRYPTION_FAILED"] = "ENCRYPTION_FAILED";
    NostrErrorCode["DECRYPTION_FAILED"] = "DECRYPTION_FAILED";
    NostrErrorCode["RELAY_CONNECTION_FAILED"] = "RELAY_CONNECTION_FAILED";
    NostrErrorCode["INVALID_EVENT"] = "INVALID_EVENT";
    NostrErrorCode["MESSAGE_SEND_FAILED"] = "MESSAGE_SEND_FAILED";
    NostrErrorCode["EVENT_CREATION_ERROR"] = "EVENT_CREATION_ERROR";
    NostrErrorCode["PARSING_ERROR"] = "PARSING_ERROR";
    NostrErrorCode["FORMATTING_ERROR"] = "FORMATTING_ERROR";
    NostrErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    NostrErrorCode["CONNECTION_ERROR"] = "CONNECTION_ERROR";
    NostrErrorCode["RELAY_ERROR"] = "RELAY_ERROR";
    NostrErrorCode["VERIFICATION_FAILED"] = "VERIFICATION_FAILED";
    NostrErrorCode["TOKEN_GENERATION_ERROR"] = "TOKEN_GENERATION_ERROR";
    NostrErrorCode["CONFIGURATION_ERROR"] = "CONFIGURATION_ERROR";
    NostrErrorCode["GENERAL_ERROR"] = "GENERAL_ERROR";
})(NostrErrorCode || (NostrErrorCode = {}));
/**
 * Type guard to check if an object is a valid NostrWSClient
 * @param obj The object to check
 * @returns True if the object is a valid NostrWSClient
 */
export function isNostrWSClient(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const client = obj;
    return (typeof client.connect === 'function' &&
        typeof client.close === 'function' &&
        typeof client.sendMessage === 'function');
}
/**
 * Type guard to check if an object is a valid NostrEvent
 * @param obj The object to check
 * @returns True if the object is a valid NostrEvent
 */
export function isNostrEvent(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    const event = obj;
    return (typeof event.pubkey === 'string' &&
        typeof event.created_at === 'number' &&
        typeof event.kind === 'number' &&
        Array.isArray(event.tags) &&
        event.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string')) &&
        typeof event.content === 'string');
}
//# sourceMappingURL=nostr.js.map