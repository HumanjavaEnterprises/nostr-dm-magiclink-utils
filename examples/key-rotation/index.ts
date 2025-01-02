import { NostrCrypto, NostrEvent } from 'nostr-crypto-utils';
import { EventEmitter } from 'events';

class KeyRotationService extends EventEmitter {
  private nostrCrypto: NostrCrypto;
  private currentPrivkey: string;
  private currentPubkey: string;
  private nextPrivkey: string;
  private nextPubkey: string;
  private rotationInterval: number;
  private timer: NodeJS.Timer | null = null;

  constructor(rotationIntervalHours = 24) {
    super();
    this.nostrCrypto = new NostrCrypto();
    this.rotationInterval = rotationIntervalHours * 60 * 60 * 1000;

    // Initialize current keys
    this.currentPrivkey = process.env.SERVICE_PRIVKEY || this.nostrCrypto.generatePrivateKey();
    this.currentPubkey = this.nostrCrypto.getPublicKey(this.currentPrivkey);

    // Generate next keys
    this.nextPrivkey = this.nostrCrypto.generatePrivateKey();
    this.nextPubkey = this.nostrCrypto.getPublicKey(this.nextPrivkey);
  }

  // Start key rotation
  start() {
    if (this.timer) {
      throw new Error('Key rotation already started');
    }

    this.timer = setInterval(() => this.rotate(), this.rotationInterval);
    console.log('Key rotation service started');
  }

  // Stop key rotation
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('Key rotation service stopped');
    }
  }

  // Get current keys
  getCurrentKeys() {
    return {
      privateKey: this.currentPrivkey,
      publicKey: this.currentPubkey
    };
  }

  // Get next keys
  getNextKeys() {
    return {
      privateKey: this.nextPrivkey,
      publicKey: this.nextPubkey
    };
  }

  // Rotate keys
  private rotate() {
    // Current becomes old
    const oldPrivkey = this.currentPrivkey;
    const oldPubkey = this.currentPubkey;

    // Next becomes current
    this.currentPrivkey = this.nextPrivkey;
    this.currentPubkey = this.nextPubkey;

    // Generate new next keys
    this.nextPrivkey = this.nostrCrypto.generatePrivateKey();
    this.nextPubkey = this.nostrCrypto.getPublicKey(this.nextPrivkey);

    // Emit rotation event
    this.emit('rotation', {
      old: { privateKey: oldPrivkey, publicKey: oldPubkey },
      current: { privateKey: this.currentPrivkey, publicKey: this.currentPubkey },
      next: { privateKey: this.nextPrivkey, publicKey: this.nextPubkey }
    });

    console.log('Keys rotated successfully');
  }

  // Send DM with current key
  async sendDM(recipientPubkey: string, content: string): Promise<NostrEvent> {
    const encryptedContent = await this.nostrCrypto.encryptDM(
      content,
      this.currentPrivkey,
      recipientPubkey
    );

    const event = await this.nostrCrypto.createEvent({
      kind: 4,
      content: encryptedContent,
      tags: [['p', recipientPubkey]],
      created_at: Math.floor(Date.now() / 1000)
    });

    return await this.nostrCrypto.signEvent(event, this.currentPrivkey);
  }

  // Send magic link DM
  async sendMagicLinkDM(recipientPubkey: string, token: string): Promise<NostrEvent> {
    const magicLink = `https://your-app.com/auth/verify?token=${token}`;
    const message = `Click this link to login to YourApp:\n\n${magicLink}\n\nOr copy and paste this link into your browser:\n${magicLink}`;
    
    return await this.sendDM(recipientPubkey, message);
  }
}

// Example usage
async function main() {
  // Create key rotation service with 1-hour rotation interval
  const keyService = new KeyRotationService(1);

  // Listen for key rotations
  keyService.on('rotation', (keys) => {
    console.log('Keys rotated:');
    console.log('- Old pubkey:', keys.old.publicKey);
    console.log('- Current pubkey:', keys.current.publicKey);
    console.log('- Next pubkey:', keys.next.publicKey);
  });

  // Start key rotation
  keyService.start();

  // Example: Send magic link DM
  try {
    const event = await keyService.sendMagicLinkDM(
      'recipient-pubkey-here',
      'example-token'
    );
    console.log('Magic link DM sent:', event);
  } catch (error) {
    console.error('Failed to send magic link DM:', error);
  }

  // Stop after 5 seconds for demo
  setTimeout(() => {
    keyService.stop();
    process.exit(0);
  }, 5000);
}

if (require.main === module) {
  main().catch(console.error);
}
