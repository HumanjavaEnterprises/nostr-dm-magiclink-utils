import { SimplePool, getPublicKey, getEventHash, signEvent, Event } from 'nostr-tools';
import { nip04, nip19 } from 'nostr-tools';
import { createLogger } from '../utils/logger.js';
import { hexToBytes } from '@noble/hashes/utils';
import { schnorr } from '@noble/curves/secp256k1';

const logger = createLogger('NostrService');

export class NostrService {
    private pool: SimplePool;
    private privateKey: string;
    private pubkey: string;
    private relayUrl: string;

    constructor(relayUrl: string, privateKey: string) {
        if (!privateKey) {
            throw new Error('Private key is required');
        }

        // Clean and validate private key
        const cleanKey = privateKey.replace('0x', '').trim();
        if (!/^[0-9a-f]{64}$/.test(cleanKey)) {
            throw new Error('Private key must be a 64-character hex string');
        }

        try {
            // Keep the hex string for nostr-tools
            this.privateKey = cleanKey;
            this.pubkey = getPublicKey(cleanKey);
            this.relayUrl = relayUrl;
            this.pool = new SimplePool();
            logger.info('Nostr service initialized with pubkey:', this.pubkey);
        } catch (error) {
            logger.error('Failed to initialize Nostr service:', error);
            throw new Error('Invalid private key format');
        }
    }

    async connect(): Promise<void> {
        try {
            await this.pool.ensureRelay(this.relayUrl);
            logger.info('Connected to Nostr relay');
        } catch (error) {
            logger.error('Failed to connect to Nostr relay:', error);
            throw error;
        }
    }

    async sendDM(recipientPubkey: string, message: string): Promise<void> {
        try {
            const encryptedContent = await nip04.encrypt(
                this.privateKey,
                recipientPubkey,
                message
            );

            const event: Event = {
                kind: 4,
                pubkey: this.pubkey,
                created_at: Math.floor(Date.now() / 1000),
                tags: [['p', recipientPubkey]],
                content: encryptedContent,
                id: '',  // Will be set by getEventHash
                sig: ''  // Will be set by signEvent
            };

            // Sign the event
            event.id = getEventHash(event);
            event.sig = signEvent(event, this.privateKey);

            await this.pool.publish([this.relayUrl], event);
            logger.info('DM sent successfully');
        } catch (error) {
            logger.error('Failed to send DM:', error);
            throw error;
        }
    }

    async receiveDM(senderPubkey: string): Promise<string | null> {
        try {
            const events = await this.pool.list([this.relayUrl], [{
                kinds: [4],
                authors: [senderPubkey],
                '#p': [this.pubkey],
                limit: 1,
            }]);

            if (!events || events.length === 0) {
                return null;
            }

            const event = events[0];
            const decryptedContent = await nip04.decrypt(
                this.privateKey,
                event.pubkey,
                event.content
            );

            return decryptedContent;
        } catch (error) {
            logger.error('Failed to receive DM:', error);
            return null;
        }
    }

    async formatPubkey(pubkey: string): Promise<string> {
        return nip19.npubEncode(pubkey);
    }

    async verifyDM(senderPubkey: string, expectedContent: string): Promise<boolean> {
        try {
            const receivedContent = await this.receiveDM(senderPubkey);
            return receivedContent === expectedContent;
        } catch (error) {
            logger.error('Failed to verify DM:', error);
            return false;
        }
    }

    disconnect(): void {
        this.pool.close([this.relayUrl]);
        logger.info('Disconnected from Nostr relay');
    }
}
