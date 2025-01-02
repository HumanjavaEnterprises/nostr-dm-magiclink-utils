import { encryptMessage as encryptNip04, decryptMessage as decryptNip04 } from 'nostr-crypto-utils';
import { NostrError, NostrErrorCode } from '../types/errors';

/**
 * Encrypts a message following NIP-04 specification
 * @param message - The message to encrypt
 * @param privateKey - The sender's private key
 * @param publicKey - The recipient's public key
 * @returns Promise resolving to the encrypted message
 * @throws NostrError if encryption fails
 */
export async function encryptMessage(
  message: string,
  privateKey: string,
  publicKey: string
): Promise<string> {
  try {
    // Handle empty messages
    if (message === '') {
      message = ' ';
    }

    // Note: encryptNip04 expects (message, senderPrivkey, recipientPubkey)
    return await encryptNip04(message, privateKey, publicKey);
  } catch (error) {
    throw new NostrError('Message encryption failed: ' + (error as Error).message, NostrErrorCode.ENCRYPTION_FAILED);
  }
}

/**
 * Decrypts a message following NIP-04 specification
 * @param encryptedMessage - The encrypted message to decrypt
 * @param privateKey - The recipient's private key
 * @param publicKey - The sender's public key
 * @returns Promise resolving to the decrypted message
 * @throws NostrError if decryption fails
 */
export async function decryptMessage(
  encryptedMessage: string,
  privateKey: string,
  publicKey: string
): Promise<string> {
  try {
    // Note: decryptNip04 expects (encryptedContent, recipientPrivkey, senderPubkey)
    const decrypted = await decryptNip04(encryptedMessage, privateKey, publicKey);
    // Handle empty messages
    return decrypted === ' ' ? '' : decrypted;
  } catch (error) {
    throw new NostrError('Message decryption failed: ' + (error as Error).message, NostrErrorCode.DECRYPTION_FAILED);
  }
}
