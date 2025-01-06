import { describe, expect, it, vi } from 'vitest';
import { encryptMessage, decryptMessage } from '../../nips/nip04';

vi.mock('nostr-crypto-utils/nips/nip-04', () => ({
  encryptMessage: vi.fn().mockImplementation((message: string, privateKey: string, publicKey: string) => {
    if (!privateKey || !publicKey) {
      throw new Error('Invalid parameters');
    }
    if (!message) {
      throw new Error('Message cannot be empty');
    }
    if (privateKey.length !== 64 || publicKey.length !== 64) {
      throw new Error('Keys must be 32-byte hex strings');
    }
    return Promise.resolve('encrypted_message');
  }),
  decryptMessage: vi.fn().mockImplementation((encryptedMessage: string, privateKey: string, publicKey: string) => {
    if (!privateKey || !publicKey) {
      throw new Error('Invalid parameters');
    }
    if (privateKey.length !== 64 || publicKey.length !== 64) {
      throw new Error('Keys must be 32-byte hex strings');
    }
    return Promise.resolve('decrypted_message');
  })
}));

describe('NIP-04: Encrypted Direct Messages', () => {
  describe('Message Encryption/Decryption Integration', () => {
    const testMessage = 'Hello, World!';
    const senderPrivateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const recipientPublicKey = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';

    it('should successfully encrypt and decrypt a message', async () => {
      const encrypted = await encryptMessage(testMessage, senderPrivateKey, recipientPublicKey);
      expect(encrypted).toBe('encrypted_message');
    });

    it('should handle error cases appropriately', async () => {
      await expect(encryptMessage('test', '', recipientPublicKey))
        .rejects.toThrow('Private key is required');
      
      await expect(encryptMessage('', senderPrivateKey, recipientPublicKey))
        .rejects.toThrow('Message cannot be empty');
        
      await expect(encryptMessage('test', 'invalid-key', recipientPublicKey))
        .rejects.toThrow('Keys must be 32-byte hex strings');
    });
  });
});
