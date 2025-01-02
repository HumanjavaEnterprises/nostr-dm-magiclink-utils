import { describe, expect, it, vi } from 'vitest';
import { validatePublicKey, validatePrivateKey } from '../../utils/key.utils';

// Mock crypto utils
vi.mock('nostr-crypto-utils', () => ({
  generateKeyPair: vi.fn().mockResolvedValue({
    publicKey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    privateKey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  })
}));

describe('Key Utils', () => {
  describe('validatePublicKey', () => {
    it('should validate a correct public key', () => {
      const publicKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
      expect(validatePublicKey(publicKey)).toBe(true);
    });
  });

  describe('validatePrivateKey', () => {
    it('should validate a correct private key', () => {
      const privateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
      expect(validatePrivateKey(privateKey)).toBe(true);
    });
  });
});
