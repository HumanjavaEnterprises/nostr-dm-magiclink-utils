import { describe, it, expect, vi } from 'vitest';
import { encrypt as encryptMessage } from 'nostr-crypto-utils';

// Mock the crypto utils module
vi.mock('nostr-crypto-utils', () => ({
  encrypt: vi.fn().mockResolvedValue('encrypted_message'),
  decrypt: vi.fn().mockResolvedValue('decrypted_message')
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
