import { config } from 'dotenv';
import { beforeAll, afterAll, vi } from 'vitest';

// Load environment variables
config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3003';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MAGIC_LINK_BASE_URL = 'http://localhost:3003/auth/magiclink/verify';

// Mock console methods
global.console.log = vi.fn();
global.console.error = vi.fn();
global.console.warn = vi.fn();
global.console.info = vi.fn();

// Mock timers
vi.useFakeTimers();

// Mock crypto-utils functions
vi.mock('nostr-crypto-utils', () => ({
  createKeyPair: vi.fn().mockReturnValue({
    privateKey: 'test-private-key',
    publicKey: 'test-public-key'
  }),
  validateKeyPair: vi.fn().mockReturnValue(true),
  encrypt: vi.fn().mockResolvedValue('encrypted-content'),
  decrypt: vi.fn().mockResolvedValue('decrypted-message'),
  getEventHash: vi.fn().mockReturnValue('test-hash'),
  signEvent: vi.fn().mockReturnValue('test-signature'),
  getPublicKey: vi.fn().mockResolvedValue({ hex: 'test-public-key', bytes: new Uint8Array(32) }),
  getPublicKeySync: vi.fn().mockReturnValue('test-public-key'),
  finalizeEvent: vi.fn().mockImplementation((event: Record<string, unknown>) => ({
    id: 'test-event-id',
    pubkey: event.pubkey || 'test-public-key',
    created_at: (event.created_at as number) || Math.floor(Date.now() / 1000),
    kind: (event.kind as number) || 1,
    tags: event.tags || [],
    content: (event.content as string) || '',
    sig: 'test-signature',
  })),
  hexToBytes: vi.fn().mockImplementation((hex: string) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }),
  nip44: {
    getConversationKey: vi.fn().mockReturnValue(new Uint8Array(32)),
    encrypt: vi.fn().mockImplementation((plaintext: string) => `nip44_encrypted_${plaintext}`),
    decrypt: vi.fn().mockImplementation(() => 'nip44_decrypted_message'),
  },
}));

// Mock pino logger
vi.mock('pino', () => {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    child: vi.fn().mockReturnThis()
  };

  return vi.fn().mockReturnValue(mockLogger);
});

beforeAll(() => {
  // Any global setup
});

afterAll(() => {
  // Any global cleanup
  vi.clearAllMocks();
});
