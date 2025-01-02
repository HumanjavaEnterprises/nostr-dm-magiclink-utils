import { vi } from 'vitest';

// Mock crypto-related functions
vi.mock('nostr-crypto-utils', () => ({
  getPublicKey: vi.fn().mockImplementation((privateKey: string) => {
    // Return a deterministic public key based on private key
    return `pub_${privateKey}`;
  }),
  signEvent: vi.fn().mockImplementation(() => {
    // Return a mock signature
    return 'mock_signature';
  }),
  verifySignature: vi.fn().mockImplementation(() => {
    // Always return true for tests
    return true;
  }),
  encryptMessage: vi.fn().mockImplementation((message: string) => {
    // Return a mock encrypted message
    return `encrypted_${message}`;
  })
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
