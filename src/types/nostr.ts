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
export function isSignedNostrEvent(obj: unknown): obj is SignedNostrEvent {
  if (!isNostrEvent(obj)) {
    return false;
  }

  const signedEvent = obj as SignedNostrEvent;
  return typeof signedEvent.id === 'string' && typeof signedEvent.sig === 'string';
}

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
export function isSignEventParams(obj: unknown): obj is SignEventParams {
  if (!isEventParams(obj)) {
    return false;
  }

  const signParams = obj as SignEventParams;
  return typeof signParams.privateKey === 'string';
}

/**
 * Type guard to check if an object is a valid EventParams
 * @param obj The object to check
 * @returns True if the object is a valid EventParams
 */
export function isEventParams(obj: unknown): obj is EventParams {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const eventParams = obj as Record<string, unknown>;

  return (
    typeof eventParams.kind === 'number' &&
    typeof eventParams.content === 'string' &&
    (eventParams.tags === undefined || (Array.isArray(eventParams.tags) && eventParams.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string')))) &&
    (eventParams.created_at === undefined || typeof eventParams.created_at === 'number') &&
    (eventParams.pubkey === undefined || typeof eventParams.pubkey === 'string')
  );
}

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
export function isNostrFilter(obj: unknown): obj is NostrFilter {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const filter = obj as Record<string, unknown>;

  return (
    (filter.ids === undefined || Array.isArray(filter.ids) && filter.ids.every(id => typeof id === 'string')) &&
    (filter.authors === undefined || Array.isArray(filter.authors) && filter.authors.every(author => typeof author === 'string')) &&
    (filter.kinds === undefined || Array.isArray(filter.kinds) && filter.kinds.every(kind => typeof kind === 'number')) &&
    (filter.since === undefined || typeof filter.since === 'number') &&
    (filter.until === undefined || typeof filter.until === 'number') &&
    (filter.limit === undefined || typeof filter.limit === 'number')
  );
}

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
export function isNostrRelay(obj: unknown): obj is NostrRelay {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const relay = obj as Record<string, unknown>;

  return (
    typeof relay.url === 'string' &&
    (relay.status === 'connected' || relay.status === 'disconnected' || relay.status === 'connecting' || relay.status === 'error') &&
    (relay.error === undefined || typeof relay.error === 'string')
  );
}

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
export function isNostrKeyPair(obj: unknown): obj is NostrKeyPair {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const keyPair = obj as Record<string, unknown>;

  return (
    typeof keyPair.publicKey === 'string' &&
    typeof keyPair.privateKey === 'string' &&
    (keyPair.seedPhrase === undefined || typeof keyPair.seedPhrase === 'string')
  );
}

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
export function isEncryptedMessage(obj: unknown): obj is EncryptedMessage {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const message = obj as Record<string, unknown>;

  return (
    typeof message.content === 'string' &&
    typeof message.iv === 'string' &&
    typeof message.sender === 'string' &&
    typeof message.recipient === 'string' &&
    typeof message.timestamp === 'number'
  );
}

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
export function isNostrMessage(obj: unknown): obj is NostrMessage {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const message = obj as Record<string, unknown>;

  return (
    typeof message.type === 'string' &&
    (isNostrEvent(message.payload) || isSignedNostrEvent(message.payload) || isNostrFilter(message.payload) || isNostrRelay(message.payload) || isNostrKeyPair(message.payload) || isEncryptedMessage(message.payload))
  );
}

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
export function isNostrSubscription(obj: unknown): obj is NostrSubscription {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const subscription = obj as Record<string, unknown>;

  return (
    typeof subscription.id === 'string' &&
    Array.isArray(subscription.filters) &&
    subscription.filters.every(filter => isNostrFilter(filter))
  );
}

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
export function isErrorDetails(obj: unknown): obj is ErrorDetails {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const details = obj as ErrorDetails;

  return (
    (details.relayUrl === undefined || typeof details.relayUrl === 'string') &&
    (details.pubkey === undefined || typeof details.pubkey === 'string') &&
    (details.event === undefined || isPartialNostrEvent(details.event)) &&
    (details.cause === undefined || details.cause instanceof Error || details.cause === undefined)
  );
}

/**
 * Type guard to check if an object is a valid Partial<NostrEvent>
 * @param obj The object to check
 * @returns True if the object is a valid Partial<NostrEvent>
 */
export function isPartialNostrEvent(obj: unknown): obj is Partial<NostrEvent> {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const event = obj as Record<string, unknown>;

  return (
    (event.pubkey === undefined || typeof event.pubkey === 'string') &&
    (event.created_at === undefined || typeof event.created_at === 'number') &&
    (event.kind === undefined || typeof event.kind === 'number') &&
    (event.tags === undefined || (Array.isArray(event.tags) && event.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string')))) &&
    (event.content === undefined || typeof event.content === 'string')
  );
}

/**
 * Custom error class for Nostr-related errors
 */
export class NostrError extends Error {
  /**
   * Creates a new NostrError
   * @param message - Error message
   * @param code - Error code from NostrErrorCode
   * @param details - Additional error details
   */
  constructor(
    message: string,
    public code: string,
    public details?: ErrorDetails
  ) {
    super(message);
    this.name = 'NostrError';
  }
}

export enum NostrErrorCode {
  INVALID_KEY = 'INVALID_KEY',
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  RELAY_CONNECTION_FAILED = 'RELAY_CONNECTION_FAILED',
  INVALID_EVENT = 'INVALID_EVENT',
  MESSAGE_SEND_FAILED = 'MESSAGE_SEND_FAILED',
  EVENT_CREATION_ERROR = 'EVENT_CREATION_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  FORMATTING_ERROR = 'FORMATTING_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  RELAY_ERROR = 'RELAY_ERROR',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  TOKEN_GENERATION_ERROR = 'TOKEN_GENERATION_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  GENERAL_ERROR = 'GENERAL_ERROR'
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
export function isNostrWSClient(obj: unknown): obj is NostrWSClient {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const client = obj as Record<string, unknown>;

  return (
    typeof client.connect === 'function' &&
    typeof client.close === 'function' &&
    typeof client.sendMessage === 'function'
  );
}

/**
 * Type guard to check if an object is a valid NostrEvent
 * @param obj The object to check
 * @returns True if the object is a valid NostrEvent
 */
export function isNostrEvent(obj: unknown): obj is NostrEvent {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const event = obj as Record<string, unknown>;

  return (
    typeof event.pubkey === 'string' &&
    typeof event.created_at === 'number' &&
    typeof event.kind === 'number' &&
    Array.isArray(event.tags) &&
    event.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string')) &&
    typeof event.content === 'string'
  );
}
