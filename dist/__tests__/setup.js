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
    signEvent: vi.fn().mockReturnValue('test-signature')
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
//# sourceMappingURL=setup.js.map