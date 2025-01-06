/**
 * Core Nostr types for magic link functionality
 */
/**
 * Base Nostr event interface
 */
export interface NostrEvent {
    pubkey: string;
    created_at: number;
    kind: number;
    tags: string[][];
    content: string;
}
/**
 * Signed Nostr event interface
 */
export interface SignedNostrEvent extends NostrEvent {
    id: string;
    sig: string;
}
/**
 * Type guard to check if an object is a valid SignedNostrEvent
 * @param obj The object to check
 * @returns True if the object is a valid SignedNostrEvent
 */
export declare function isSignedNostrEvent(obj: unknown): obj is SignedNostrEvent;
/**
 * Event parameters for creating a new event
 */
export interface EventParams {
    kind: number;
    content: string;
    tags?: string[][];
    created_at?: number;
    pubkey?: string;
}
/**
 * Event parameters for signing an event
 */
export interface SignEventParams extends EventParams {
    privateKey: string;
}
/**
 * Type guard to check if an object is a valid SignEventParams
 * @param obj The object to check
 * @returns True if the object is a valid SignEventParams
 */
export declare function isSignEventParams(obj: unknown): obj is SignEventParams;
/**
 * Type guard to check if an object is a valid EventParams
 * @param obj The object to check
 * @returns True if the object is a valid EventParams
 */
export declare function isEventParams(obj: unknown): obj is EventParams;
/**
 * Nostr filter for querying events
 */
export interface NostrFilter {
    ids?: string[];
    authors?: string[];
    kinds?: number[];
    since?: number;
    until?: number;
    limit?: number;
    [key: string]: string[] | number[] | number | undefined;
}
/**
 * Type guard to check if an object is a valid NostrFilter
 * @param obj The object to check
 * @returns True if the object is a valid NostrFilter
 */
export declare function isNostrFilter(obj: unknown): obj is NostrFilter;
/**
 * Nostr relay connection status
 */
export interface NostrRelay {
    url: string;
    status: 'connected' | 'disconnected' | 'connecting' | 'error';
    error?: string;
}
/**
 * Type guard to check if an object is a valid NostrRelay
 * @param obj The object to check
 * @returns True if the object is a valid NostrRelay
 */
export declare function isNostrRelay(obj: unknown): obj is NostrRelay;
/**
 * Nostr key pair
 */
export interface NostrKeyPair {
    publicKey: string;
    privateKey: string;
    seedPhrase?: string;
}
/**
 * Type guard to check if an object is a valid NostrKeyPair
 * @param obj The object to check
 * @returns True if the object is a valid NostrKeyPair
 */
export declare function isNostrKeyPair(obj: unknown): obj is NostrKeyPair;
/**
 * Encrypted message structure
 */
export interface EncryptedMessage {
    content: string;
    iv: string;
    sender: string;
    recipient: string;
    timestamp: number;
}
/**
 * Type guard to check if an object is a valid EncryptedMessage
 * @param obj The object to check
 * @returns True if the object is a valid EncryptedMessage
 */
export declare function isEncryptedMessage(obj: unknown): obj is EncryptedMessage;
/**
 * Nostr message type
 */
export interface NostrMessage {
    type: string;
    payload: NostrEvent | SignedNostrEvent | NostrFilter | NostrRelay | NostrKeyPair | EncryptedMessage;
}
/**
 * Type guard to check if an object is a valid NostrMessage
 * @param obj The object to check
 * @returns True if the object is a valid NostrMessage
 */
export declare function isNostrMessage(obj: unknown): obj is NostrMessage;
/**
 * Nostr subscription
 */
export interface NostrSubscription {
    id: string;
    filters: NostrFilter[];
}
/**
 * Type guard to check if an object is a valid NostrSubscription
 * @param obj The object to check
 * @returns True if the object is a valid NostrSubscription
 */
export declare function isNostrSubscription(obj: unknown): obj is NostrSubscription;
/**
 * Error details for Nostr operations
 */
export interface ErrorDetails {
    relayUrl?: string;
    pubkey?: string;
    event?: Partial<NostrEvent>;
    cause?: Error | unknown;
}
/**
 * Type guard to check if an object is a valid ErrorDetails
 * @param obj The object to check
 * @returns True if the object is a valid ErrorDetails
 */
export declare function isErrorDetails(obj: unknown): obj is ErrorDetails;
/**
 * Type guard to check if an object is a valid Partial<NostrEvent>
 * @param obj The object to check
 * @returns True if the object is a valid Partial<NostrEvent>
 */
export declare function isPartialNostrEvent(obj: unknown): obj is Partial<NostrEvent>;
/**
 * Custom error class for Nostr-related errors
 */
export declare class NostrError extends Error {
    code: string;
    details?: ErrorDetails | undefined;
    /**
     * Creates a new NostrError
     * @param message - Error message
     * @param code - Error code from NostrErrorCode
     * @param details - Additional error details
     */
    constructor(message: string, code: string, details?: ErrorDetails | undefined);
}
export declare enum NostrErrorCode {
    INVALID_KEY = "INVALID_KEY",
    ENCRYPTION_FAILED = "ENCRYPTION_FAILED",
    DECRYPTION_FAILED = "DECRYPTION_FAILED",
    RELAY_CONNECTION_FAILED = "RELAY_CONNECTION_FAILED",
    INVALID_EVENT = "INVALID_EVENT",
    MESSAGE_SEND_FAILED = "MESSAGE_SEND_FAILED",
    EVENT_CREATION_ERROR = "EVENT_CREATION_ERROR",
    PARSING_ERROR = "PARSING_ERROR",
    FORMATTING_ERROR = "FORMATTING_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    CONNECTION_ERROR = "CONNECTION_ERROR",
    RELAY_ERROR = "RELAY_ERROR",
    VERIFICATION_FAILED = "VERIFICATION_FAILED",
    TOKEN_GENERATION_ERROR = "TOKEN_GENERATION_ERROR",
    CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
    GENERAL_ERROR = "GENERAL_ERROR"
}
/**
 * Interface for WebSocket client used in Nostr communication
 */
export interface NostrWSClient {
    /**
     * Connect to the WebSocket server
     */
    connect(): Promise<void>;
    /**
     * Close the WebSocket connection
     */
    close(): Promise<void>;
    /**
     * Send a message through the WebSocket connection
     * @param message The message to send, containing an event
     */
    sendMessage(message: ['EVENT', NostrEvent]): Promise<void>;
}
/**
 * Type guard to check if an object is a valid NostrWSClient
 * @param obj The object to check
 * @returns True if the object is a valid NostrWSClient
 */
export declare function isNostrWSClient(obj: unknown): obj is NostrWSClient;
/**
 * Type guard to check if an object is a valid NostrEvent
 * @param obj The object to check
 * @returns True if the object is a valid NostrEvent
 */
export declare function isNostrEvent(obj: unknown): obj is NostrEvent;
//# sourceMappingURL=nostr.d.ts.map