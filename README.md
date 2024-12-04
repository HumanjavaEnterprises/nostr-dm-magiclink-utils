# Nostr DM Magic Link Middleware

[![License](https://img.shields.io/npm/l/nostr-dm-magiclink-middleware)](https://github.com/HumanjavaEnterprises/nostr-dm.magiclink-middleware/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/nostr-dm-magiclink-middleware)](https://www.npmjs.com/package/nostr-dm-magiclink-middleware)
[![GitHub issues](https://img.shields.io/github/issues/HumanjavaEnterprises/nostr-dm.magiclink-middleware)](https://github.com/HumanjavaEnterprises/nostr-dm.magiclink-middleware/issues)
[![GitHub stars](https://img.shields.io/github/stars/HumanjavaEnterprises/nostr-dm.magiclink-middleware)](https://github.com/HumanjavaEnterprises/nostr-dm.magiclink-middleware/stargazers)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/node/v/nostr-dm-magiclink-middleware)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

A middleware for handling magic link authentication via Nostr DMs. This package provides a secure way to implement passwordless authentication using Nostr's direct messaging system.

## Features

- 🔐 Secure magic link generation and verification
- 📨 Delivery via encrypted Nostr DMs
- 🔑 Built-in session management
- 🚀 Easy integration with Express.js
- 📦 TypeScript support
- ⚡ Async/await API

## Installation

```bash
npm install nostr-dm-magiclink-middleware
```

## Quick Start

```typescript
import express from 'express';
import { createNostrMagicLink } from 'nostr-dm-magiclink-middleware';

const app = express();
app.use(express.json());

// Initialize the middleware
const magicLink = createNostrMagicLink({
  privateKey: process.env.NOSTR_PRIVATE_KEY!, // Your bot's private key
  baseUrl: 'https://your-app.com/auth',       // Your auth endpoint base URL
  relayUrl: 'wss://relay.damus.io',           // Optional: custom relay URL
  tokenExpiry: 5 * 60 * 1000                  // Optional: token expiry in ms (default: 5 minutes)
});

// Endpoint to initiate login
app.post('/auth/login', magicLink.initiate);

// Endpoint to verify magic link
app.get('/auth/verify', magicLink.verify, (req, res) => {
  // User is now verified
  const { npub, sessionId } = req.nostr;
  
  // Create user session, JWT, etc.
  res.json({
    success: true,
    message: 'Authentication successful',
    npub
  });
});

// Cleanup when shutting down
process.on('SIGTERM', async () => {
  await magicLink.cleanup();
});
```

## How It Works

1. User requests login with their Nostr public key (npub)
2. Middleware generates a secure magic link
3. Link is sent via encrypted Nostr DM to the user
4. User clicks the link in their Nostr client
5. Middleware verifies the link and authenticates the user

## Security Features

- ✅ Encrypted DMs using NIP-04
- ✅ One-time use tokens
- ✅ Configurable token expiry
- ✅ Session-based verification
- ✅ Automatic cleanup of expired sessions

## Advanced Usage

You can also use the services directly for more custom implementations:

```typescript
import { NostrService, MagicLinkService } from 'nostr-dm-magiclink-middleware';

// Use NostrService directly for DM functionality
const nostr = new NostrService(privateKey, relayUrl);

// Use MagicLinkService for custom magic link handling
const magicLink = new MagicLinkService(privateKey, baseUrl, relayUrl);
```

## Documentation

For detailed documentation, check out:

- [Testing Nostr Services](docs/testing-nostr-services.md) - Learn about testing strategies, common challenges, and best practices for testing Nostr services
- [API Reference](docs/api-reference.md) - Detailed API documentation
- [Security Guide](docs/security-guide.md) - Security best practices and considerations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details
