import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { NostrService } from '../../services/nostr.service.js';
import { SimplePool, Event, Relay, Filter, Sub } from 'nostr-tools';
import * as nostrTools from 'nostr-tools';

// Mock nostr-tools
jest.mock('nostr-tools', () => {
    const mockSimplePool = jest.fn().mockImplementation(() => ({
        ensureRelay: jest.fn(),
        publish: jest.fn(),
        list: jest.fn(),
        get: jest.fn(),
        sub: jest.fn(),
        close: jest.fn(),
        seenOn: jest.fn(),
        batchedList: jest.fn(),
        _conn: new Map(),
        _seenOn: new Map(),
        batchedByKey: new Map(),
        eoseSubTimeout: 0,
        seenOnTimeout: 0,
        getEventTimeout: 0
    }));

    return {
        SimplePool: mockSimplePool,
        generatePrivateKey: jest.fn(),
        getPublicKey: jest.fn(),
        getEventHash: jest.fn().mockReturnValue('test-event-hash'),
        signEvent: jest.fn().mockReturnValue('test-signature'),
        nip04: {
            encrypt: jest.fn(),
            decrypt: jest.fn()
        }
    };
});

describe('NostrService', () => {
    let nostrService: NostrService;
    let simplePool: jest.Mocked<SimplePool>;
    const privateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const relayUrl = 'wss://relay.damus.io';

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Set up mock implementations
        simplePool = new nostrTools.SimplePool() as jest.Mocked<SimplePool>;
        const mockRelay = { url: relayUrl } as Relay;
        const mockEvent: Event = {
            kind: 4,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: 'test-content',
            pubkey: 'test-pubkey',
            id: 'test-id',
            sig: 'test-sig'
        };

        // Set up mock implementations
        simplePool.ensureRelay.mockImplementation(async () => mockRelay);
        simplePool.publish.mockImplementation(() => [Promise.resolve()]);
        simplePool.list.mockImplementation(async <K extends number = number>() => Promise.resolve([mockEvent] as Event<K>[]));
        simplePool.sub.mockImplementation(<K extends number = number>() => ({} as Sub<K>));

        // Mock nostr-tools functions with proper types
        jest.spyOn(nostrTools, 'generatePrivateKey').mockReturnValue(privateKey);
        jest.spyOn(nostrTools, 'getPublicKey').mockReturnValue('test-pubkey');
        jest.spyOn(nostrTools.nip04, 'encrypt').mockResolvedValue('encrypted-message');
        jest.spyOn(nostrTools.nip04, 'decrypt').mockResolvedValue('decrypted-message');

        // Initialize NostrService with mocked SimplePool
        nostrService = new NostrService(relayUrl, privateKey);
    });

    it('should initialize with valid keys', () => {
        expect(nostrService).toBeDefined();
        expect(nostrTools.getPublicKey).toHaveBeenCalledWith(privateKey);
    });

    it('should connect to relay', async () => {
        await nostrService.connect();
        expect(simplePool.ensureRelay).toHaveBeenCalledWith(relayUrl);
    });

    it('should send DM successfully', async () => {
        const recipientPubkey = 'recipient-pubkey';
        const message = 'Test message';

        await nostrService.sendDM(recipientPubkey, message);

        expect(nostrTools.nip04.encrypt).toHaveBeenCalledWith(
            privateKey,
            recipientPubkey,
            message
        );
        expect(simplePool.publish).toHaveBeenCalled();
    });

    it('should receive DM successfully', async () => {
        const senderPubkey = 'sender-pubkey';
        const mockEvent: Event = {
            kind: 4,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: 'encrypted-message',
            pubkey: senderPubkey,
            id: 'test-id',
            sig: 'test-sig'
        };

        simplePool.list.mockImplementation(async <K extends number = number>() => Promise.resolve([mockEvent] as Event<K>[]));

        const message = await nostrService.receiveDM(senderPubkey);
        
        expect(message).toBe('decrypted-message');
        expect(nostrTools.nip04.decrypt).toHaveBeenCalledWith(
            privateKey,
            senderPubkey,
            'encrypted-message'
        );
    });

    describe('sendMessage', () => {
        it('should handle encryption errors', async () => {
            const recipientPubkey = 'recipient-pubkey';
            const message = 'Test message';

            jest.spyOn(nostrTools.nip04, 'encrypt').mockRejectedValueOnce(new Error('Encryption failed'));

            await expect(nostrService.sendDM(recipientPubkey, message))
                .rejects.toThrow('Encryption failed');
        });
    });

    describe('receiveMessages', () => {
        it('should handle decryption errors', async () => {
            const senderPubkey = 'sender-pubkey';
            const mockEvent: Event = {
                kind: 4,
                created_at: Math.floor(Date.now() / 1000),
                tags: [],
                content: 'encrypted-message',
                pubkey: senderPubkey,
                id: 'test-id',
                sig: 'test-sig'
            };

            simplePool.list.mockImplementation(async <K extends number = number>() => Promise.resolve([mockEvent] as Event<K>[]));
            jest.spyOn(nostrTools.nip04, 'decrypt').mockRejectedValueOnce(new Error('Decryption failed'));

            const result = await nostrService.receiveDM(senderPubkey);
            expect(result).toBeNull();
        });
    });
});
