declare module 'nostr-crypto-utils' {
    import { encryptMessage, decryptMessage } from 'nostr-crypto-utils/nips/nip-04';
    import { validatePublicKey, validatePrivateKey } from 'nostr-crypto-utils/utils/key-utils';
    import { generateKeyPair, generateRandomBytes } from 'nostr-crypto-utils/utils/crypto-utils';

    export function encrypt(message: string, senderPrivateKey: string, recipientPublicKey: string): Promise<string> {
        return encryptMessage(message, senderPrivateKey, recipientPublicKey);
    }

    export function decrypt(encryptedMessage: string, recipientPrivateKey: string, senderPublicKey: string): Promise<string> {
        return decryptMessage(encryptedMessage, recipientPrivateKey, senderPublicKey);
    }

    export function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
        return generateKeyPair();
    }

    export function getPublicKey(privateKey: string): Promise<string> {
        return generateKeyPair().then(keyPair => keyPair.publicKey);
    }

    export function signEvent(event: any, privateKey: string): Promise<string> {
        // This function is not explicitly defined in the provided code edit, 
        // so we will leave it as is for now.
        // TODO: Implement signEvent function
    }

    export function verifySignature(event: any): Promise<boolean> {
        // This function is not explicitly defined in the provided code edit, 
        // so we will leave it as is for now.
        // TODO: Implement verifySignature function
    }
}
