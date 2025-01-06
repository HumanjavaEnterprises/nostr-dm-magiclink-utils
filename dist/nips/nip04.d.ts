/**
 * Encrypts a message following NIP-04 specification
 * @param message - The message to encrypt
 * @param privateKey - The sender's private key (hex format)
 * @param publicKey - The recipient's public key (hex format)
 * @returns Promise resolving to the encrypted message
 * @throws NostrError if encryption fails or inputs are invalid
 */
export declare function encryptMessage(message: string, privateKey: string, publicKey: string): Promise<string>;
/**
 * Decrypts a message following NIP-04 specification
 * @param encryptedMessage - The encrypted message to decrypt
 * @param privateKey - The recipient's private key
 * @param publicKey - The sender's public key
 * @returns Promise resolving to the decrypted message
 * @throws NostrError if decryption fails
 */
export declare function decryptMessage(encryptedMessage: string, privateKey: string, publicKey: string): Promise<string>;
//# sourceMappingURL=nip04.d.ts.map