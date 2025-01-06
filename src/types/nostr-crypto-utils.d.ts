declare module 'nostr-crypto-utils' {
    export function encrypt(message: string, senderPrivateKey: string, recipientPublicKey: string): Promise<string>;
    export function decrypt(encryptedMessage: string, recipientPrivateKey: string, senderPublicKey: string): Promise<string>;
    export function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }>;
    export function getPublicKey(privateKey: string): Promise<string>;
    export function signEvent(event: any, privateKey: string): Promise<string>;
    export function verifySignature(event: any): Promise<boolean>;
}
