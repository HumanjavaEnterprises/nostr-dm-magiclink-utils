"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
// Mock crypto-related functions
vitest_1.vi.mock('nostr-crypto-utils', () => ({
    getPublicKey: vitest_1.vi.fn().mockImplementation((privateKey) => {
        // Return a deterministic public key based on private key
        return { hex: `pub_${privateKey}`, bytes: new Uint8Array(32) };
    }),
    getPublicKeySync: vitest_1.vi.fn().mockImplementation((privateKey) => {
        // Return a deterministic public key based on private key
        return `pub_${privateKey}`;
    }),
    signEvent: vitest_1.vi.fn().mockImplementation((_event, _privateKey) => {
        // Return a mock signed event
        return {
            id: 'mock_event_id',
            sig: 'mock_signature',
        };
    }),
    finalizeEvent: vitest_1.vi.fn().mockImplementation((event, _privateKey) => {
        return {
            id: 'mock_event_id',
            pubkey: event.pubkey || 'mock_pubkey',
            created_at: event.created_at || Math.floor(Date.now() / 1000),
            kind: event.kind || 1,
            tags: event.tags || [],
            content: event.content || '',
            sig: 'mock_signature',
        };
    }),
    verifySignature: vitest_1.vi.fn().mockImplementation(() => {
        // Always return true for tests
        return true;
    }),
    encrypt: vitest_1.vi.fn().mockImplementation((message) => {
        // Return a mock encrypted message
        return `encrypted_${message}`;
    }),
    decrypt: vitest_1.vi.fn().mockImplementation((_encrypted) => {
        return 'decrypted_message';
    }),
    encryptMessage: vitest_1.vi.fn().mockImplementation((message) => {
        // Return a mock encrypted message
        return `encrypted_${message}`;
    }),
    hexToBytes: vitest_1.vi.fn().mockImplementation((hex) => {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return bytes;
    }),
    bytesToHex: vitest_1.vi.fn().mockImplementation((bytes) => {
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }),
    nip44: {
        getConversationKey: vitest_1.vi.fn().mockReturnValue(new Uint8Array(32)),
        encrypt: vitest_1.vi.fn().mockImplementation((plaintext) => `nip44_encrypted_${plaintext}`),
        decrypt: vitest_1.vi.fn().mockImplementation(() => 'nip44_decrypted_message'),
    },
}));
// Mock WebSocket client
vitest_1.vi.mock('nostr-websocket-utils', () => ({
    NostrWSClient: vitest_1.vi.fn().mockImplementation((urls) => ({
        urls,
        connect: vitest_1.vi.fn().mockResolvedValue(undefined),
        disconnect: vitest_1.vi.fn().mockResolvedValue(undefined),
        sendMessage: vitest_1.vi.fn().mockResolvedValue(undefined)
    }))
}));
// Mock logger
vitest_1.vi.mock('pino', () => ({
    default: vitest_1.vi.fn().mockReturnValue({
        info: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn()
    })
}));
// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
//# sourceMappingURL=vitest.setup.js.map