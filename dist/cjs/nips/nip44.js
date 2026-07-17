"use strict";
/**
 * NIP-44: Versioned Encrypted Payloads
 * Implements NIP-44 encryption/decryption using ChaCha20 + HMAC
 * via nostr-crypto-utils/nip44.
 * Spec: https://github.com/nostr-protocol/nips/blob/master/44.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NIP44_KIND = void 0;
exports.encryptNip44 = encryptNip44;
exports.decryptNip44 = decryptNip44;
const nostr_crypto_utils_1 = require("nostr-crypto-utils");
/**
 * NIP-44 event kind for gift-wrapped direct messages
 */
exports.NIP44_KIND = 44;
/**
 * Encrypt a message using NIP-44 (ChaCha20 + HMAC)
 * @param message - The plaintext message to encrypt
 * @param privateKey - The sender's private key (hex format)
 * @param publicKey - The recipient's public key (hex format)
 * @returns Encrypted payload (base64-encoded)
 */
async function encryptNip44(message, privateKey, publicKey) {
    const privkeyBytes = (0, nostr_crypto_utils_1.hexToBytes)(privateKey);
    const conversationKey = nostr_crypto_utils_1.nip44.getConversationKey(privkeyBytes, publicKey);
    return nostr_crypto_utils_1.nip44.encrypt(message, conversationKey);
}
/**
 * Decrypt a NIP-44 encrypted payload
 * @param payload - The encrypted payload (base64-encoded)
 * @param privateKey - The recipient's private key (hex format)
 * @param publicKey - The sender's public key (hex format)
 * @returns Decrypted plaintext string
 */
async function decryptNip44(payload, privateKey, publicKey) {
    const privkeyBytes = (0, nostr_crypto_utils_1.hexToBytes)(privateKey);
    const conversationKey = nostr_crypto_utils_1.nip44.getConversationKey(privkeyBytes, publicKey);
    return nostr_crypto_utils_1.nip44.decrypt(payload, conversationKey);
}
//# sourceMappingURL=nip44.js.map