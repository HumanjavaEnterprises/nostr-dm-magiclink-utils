import express from 'express';
import { createNostrMagicLink, NostrMagicLinkRequest } from '../src';

const app = express();
app.use(express.json());

// Initialize the magic link middleware
const magicLink = createNostrMagicLink({
  privateKey: process.env.NOSTR_PRIVATE_KEY || '',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000/auth',
  relayUrl: process.env.RELAY_URL || 'wss://relay.damus.io'
});

// Login endpoint - initiates magic link flow
app.post('/auth/login', magicLink.initiate);

// Verification endpoint - handles magic link callback
app.get('/auth/verify', magicLink.verify, (req: NostrMagicLinkRequest, res) => {
  const { npub, sessionId } = req.nostr!;
  
  // In a real app, you would:
  // 1. Create a session
  // 2. Set cookies/JWT
  // 3. Redirect to app
  
  res.json({
    success: true,
    message: 'Authentication successful',
    npub,
    sessionId
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Magic link verification URL: http://localhost:${PORT}/auth/verify`);
});
