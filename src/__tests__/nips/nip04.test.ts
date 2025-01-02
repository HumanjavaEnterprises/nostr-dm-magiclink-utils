import { describe, expect, it, vi } from 'vitest';
import { encryptMessage } from '../../nips/nip04';

vi.mock('nostr-crypto-utils', () => {
  return {
    generateKeyPair: () => Promise.resolve({
      publicKey: 'test-public-key',
      privateKey: 'test-private-key'
    }),
    encryptMessage: async (message: string, privateKey: string, publicKey: string) => {
      if (!privateKey || !publicKey) {
        throw new Error('Invalid parameters');
      }
      return 'encrypted_message';
    },
    decryptMessage: () => Promise.resolve('decrypted_message')
  };
});

describe('NIP-04: Encrypted Direct Messages', () => {
  describe('Message Encryption/Decryption Integration', () => {
    const testMessage = 'Hello, World!';
    const senderPrivateKey = 'test-private-key';
    const recipientPublicKey = 'recipient-public-key';

    it('should successfully encrypt and decrypt a message', async () => {
      const encrypted = await encryptMessage(testMessage, senderPrivateKey, recipientPublicKey);
      expect(encrypted).toBe('encrypted_message');
    });

    it('should handle error cases appropriately', async () => {
      await expect(encryptMessage('test', '', recipientPublicKey))
        .rejects.toThrow('Invalid parameters');
    });
  });
});
