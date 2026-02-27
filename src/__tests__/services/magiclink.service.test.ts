import { describe, expect, it, vi } from 'vitest';
import { MagicLinkManager } from '../../services/magiclink.service.js';
import { NostrService } from '../../services/nostr.service.js';
import { MagicLinkConfig } from '../../types/index.js';
import jwt from 'jsonwebtoken';

// Mock external dependencies
vi.mock('nostr-crypto-utils', () => ({
  generateKeyPair: vi.fn().mockResolvedValue({
    publicKey: 'test-public-key',
    privateKey: 'test-private-key'
  })
}));

describe('MagicLinkManager', () => {
  const JWT_SECRET = 'test-jwt-secret-at-least-32-chars-long!!';

  function createService(configOverrides: Partial<MagicLinkConfig> = {}) {
    const mockNostrService = {
      sendDirectMessage: vi.fn().mockResolvedValue({ id: 'test-event-id' })
    } as unknown as NostrService;

    const config: MagicLinkConfig = {
      verifyUrl: 'https://example.com/verify',
      token: 'fallback-secret-value',
      jwtSecret: JWT_SECRET,
      ...configOverrides,
    };

    const service = new MagicLinkManager(mockNostrService, config);
    return { service, mockNostrService };
  }

  it('should send magic link successfully', async () => {
    const { service, mockNostrService } = createService();

    const result = await service.sendMagicLink({
      recipientPubkey: 'test-public-key',
      messageOptions: {
        locale: 'en'
      }
    });

    expect(result.success).toBe(true);
    expect(result.magicLink).toContain('https://example.com/verify');
    expect(mockNostrService.sendDirectMessage).toHaveBeenCalledWith(
      'test-public-key',
      expect.stringContaining('https://example.com/verify')
    );
  });

  it('should generate unique JWT tokens per request', async () => {
    const { service } = createService();

    const result1 = await service.sendMagicLink({
      recipientPubkey: 'test-public-key',
    });
    const result2 = await service.sendMagicLink({
      recipientPubkey: 'test-public-key',
    });

    // Tokens must be different (unique jti per request)
    const token1 = new URL(result1.magicLink!).searchParams.get('token');
    const token2 = new URL(result2.magicLink!).searchParams.get('token');
    expect(token1).not.toBe(token2);
  });

  it('should embed pubkey in JWT payload', async () => {
    const { service } = createService();

    const result = await service.sendMagicLink({
      recipientPubkey: 'test-public-key',
    });

    const token = new URL(result.magicLink!).searchParams.get('token')!;
    const decoded = jwt.verify(token, JWT_SECRET) as { pubkey: string; jti: string };
    expect(decoded.pubkey).toBe('test-public-key');
    expect(decoded.jti).toBeDefined();
    expect(typeof decoded.jti).toBe('string');
    expect(decoded.jti.length).toBe(32); // 16 bytes hex = 32 chars
  });

  it('should verify a valid magic link token', async () => {
    const { service } = createService();

    const result = await service.sendMagicLink({
      recipientPubkey: 'test-public-key',
    });

    const token = new URL(result.magicLink!).searchParams.get('token')!;
    const pubkey = await service.verifyMagicLink(token);
    expect(pubkey).toBe('test-public-key');
  });

  it('should reject a token that has already been used (single-use enforcement)', async () => {
    const { service } = createService();

    const result = await service.sendMagicLink({
      recipientPubkey: 'test-public-key',
    });

    const token = new URL(result.magicLink!).searchParams.get('token')!;

    // First use should succeed
    const pubkey = await service.verifyMagicLink(token);
    expect(pubkey).toBe('test-public-key');

    // Second use should fail
    await expect(service.verifyMagicLink(token)).rejects.toThrow('Failed to verify magic link');
  });

  it('should reject a token without a jti claim', async () => {
    const { service } = createService();

    // Craft a JWT without jti
    const tokenWithoutJti = jwt.sign({ pubkey: 'test-public-key' }, JWT_SECRET, { expiresIn: '15m' });

    await expect(service.verifyMagicLink(tokenWithoutJti)).rejects.toThrow('Failed to verify magic link');
  });

  it('should fall back to config.token as JWT secret when jwtSecret is not set', async () => {
    const fallbackSecret = 'my-fallback-secret-string';
    const { service } = createService({
      jwtSecret: undefined,
      token: fallbackSecret,
    });

    const result = await service.sendMagicLink({
      recipientPubkey: 'test-public-key',
    });

    const token = new URL(result.magicLink!).searchParams.get('token')!;

    // Should be verifiable with the fallback secret
    const decoded = jwt.verify(token, fallbackSecret) as { pubkey: string };
    expect(decoded.pubkey).toBe('test-public-key');

    // And should be verifiable through the service
    const pubkey = await service.verifyMagicLink(token);
    expect(pubkey).toBe('test-public-key');
  });

  it('should include tokenData in JWT when config.token is a function', async () => {
    const jwtSecret = 'explicit-jwt-secret-for-function-test';
    const { service } = createService({
      jwtSecret,
      token: vi.fn().mockResolvedValue('dynamic-data-value') as unknown as (() => Promise<string>),
    });

    const result = await service.sendMagicLink({
      recipientPubkey: 'test-public-key',
    });

    const token = new URL(result.magicLink!).searchParams.get('token')!;
    const decoded = jwt.verify(token, jwtSecret) as { pubkey: string; tokenData: string };
    expect(decoded.pubkey).toBe('test-public-key');
    expect(decoded.tokenData).toBe('dynamic-data-value');
  });
});
