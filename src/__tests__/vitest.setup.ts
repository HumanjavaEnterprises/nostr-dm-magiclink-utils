import { vi } from 'vitest';

// Mock crypto-related functions
vi.mock('nostr-crypto-utils', () => ({
  getPublicKey: vi.fn().mockImplementation((privateKey: string) => {
    // Return a deterministic public key based on private key
    return { hex: `pub_${privateKey}`, bytes: new Uint8Array(32) };
  }),
  getPublicKeySync: vi.fn().mockImplementation((privateKey: string) => {
    // Return a deterministic public key based on private key
    return `pub_${privateKey}`;
  }),
  signEvent: vi.fn().mockImplementation((_event: unknown, _privateKey: string) => {
    // Return a mock signed event
    return {
      id: 'mock_event_id',
      sig: 'mock_signature',
    };
  }),
  finalizeEvent: vi.fn().mockImplementation((event: Record<string, unknown>, _privateKey: string) => {
    return {
      id: 'mock_event_id',
      pubkey: event.pubkey || 'mock_pubkey',
      created_at: (event.created_at as number) || Math.floor(Date.now() / 1000),
      kind: (event.kind as number) || 1,
      tags: event.tags || [],
      content: (event.content as string) || '',
      sig: 'mock_signature',
    };
  }),
  verifySignature: vi.fn().mockImplementation(() => {
    // Always return true for tests
    return true;
  }),
  encrypt: vi.fn().mockImplementation((message: string) => {
    // Return a mock encrypted message
    return `encrypted_${message}`;
  }),
  decrypt: vi.fn().mockImplementation((_encrypted: string) => {
    return 'decrypted_message';
  }),
  encryptMessage: vi.fn().mockImplementation((message: string) => {
    // Return a mock encrypted message
    return `encrypted_${message}`;
  }),
  hexToBytes: vi.fn().mockImplementation((hex: string) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }),
  bytesToHex: vi.fn().mockImplementation((bytes: Uint8Array) => {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }),
  nip44: {
    getConversationKey: vi.fn().mockReturnValue(new Uint8Array(32)),
    encrypt: vi.fn().mockImplementation((plaintext: string) => `nip44_encrypted_${plaintext}`),
    decrypt: vi.fn().mockImplementation(() => 'nip44_decrypted_message'),
  },
}));

// Mock WebSocket client
vi.mock('nostr-websocket-utils', () => ({
  NostrWSClient: vi.fn().mockImplementation((urls: string[]) => ({
    urls,
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    sendMessage: vi.fn().mockResolvedValue(undefined)
  }))
}));

// Mock logger
vi.mock('pino', () => ({
  default: vi.fn().mockReturnValue({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  })
}));

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
