import { describe, expect, it, vi } from 'vitest';
import { MagicLinkService } from '../../services/magiclink.service';
import { NostrService } from '../../services/nostr.service';
import { MagicLinkConfig } from '../../types';

// Mock external dependencies
vi.mock('nostr-crypto-utils', () => ({
  generateKeyPair: vi.fn().mockResolvedValue({
    publicKey: 'test-public-key',
    privateKey: 'test-private-key'
  })
}));

describe('MagicLinkService', () => {
  it('should send magic link successfully', async () => {
    const mockNostrService = {
      sendDirectMessage: vi.fn().mockResolvedValue({ id: 'test-event-id' })
    } as unknown as NostrService;

    const config: MagicLinkConfig = {
      verifyUrl: 'https://example.com/verify',
      token: 'test-token'
    };

    const service = new MagicLinkService(mockNostrService, config);

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
});
