import { describe, expect, it, beforeEach } from '@jest/globals';
import { MagicLinkService } from '../../services/magiclink.service.js';
import jwt from 'jsonwebtoken';

describe('MagicLinkService', () => {
    let magicLinkService: MagicLinkService;
    const testJwtSecret = 'test-secret';
    const testBaseUrl = 'https://example.com';
    const validNpub = 'npub1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    beforeEach(() => {
        magicLinkService = new MagicLinkService(testJwtSecret, testBaseUrl);
    });

    describe('createMagicLink', () => {
        it('should create a valid magic link token', async () => {
            const token = await magicLinkService.createMagicLink(validNpub);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = jwt.verify(token, testJwtSecret) as { npub: string };
            expect(decoded.npub).toBe(validNpub);
        });

        it('should throw error with invalid pubkey', async () => {
            await expect(magicLinkService.createMagicLink('')).rejects.toThrow('Invalid pubkey');
        });

        it('should create token with custom expiry', async () => {
            const token = await magicLinkService.createMagicLink(validNpub, 300);

            const decoded = jwt.verify(token, testJwtSecret) as { exp: number; iat: number };
            expect(decoded.exp - decoded.iat).toBe(300); // 5 minutes in seconds
        });
    });

    describe('verifyMagicLink', () => {
        it('should verify a valid token', async () => {
            const token = await magicLinkService.createMagicLink(validNpub);
            const result = await magicLinkService.verifyMagicLink(token);
            expect(result).toBe(validNpub);
        });

        it('should return null for an invalid token', async () => {
            const result = await magicLinkService.verifyMagicLink('invalid-token');
            expect(result).toBeNull();
        });

        it('should return null for an expired token', async () => {
            const expiredToken = jwt.sign(
                { npub: validNpub },
                testJwtSecret,
                { expiresIn: -1 } // Already expired
            );
            const result = await magicLinkService.verifyMagicLink(expiredToken);
            expect(result).toBeNull();
        });

        it('should handle malformed tokens', async () => {
            const result = await magicLinkService.verifyMagicLink('malformed.token.here');
            expect(result).toBeNull();
        });

        it('should handle tokens signed with different secret', async () => {
            const token = jwt.sign(
                { npub: validNpub },
                'different-secret',
                { expiresIn: '5m' }
            );
            const result = await magicLinkService.verifyMagicLink(token);
            expect(result).toBeNull();
        });
    });
});
