import express from 'express';
import { NostrCrypto } from 'nostr-crypto-utils';
import { LocaleService } from '../../src/locales';

const app = express();
app.use(express.json());

// Initialize services
const nostrCrypto = new NostrCrypto();
const localeService = new LocaleService('en'); // Default to English

// Generate service keys
const SERVICE_PRIVKEY = process.env.SERVICE_PRIVKEY || nostrCrypto.generatePrivateKey();
const SERVICE_PUBKEY = nostrCrypto.getPublicKey(SERVICE_PRIVKEY);

// Store magic links (use a proper database in production)
const magicLinks = new Map<string, { 
  pubkey: string; 
  expiresAt: number;
}>();

app.post('/auth/login', async (req, res) => {
  const { pubkey, locale = 'en' } = req.body;
  
  try {
    // Create magic link token
    const token = nostrCrypto.generateRandomBytes(32);
    const expiryMinutes = 15;
    const expiresAt = Math.floor(Date.now() / 1000) + (expiryMinutes * 60);
    
    // Store token
    magicLinks.set(token, { pubkey, expiresAt });
    
    // Create magic link
    const magicLink = `https://your-app.com/auth/verify?token=${token}`;
    
    // Set locale and generate message
    localeService.setLocale(locale);
    const message = localeService.formatMagicLinkMessage({
      appName: 'YourApp',
      magicLink,
      expiryMinutes
    });
    
    // Encrypt DM content
    const encryptedContent = await nostrCrypto.encryptDM(message, SERVICE_PRIVKEY, pubkey);
    
    // Create DM event
    const event = await nostrCrypto.createEvent({
      kind: 4, // DM
      content: encryptedContent,
      tags: [['p', pubkey]],
      created_at: Math.floor(Date.now() / 1000)
    });
    
    // Sign event
    const signedEvent = await nostrCrypto.signEvent(event, SERVICE_PRIVKEY);
    
    // In production, you would publish this to relays
    console.log('Signed DM event:', signedEvent);
    
    res.json({ 
      success: true,
      supportedLocales: localeService.getSupportedLocales()
    });
  } catch (error) {
    console.error('Failed to create magic link:', error);
    res.status(500).json({ error: 'Failed to create magic link' });
  }
});

app.get('/auth/verify', async (req, res) => {
  const { token } = req.query;
  
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid token' });
  }
  
  const magicLink = magicLinks.get(token);
  if (!magicLink) {
    return res.status(404).json({ error: 'Token not found' });
  }
  
  if (magicLink.expiresAt < (Date.now() / 1000)) {
    magicLinks.delete(token);
    return res.status(401).json({ error: 'Token expired' });
  }
  
  // Delete token (one-time use)
  magicLinks.delete(token);
  
  // In production, create a JWT or session here
  res.json({ 
    success: true,
    pubkey: magicLink.pubkey
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
