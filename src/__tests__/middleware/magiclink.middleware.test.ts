import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { NostrMagicLinkMiddleware, NostrMagicLinkConfig } from '../../middleware/magiclink.middleware.js';
import { MagicLinkService } from '../../services/magiclink.service.js';
import { NostrService } from '../../services/nostr.service.js';
import { SimplePool } from 'nostr-tools';
import bodyParser from 'body-parser';
import cors from 'cors';

jest.mock('../../services/magiclink.service.js');
jest.mock('../../services/nostr.service.js');

type MockedMagicLinkService = jest.Mocked<MagicLinkService>;
type MockedNostrService = jest.Mocked<NostrService>;

describe('NostrMagicLinkMiddleware', () => {
    let app: express.Application;
    let magicLinkService: MockedMagicLinkService;
    let nostrService: MockedNostrService;
    const validNpub = 'npub1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    beforeEach(() => {
        app = express();
        app.use(cors());
        app.use(express.json());

        // Create a properly typed mock of MagicLinkService
        magicLinkService = {
            createMagicLink: jest.fn(),
            verifyMagicLink: jest.fn(),
            cleanup: jest.fn(),
            sessions: new Map(),
            baseUrl: 'http://test.com',
            tokenExpiry: 300000,
            jwtSecret: 'test-secret'
        } as unknown as MockedMagicLinkService;

        // Set up mock implementations for MagicLinkService
        magicLinkService.createMagicLink.mockResolvedValue('test-token');
        magicLinkService.verifyMagicLink.mockResolvedValue(validNpub);

        // Create a properly typed mock of NostrService
        nostrService = {
            connect: jest.fn(),
            sendDM: jest.fn(),
            receiveDM: jest.fn(),
            formatPubkey: jest.fn(),
            verifyDM: jest.fn(),
            disconnect: jest.fn(),
            cleanup: jest.fn(),
            pool: {} as SimplePool,
            privateKey: 'test-private-key',
            pubkey: 'test-pubkey',
            relayUrl: 'wss://test.relay'
        } as unknown as MockedNostrService;

        // Set up mock implementations for NostrService
        nostrService.connect.mockResolvedValue();
        nostrService.sendDM.mockResolvedValue();
        nostrService.receiveDM.mockResolvedValue('test-message');
        nostrService.formatPubkey.mockResolvedValue('formatted-pubkey');
        nostrService.verifyDM.mockResolvedValue(true);

        const config: NostrMagicLinkConfig = {
            nostrService,
            magicLinkService
        };

        const middleware = new NostrMagicLinkMiddleware(config);
        app.use('/', middleware.router);
    });

    describe('POST /request', () => {
        it('should request magic link', async () => {
            const token = 'test-token';
            magicLinkService.createMagicLink.mockResolvedValue(token);
            nostrService.sendDM.mockResolvedValue();

            const response = await request(app)
                .post('/request')
                .send({ npub: validNpub });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Magic link sent');
            expect(magicLinkService.createMagicLink).toHaveBeenCalledWith(validNpub);
            expect(nostrService.sendDM).toHaveBeenCalledWith(validNpub, expect.stringContaining(token));
        });

        it('should handle malformed request body', async () => {
            const response = await request(app)
                .post('/request')
                .send('invalid-json');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('npub is required');
        });

        it('should handle empty request body', async () => {
            const response = await request(app)
                .post('/request')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('npub is required');
        });

        it('should handle invalid npub format', async () => {
            magicLinkService.createMagicLink.mockRejectedValueOnce(new Error('Invalid npub format'));

            const response = await request(app)
                .post('/request')
                .send({ npub: 'invalid-npub' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid npub format');
        });
    });

    describe('GET /verify', () => {
        it('should verify magic link token', async () => {
            const response = await request(app)
                .get('/verify')
                .query({ token: 'test-token' });

            expect(response.status).toBe(200);
            expect(response.body.npub).toBe(validNpub);
            expect(magicLinkService.verifyMagicLink).toHaveBeenCalledWith('test-token');
        });

        it('should reject invalid token', async () => {
            jest.mocked(magicLinkService.verifyMagicLink).mockResolvedValueOnce(null);

            const response = await request(app)
                .get('/verify')
                .query({ token: 'invalid-token' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid or expired token');
        });

        it('should handle missing token', async () => {
            const response = await request(app)
                .get('/verify');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Token is required');
        });

        it('should handle CORS preflight request', async () => {
            const response = await request(app)
                .options('/verify')
                .set('Origin', 'http://localhost:3000')
                .set('Access-Control-Request-Method', 'GET');

            expect(response.status).toBe(204);
            expect(response.headers['access-control-allow-origin']).toBe('*');
            expect(response.headers['access-control-allow-methods']).toBeDefined();
        });
    });
});
