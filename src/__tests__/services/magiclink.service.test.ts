import { describe, expect, it, vi } from 'vitest';
import { MagicLinkManager } from '../../services/magiclink.service.js';
import { NostrService } from '../../services/nostr.service.js';
import { MagicLinkConfig } from '../../types/index.js';
import jwt from 'jsonwebtoken';

// Mock external dependencies
vi.mock('nostr-crypto-utils', () => ({
  generateKeyPair: vi.fn().mockResolvedValue({
    publicKey: 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
    privateKey: 'test-private-key'
  }),
  getPublicKeySync: vi.fn().mockReturnValue('fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210'),
  encryptMessage: vi.fn().mockResolvedValue('encrypted-content'),
  decryptMessage: vi.fn().mockResolvedValue('decrypted-content'),
  finalizeEvent: vi.fn().mockResolvedValue({ id: 'mock_id', sig: 'mock_sig' }),
  hexToBytes: vi.fn().mockImplementation((hex: string) => new Uint8Array(hex.length / 2)),
  nip44: {
    getConversationKey: vi.fn().mockReturnValue(new Uint8Array(32)),
    encrypt: vi.fn().mockReturnValue('nip44_encrypted'),
    decrypt: vi.fn().mockReturnValue('nip44_decrypted'),
  },
}));

/**
 * Helper: extract the token from the mock sendDirectMessage call.
 * The magic link is sent via DM (not returned in the response),
 * so we parse it from the message argument.
 */
function extractTokenFromMock(mockNostrService: { sendDirectMessage: ReturnType<typeof vi.fn> }): string {
  const message: string = mockNostrService.sendDirectMessage.mock.calls[0][1];
  const urlMatch = message.match(/https?:\/\/\S+/);
  if (!urlMatch) throw new Error('No URL found in DM message');
  return new URL(urlMatch[0]).searchParams.get('token')!;
}

// Valid 64-char hex x-only pubkey used as the recipient in tests
const VALID_PUBKEY = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';

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
    return { service, mockNostrService: mockNostrService as unknown as { sendDirectMessage: ReturnType<typeof vi.fn> } };
  }

  it('should send magic link successfully', async () => {
    const { service, mockNostrService } = createService();

    const result = await service.sendMagicLink({
      recipientPubkey: VALID_PUBKEY,
      messageOptions: {
        locale: 'en'
      }
    });

    expect(result.success).toBe(true);
    // magicLink is intentionally NOT returned in the response (security)
    // Verify the DM was sent with the link
    expect(mockNostrService.sendDirectMessage).toHaveBeenCalledWith(
      VALID_PUBKEY,
      expect.stringContaining('https://example.com/verify')
    );
  });

  it('should generate unique JWT tokens per request', async () => {
    const { service, mockNostrService } = createService();

    await service.sendMagicLink({ recipientPubkey: VALID_PUBKEY });
    const token1 = extractTokenFromMock(mockNostrService);

    mockNostrService.sendDirectMessage.mockClear();
    await service.sendMagicLink({ recipientPubkey: VALID_PUBKEY });
    const token2 = extractTokenFromMock(mockNostrService);

    // Tokens must be different (unique jti per request)
    expect(token1).not.toBe(token2);
  });

  it('should embed pubkey in JWT payload', async () => {
    const { service, mockNostrService } = createService();

    await service.sendMagicLink({ recipientPubkey: VALID_PUBKEY });
    const token = extractTokenFromMock(mockNostrService);

    const decoded = jwt.verify(token, JWT_SECRET) as { pubkey: string; jti: string };
    expect(decoded.pubkey).toBe(VALID_PUBKEY);
    expect(decoded.jti).toBeDefined();
    expect(typeof decoded.jti).toBe('string');
    expect(decoded.jti.length).toBe(32); // 16 bytes hex = 32 chars
  });

  it('should verify a valid magic link token', async () => {
    const { service, mockNostrService } = createService();

    await service.sendMagicLink({ recipientPubkey: VALID_PUBKEY });
    const token = extractTokenFromMock(mockNostrService);

    const pubkey = await service.verifyMagicLink(token);
    expect(pubkey).toBe(VALID_PUBKEY);
  });

  it('should reject a token that has already been used (single-use enforcement)', async () => {
    const { service, mockNostrService } = createService();

    await service.sendMagicLink({ recipientPubkey: VALID_PUBKEY });
    const token = extractTokenFromMock(mockNostrService);

    // First use should succeed
    const pubkey = await service.verifyMagicLink(token);
    expect(pubkey).toBe(VALID_PUBKEY);

    // Second use should fail
    await expect(service.verifyMagicLink(token)).rejects.toThrow('Failed to verify magic link');
  });

  it('should reject a token without a jti claim', async () => {
    const { service } = createService();

    // Craft a JWT without jti
    const tokenWithoutJti = jwt.sign({ pubkey: VALID_PUBKEY }, JWT_SECRET, { expiresIn: '15m' });

    await expect(service.verifyMagicLink(tokenWithoutJti)).rejects.toThrow('Failed to verify magic link');
  });

  it('should fall back to config.token as JWT secret when jwtSecret is not set', async () => {
    const fallbackSecret = 'my-fallback-secret-string';
    const { service, mockNostrService } = createService({
      jwtSecret: undefined,
      token: fallbackSecret,
    });

    await service.sendMagicLink({ recipientPubkey: VALID_PUBKEY });
    const token = extractTokenFromMock(mockNostrService);

    // Should be verifiable with the fallback secret
    const decoded = jwt.verify(token, fallbackSecret) as { pubkey: string };
    expect(decoded.pubkey).toBe(VALID_PUBKEY);

    // And should be verifiable through the service
    // Need a fresh token since the first was consumed by jwt.verify above
    mockNostrService.sendDirectMessage.mockClear();
    await service.sendMagicLink({ recipientPubkey: VALID_PUBKEY });
    const token2 = extractTokenFromMock(mockNostrService);
    const pubkey = await service.verifyMagicLink(token2);
    expect(pubkey).toBe(VALID_PUBKEY);
  });

  it('should include tokenData in JWT when config.token is a function', async () => {
    const jwtSecret = 'explicit-jwt-secret-for-function-test';
    const { service, mockNostrService } = createService({
      jwtSecret,
      token: vi.fn().mockResolvedValue('dynamic-data-value') as unknown as (() => Promise<string>),
    });

    await service.sendMagicLink({ recipientPubkey: VALID_PUBKEY });
    const token = extractTokenFromMock(mockNostrService);

    const decoded = jwt.verify(token, jwtSecret) as { pubkey: string; tokenData: string };
    expect(decoded.pubkey).toBe(VALID_PUBKEY);
    expect(decoded.tokenData).toBe('dynamic-data-value');
  });

  it('should replace EVERY occurrence of a repeated placeholder in the template', async () => {
    const { service, mockNostrService } = createService();

    // {{link}} appears twice: as visible text and inside markup. Both must be
    // substituted (regression test for String.replace-only-first-occurrence).
    await service.sendMagicLink({
      recipientPubkey: VALID_PUBKEY,
      messageOptions: {
        template: 'Login: {{link}} — or copy this URL: {{link}}',
      },
    });

    const message: string = mockNostrService.sendDirectMessage.mock.calls[0][1];
    // No unrendered placeholder should remain
    expect(message).not.toContain('{{link}}');
    // The link should appear twice (both placeholders rendered)
    const occurrences = message.split('https://example.com/verify').length - 1;
    expect(occurrences).toBe(2);
  });

  it('should reject sendMagicLink with an invalid (non-64-hex) recipient pubkey', async () => {
    const { service, mockNostrService } = createService();

    await expect(
      service.sendMagicLink({ recipientPubkey: 'not-a-valid-pubkey' })
    ).rejects.toThrow('Failed to send magic link');
    // The DM must never be attempted for an invalid recipient
    expect(mockNostrService.sendDirectMessage).not.toHaveBeenCalled();
  });
});
