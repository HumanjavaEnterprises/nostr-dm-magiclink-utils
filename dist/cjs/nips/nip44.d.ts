/**
 * NIP-44: Versioned Encrypted Payloads
 * Implements NIP-44 encryption/decryption using ChaCha20 + HMAC
 * via nostr-crypto-utils/nip44.
 * Spec: https://github.com/nostr-protocol/nips/blob/master/44.md
 */
/**
 * NIP-44 event kind for gift-wrapped direct messages
 */
export declare const NIP44_KIND = 44;
/**
 * Encrypt a message using NIP-44 (ChaCha20 + HMAC)
 * @param message - The plaintext message to encrypt
 * @param privateKey - The sender's private key (hex format)
 * @param publicKey - The recipient's public key (hex format)
 * @returns Encrypted payload (base64-encoded)
 */
export declare function encryptNip44(message: string, privateKey: string, publicKey: string): Promise<string>;
/**
 * Decrypt a NIP-44 encrypted payload
 * @param payload - The encrypted payload (base64-encoded)
 * @param privateKey - The recipient's private key (hex format)
 * @param publicKey - The sender's public key (hex format)
 * @returns Decrypted plaintext string
 */
export declare function decryptNip44(payload: string, privateKey: string, publicKey: string): Promise<string>;
//# sourceMappingURL=nip44.d.ts.map