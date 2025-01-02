import express from 'express';
import { createNostrMagicLink } from '../../src';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Initialize magic link service
const magicLink = createNostrMagicLink({
  nostr: {
    privateKey: process.env.NOSTR_PRIVATE_KEY!,
    relayUrls: [
      'wss://relay.damus.io',
      'wss://nos.lol'
    ]
  },
  magicLink: {
    verifyUrl: 'http://localhost:3000/auth/verify',
    generateToken: async (pubkey) => {
      return jwt.sign({ pubkey }, process.env.JWT_SECRET || 'your-secret');
    },
    messageTemplate: 'Welcome to the demo app! Click here to login: {{link}}'
  }
});

// Serve a simple login form
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Nostr Magic Link Demo</h1>
        <form id="loginForm">
          <input type="text" id="npub" placeholder="Enter your npub" />
          <button type="submit">Send Magic Link</button>
        </form>
        <script>
          document.getElementById('loginForm').onsubmit = async (e) => {
            e.preventDefault();
            const npub = document.getElementById('npub').value;
            const res = await fetch('/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pubkey: npub })
            });
            const data = await res.json();
            alert(data.message);
          };
        </script>
      </body>
    </html>
  `);
});

// Handle login request
app.post('/auth/login', async (req, res) => {
  const { pubkey } = req.body;
  
  try {
    await magicLink.sendLink(pubkey);
    res.json({ 
      success: true, 
      message: 'Check your Nostr client for the magic link!' 
    });
  } catch (error) {
    console.error('Failed to send magic link:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send magic link' 
    });
  }
});

// Handle magic link verification
app.get('/auth/verify', async (req, res) => {
  const { token } = req.query;
  
  try {
    const result = await magicLink.verify(token as string);
    res.json({
      success: true,
      message: 'Successfully authenticated!',
      ...result
    });
  } catch (error) {
    console.error('Failed to verify magic link:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired magic link' 
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
