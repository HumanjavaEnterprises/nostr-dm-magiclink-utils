import express from 'express';
import { NostrCrypto, NostrEvent } from 'nostr-crypto-utils';
import { randomBytes } from 'crypto';

const app = express();
app.use(express.json());

// In-memory store for platform registrations (use a proper database in production)
const platforms = new Map<string, {
  pubkey: string;
  delegatedEvent: NostrEvent;
  expiresAt: number;
}>();

// Generate a secure platform ID
const generatePlatformId = () => {
  return randomBytes(16).toString('hex');
};

// Initialize NostrCrypto
const nostrCrypto = new NostrCrypto();

// Generate or load your service keys (in production, use secure key management)
const SERVICE_PRIVKEY = process.env.SERVICE_PRIVKEY || nostrCrypto.generatePrivateKey();
const SERVICE_PUBKEY = nostrCrypto.getPublicKey(SERVICE_PRIVKEY);

// Register a new platform
app.post('/register', async (req, res) => {
  const { platformPubkey } = req.body;
  
  if (!platformPubkey) {
    return res.status(400).json({ error: 'Platform public key required' });
  }

  try {
    // Generate delegation event valid for 30 days
    const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
    
    // Create delegation event
    const delegationEvent = await nostrCrypto.createDelegationEvent({
      delegator: SERVICE_PUBKEY,
      delegatee: platformPubkey,
      allowedEventKinds: [4], // Only allow DM events
      expiresAt
    });

    // Sign the delegation event
    const signedEvent = await nostrCrypto.signEvent(delegationEvent, SERVICE_PRIVKEY);

    // Generate platform ID
    const platformId = generatePlatformId();

    // Store platform details
    platforms.set(platformId, {
      pubkey: platformPubkey,
      delegatedEvent: signedEvent,
      expiresAt
    });

    // Return platform credentials
    res.json({
      platformId,
      servicePubkey: SERVICE_PUBKEY,
      delegationEvent: signedEvent,
      expiresAt
    });

  } catch (error) {
    console.error('Failed to create delegation:', error);
    res.status(500).json({ error: 'Failed to create delegation' });
  }
});

// Revoke a platform's access
app.post('/revoke', (req, res) => {
  const { platformId } = req.body;
  
  if (!platformId || !platforms.has(platformId)) {
    return res.status(404).json({ error: 'Platform not found' });
  }

  platforms.delete(platformId);
  res.json({ success: true });
});

// Get platform status
app.get('/platform/:platformId', (req, res) => {
  const { platformId } = req.params;
  const platform = platforms.get(platformId);
  
  if (!platform) {
    return res.status(404).json({ error: 'Platform not found' });
  }

  res.json({
    pubkey: platform.pubkey,
    expiresAt: platform.expiresAt,
    isExpired: platform.expiresAt < (Date.now() / 1000)
  });
});

// Cleanup expired tokens (run periodically)
const cleanupExpiredTokens = () => {
  const now = Date.now() / 1000;
  for (const [platformId, platform] of platforms.entries()) {
    if (platform.expiresAt < now) {
      platforms.delete(platformId);
    }
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Delegation service running at http://localhost:${port}`);
});
