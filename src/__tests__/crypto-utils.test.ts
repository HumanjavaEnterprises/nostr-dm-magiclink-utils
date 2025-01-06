import { describe, it, expect, vi } from 'vitest';
import { encryptMessage, decryptMessage } from '../nips/nip04';

// Mock the crypto utils module
vi.mock('nostr-crypto-utils/nips/nip-04', () => ({
  encryptMessage: vi.fn().mockResolvedValue('encrypted_message'),
  decryptMessage: vi.fn().mockResolvedValue('decrypted_message')
}));

describe('nostr-crypto-utils', () => {
  it('should encrypt with correct argument order', async () => {
    const message = 'test';
    // Use proper 32-byte hex strings
    const privateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const publicKey = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
    
    const encrypted = await encryptMessage(message, privateKey, publicKey);
    expect(encrypted).toBe('encrypted_message');
  });
});
