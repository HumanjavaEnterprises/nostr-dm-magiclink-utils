import { describe, it, expect } from 'vitest';
import * as nostrCrypto from 'nostr-crypto-utils';

describe('nostr-crypto-utils exports', () => {
  it('should have core exports available', () => {
    expect(nostrCrypto).toBeDefined();
    expect(typeof nostrCrypto.encrypt).toBe('function');
    expect(typeof nostrCrypto.getPublicKeySync).toBe('function');
    expect(typeof nostrCrypto.finalizeEvent).toBe('function');
    expect(nostrCrypto.nip44).toBeDefined();
  });
});
