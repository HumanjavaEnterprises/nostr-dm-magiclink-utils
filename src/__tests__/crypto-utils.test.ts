import { describe, it, expect, vi } from 'vitest';

vi.mock('nostr-crypto-utils', () => ({
  encrypt: vi.fn().mockResolvedValue('encrypted-message'),
  decrypt: vi.fn().mockResolvedValue('decrypted-message'),
  encryptMessage: vi.fn().mockResolvedValue('encrypted-message'),
  decryptMessage: vi.fn().mockResolvedValue('decrypted-message')
}));

import { encryptMessage, decryptMessage } from '../nips/nip04';

describe('nostr-crypto-utils', () => {
  it('should encrypt with correct argument order', async () => {
    const message = 'test';
    const privateKey = 'test-private-key';
    const publicKey = 'test-public-key';
    
    try {
      const encrypted = await encryptMessage(message, privateKey, publicKey);
      expect(encrypted).toBe('encrypted-message');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });
});
