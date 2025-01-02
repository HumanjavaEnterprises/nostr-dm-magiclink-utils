import { describe, it } from 'vitest';
import * as nostrCrypto from 'nostr-crypto-utils';

describe('nostr-crypto-utils exports', () => {
  it('should show available exports', () => {
    console.log('Available exports from nostr-crypto-utils:', Object.keys(nostrCrypto));
  });
});
