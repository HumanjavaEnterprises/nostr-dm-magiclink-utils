import express from 'express';
import { NostrCrypto } from 'nostr-crypto-utils';
import { LocaleService } from '../../src/locales';
import UAParser from 'ua-parser-js';
import geoip from 'geoip-lite';

const app = express();
app.use(express.json());

// Initialize services
const nostrCrypto = new NostrCrypto();
const localeService = new LocaleService('en');

// Generate service keys
const SERVICE_PRIVKEY = process.env.SERVICE_PRIVKEY || nostrCrypto.generatePrivateKey();
const SERVICE_PUBKEY = nostrCrypto.getPublicKey(SERVICE_PRIVKEY);

// Store magic links (use a proper database in production)
const magicLinks = new Map<string, {
  pubkey: string;
  expiresAt: number;
  attempts: number;
}>();

// Detect language from Accept-Language header
function detectLanguage(acceptLanguage: string): string {
  const languages = acceptLanguage.split(',')
    .map(lang => {
      const [language, quality = '1'] = lang.trim().split(';q=');
      return {
        language: language.split('-')[0], // Get primary language
        quality: parseFloat(quality)
      };
    })
    .sort((a, b) => b.quality - a.quality);

  const supportedLocales = localeService.getSupportedLocales();
  const detected = languages.find(lang => 
    supportedLocales.includes(lang.language as any)
  );

  return detected ? detected.language : 'en';
}

// Get device and location info
function getDeviceInfo(req: express.Request) {
  const ua = new UAParser(req.headers['user-agent']);
  const ip = req.ip || req.socket.remoteAddress || '';
  const geo = geoip.lookup(ip);

  return {
    browser: ua.getBrowser().name || 'Unknown Browser',
    os: ua.getOS().name || 'Unknown OS',
    city: geo?.city || 'Unknown City',
    country: geo?.country || 'Unknown Country'
  };
}

app.post('/auth/login', async (req, res) => {
  const { pubkey } = req.body;
  const acceptLanguage = req.headers['accept-language'] || 'en';
  const locale = req.body.locale || detectLanguage(acceptLanguage);
  
  try {
    // Create magic link token
    const token = nostrCrypto.generateRandomBytes(32);
    const expiryMinutes = 15;
    const expiresAt = Math.floor(Date.now() / 1000) + (expiryMinutes * 60);
    
    // Store token with attempt counter
    magicLinks.set(token, { 
      pubkey, 
      expiresAt,
      attempts: 0
    });
    
    // Get device and location info
    const deviceInfo = getDeviceInfo(req);
    
    // Create magic link
    const magicLink = `${process.env.BASE_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;
    
    // Set locale and generate message with all customizations
    localeService.setLocale(locale);
    const message = localeService.formatMagicLinkMessage({
      appName: process.env.APP_NAME || 'TestApp',
      magicLink,
      expiryMinutes,
      deviceInfo,
      year: new Date().getFullYear()
    });
    
    // Encrypt DM content
    const encryptedContent = await nostrCrypto.encryptDM(
      message,
      SERVICE_PRIVKEY,
      pubkey
    );
    
    // Create DM event
    const event = await nostrCrypto.createEvent({
      kind: 4,
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
      supportedLocales: localeService.getSupportedLocales(),
      detectedLocale: locale,
      direction: localeService.getTextDirection()
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
  
  // Increment attempt counter
  magicLink.attempts += 1;
  
  if (magicLink.attempts > 3) {
    magicLinks.delete(token);
    return res.status(401).json({ error: 'Too many attempts' });
  }
  
  if (magicLink.expiresAt < (Date.now() / 1000)) {
    magicLinks.delete(token);
    return res.status(401).json({ error: 'Token expired' });
  }
  
  // Delete token (one-time use)
  magicLinks.delete(token);
  
  res.json({
    success: true,
    pubkey: magicLink.pubkey
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});
