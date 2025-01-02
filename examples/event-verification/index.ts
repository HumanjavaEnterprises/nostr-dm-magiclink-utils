import { NostrCrypto, NostrEvent } from 'nostr-crypto-utils';
import { EventEmitter } from 'events';

class EventVerifier extends EventEmitter {
  private nostrCrypto: NostrCrypto;
  private trustedPubkeys: Set<string>;
  private delegations: Map<string, {
    delegator: string;
    delegatee: string;
    expiresAt: number;
    kinds: number[];
  }>;

  constructor(trustedPubkeys: string[] = []) {
    super();
    this.nostrCrypto = new NostrCrypto();
    this.trustedPubkeys = new Set(trustedPubkeys);
    this.delegations = new Map();
  }

  // Add trusted pubkey
  addTrustedPubkey(pubkey: string) {
    this.trustedPubkeys.add(pubkey);
  }

  // Remove trusted pubkey
  removeTrustedPubkey(pubkey: string) {
    this.trustedPubkeys.delete(pubkey);
  }

  // Add delegation
  addDelegation(delegationEvent: NostrEvent) {
    try {
      // Verify delegation event signature
      if (!this.nostrCrypto.verifySignature(delegationEvent)) {
        throw new Error('Invalid delegation event signature');
      }

      // Extract delegation details
      const delegator = delegationEvent.pubkey;
      const delegatee = delegationEvent.tags.find(t => t[0] === 'p')?.[1];
      const conditions = delegationEvent.tags.find(t => t[0] === 'conditions')?.[1];

      if (!delegatee || !conditions) {
        throw new Error('Missing delegation details');
      }

      // Parse conditions
      const [kindsStr, untilStr] = conditions.split('&');
      const kinds = kindsStr.split('|').map(k => parseInt(k.replace('kind=', '')));
      const until = parseInt(untilStr.replace('created_at<', ''));

      // Store delegation
      this.delegations.set(delegationEvent.id, {
        delegator,
        delegatee,
        kinds,
        expiresAt: until
      });

      this.emit('delegationAdded', {
        id: delegationEvent.id,
        delegator,
        delegatee,
        kinds,
        expiresAt: until
      });

    } catch (error) {
      console.error('Failed to add delegation:', error);
      throw error;
    }
  }

  // Verify event
  async verifyEvent(event: NostrEvent): Promise<{
    valid: boolean;
    reason?: string;
    delegated?: boolean;
  }> {
    try {
      // Basic signature verification
      if (!this.nostrCrypto.verifySignature(event)) {
        return { valid: false, reason: 'Invalid signature' };
      }

      // Check if pubkey is trusted
      if (this.trustedPubkeys.has(event.pubkey)) {
        return { valid: true };
      }

      // Check delegations
      for (const [id, delegation] of this.delegations) {
        // Skip expired delegations
        if (delegation.expiresAt < (Date.now() / 1000)) {
          this.delegations.delete(id);
          continue;
        }

        // Check if event matches delegation
        if (
          delegation.delegatee === event.pubkey &&
          delegation.kinds.includes(event.kind) &&
          this.trustedPubkeys.has(delegation.delegator)
        ) {
          return { valid: true, delegated: true };
        }
      }

      return { valid: false, reason: 'No valid authorization found' };

    } catch (error) {
      console.error('Failed to verify event:', error);
      return { valid: false, reason: 'Verification error' };
    }
  }

  // Verify magic link DM
  async verifyMagicLinkDM(event: NostrEvent): Promise<{
    valid: boolean;
    token?: string;
    reason?: string;
  }> {
    try {
      // First verify the event itself
      const verification = await this.verifyEvent(event);
      if (!verification.valid) {
        return { valid: false, reason: verification.reason };
      }

      // Verify it's a DM
      if (event.kind !== 4) {
        return { valid: false, reason: 'Not a DM event' };
      }

      // Extract and verify token from content
      const tokenMatch = event.content.match(/token=([a-zA-Z0-9-_]+)/);
      if (!tokenMatch) {
        return { valid: false, reason: 'No token found in DM' };
      }

      return {
        valid: true,
        token: tokenMatch[1]
      };

    } catch (error) {
      console.error('Failed to verify magic link DM:', error);
      return { valid: false, reason: 'Verification error' };
    }
  }
}

// Example usage
async function main() {
  const nostrCrypto = new NostrCrypto();

  // Create service keys
  const servicePrivkey = nostrCrypto.generatePrivateKey();
  const servicePubkey = nostrCrypto.getPublicKey(servicePrivkey);

  // Create verifier with trusted service pubkey
  const verifier = new EventVerifier([servicePubkey]);

  // Create and verify a magic link DM
  try {
    // Create magic link
    const token = 'example-token';
    const magicLink = `https://your-app.com/auth/verify?token=${token}`;
    const message = `Click this link to login to YourApp:\n\n${magicLink}\n\nOr copy and paste this link into your browser:\n${magicLink}`;

    // Create and sign DM event
    const encryptedContent = await nostrCrypto.encryptDM(
      message,
      servicePrivkey,
      'recipient-pubkey-here'
    );

    const event = await nostrCrypto.createEvent({
      kind: 4,
      content: encryptedContent,
      tags: [['p', 'recipient-pubkey-here']],
      created_at: Math.floor(Date.now() / 1000)
    });

    const signedEvent = await nostrCrypto.signEvent(event, servicePrivkey);

    // Verify the DM
    const verification = await verifier.verifyMagicLinkDM(signedEvent);
    console.log('Verification result:', verification);

  } catch (error) {
    console.error('Example failed:', error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
