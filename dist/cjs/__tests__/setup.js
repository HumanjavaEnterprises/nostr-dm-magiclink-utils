"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const vitest_1 = require("vitest");
// Load environment variables
(0, dotenv_1.config)();
// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3003';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MAGIC_LINK_BASE_URL = 'http://localhost:3003/auth/magiclink/verify';
// Mock console methods
global.console.log = vitest_1.vi.fn();
global.console.error = vitest_1.vi.fn();
global.console.warn = vitest_1.vi.fn();
global.console.info = vitest_1.vi.fn();
// Mock timers
vitest_1.vi.useFakeTimers();
// Mock crypto-utils functions
vitest_1.vi.mock('nostr-crypto-utils', () => ({
    createKeyPair: vitest_1.vi.fn().mockReturnValue({
        privateKey: 'test-private-key',
        publicKey: 'test-public-key'
    }),
    validateKeyPair: vitest_1.vi.fn().mockReturnValue(true),
    encryptMessage: vitest_1.vi.fn().mockResolvedValue('encrypted-content'),
    decryptMessage: vitest_1.vi.fn().mockResolvedValue('decrypted-message'),
    getEventHash: vitest_1.vi.fn().mockReturnValue('test-hash'),
    signEvent: vitest_1.vi.fn().mockReturnValue('test-signature'),
    getPublicKey: vitest_1.vi.fn().mockResolvedValue({ hex: 'test-public-key', bytes: new Uint8Array(32) }),
    getPublicKeySync: vitest_1.vi.fn().mockReturnValue('test-public-key'),
    finalizeEvent: vitest_1.vi.fn().mockImplementation((event) => ({
        id: 'test-event-id',
        pubkey: event.pubkey || 'test-public-key',
        created_at: event.created_at || Math.floor(Date.now() / 1000),
        kind: event.kind || 1,
        tags: event.tags || [],
        content: event.content || '',
        sig: 'test-signature',
    })),
    hexToBytes: vitest_1.vi.fn().mockImplementation((hex) => {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return bytes;
    }),
    nip44: {
        getConversationKey: vitest_1.vi.fn().mockReturnValue(new Uint8Array(32)),
        encrypt: vitest_1.vi.fn().mockImplementation((plaintext) => `nip44_encrypted_${plaintext}`),
        decrypt: vitest_1.vi.fn().mockImplementation(() => 'nip44_decrypted_message'),
    },
}));
// Mock pino logger
vitest_1.vi.mock('pino', () => {
    const mockLogger = {
        info: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
        child: vitest_1.vi.fn().mockReturnThis()
    };
    return vitest_1.vi.fn().mockReturnValue(mockLogger);
});
(0, vitest_1.beforeAll)(() => {
    // Any global setup
});
(0, vitest_1.afterAll)(() => {
    // Any global cleanup
    vitest_1.vi.clearAllMocks();
});
//# sourceMappingURL=setup.js.map