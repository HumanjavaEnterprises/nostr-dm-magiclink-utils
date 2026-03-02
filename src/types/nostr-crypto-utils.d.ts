declare module 'nostr-crypto-utils' {
    export function encrypt(message: string, recipientPubKey: string, senderPrivKey: string): Promise<string>;

    export function decrypt(encryptedMessage: string, senderPubKey: string, recipientPrivKey: string): Promise<string>;

    export function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }>;

    export function getPublicKey(privateKey: string): Promise<{ hex: string; bytes: Uint8Array }>;

    export function getPublicKeySync(privateKey: string): string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function signEvent(event: any, privateKey: string): Promise<any>;

    export function finalizeEvent(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        event: any,
        privateKey: string
    ): Promise<{
        id: string;
        pubkey: string;
        created_at: number;
        kind: number;
        tags: string[][];
        content: string;
        sig: string;
    }>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function verifySignature(event: any): Promise<boolean>;

    export function validateKeyPair(keyPair: { publicKey: string; privateKey: string }): Promise<boolean>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function createEvent(event: any): any;

    export function hexToBytes(hex: string): Uint8Array;

    export function bytesToHex(bytes: Uint8Array): string;

    export const nip44: {
        getConversationKey(privkeyBytes: Uint8Array, pubkeyHex: string): Uint8Array;
        encrypt(plaintext: string, conversationKey: Uint8Array): string;
        decrypt(payload: string, conversationKey: Uint8Array): string;
    };

    export const nip46: {
        [key: string]: unknown;
    };

    export const nip49: {
        [key: string]: unknown;
    };
}
