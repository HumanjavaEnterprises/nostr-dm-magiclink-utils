# nostr-dm-magiclink-utils

[![npm version](https://img.shields.io/npm/v/nostr-dm-magiclink-utils.svg)](https://www.npmjs.com/package/nostr-dm-magiclink-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/node/v/nostr-dm-magiclink-utils.svg)](https://nodejs.org)
[![Test Coverage](https://img.shields.io/codecov/c/github/HumanjavaEnterprises/nostr-dm-magiclink-utils)](https://codecov.io/gh/HumanjavaEnterprises/nostr-dm-magiclink-utils)
[![Build Status](https://img.shields.io/github/workflow/status/HumanjavaEnterprises/nostr-dm-magiclink-utils/CI)](https://github.com/HumanjavaEnterprises/nostr-dm-magiclink-utils/actions)
[![Dependencies](https://img.shields.io/librariesio/release/npm/nostr-dm-magiclink-utils)](https://libraries.io/npm/nostr-dm-magiclink-utils)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Author](https://img.shields.io/badge/author-vveerrgg-blue.svg)](https://github.com/vveerrgg)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/nostr-dm-magiclink-utils)](https://bundlephobia.com/package/nostr-dm-magiclink-utils)
[![Downloads](https://img.shields.io/npm/dm/nostr-dm-magiclink-utils.svg)](https://www.npmjs.com/package/nostr-dm-magiclink-utils)
[![Languages](https://img.shields.io/badge/i18n-9_languages-green.svg)](https://github.com/HumanjavaEnterprises/nostr-dm-magiclink-utils#supported-languages)
[![Security](https://img.shields.io/badge/security-NIP--04-brightgreen.svg)](https://github.com/nostr-protocol/nips/blob/master/04.md)

A comprehensive Nostr utility library for implementing secure, user-friendly authentication via magic links in direct messages. Built with TypeScript and following Nostr Improvement Proposals (NIPs) for maximum compatibility and security.

## Features

- 🔐 **NIP-04 Compliant**: Secure, encrypted direct messages following Nostr standards
- 🌍 **Rich i18n Support**: 9 languages with RTL support
- 🔄 **Multi-Relay Support**: Reliable message delivery with automatic failover
- 🛡️ **Type-Safe**: Full TypeScript support with comprehensive types
- 📝 **Flexible Templates**: Customizable messages with variable interpolation
- 🚀 **Modern API**: Promise-based, async/await friendly interface
- 🎯 **Zero Config**: Sensible defaults with optional deep customization

## Installation

```bash
npm install nostr-dm-magiclink-utils
```

## Quick Start

Here's a complete example showing how to set up and use the magic link service:

```typescript
import { createNostrMagicLink, NostrError } from 'nostr-dm-magiclink-utils';
import { generatePrivateKey } from 'nostr-tools'; // For demo purposes

async function setupAuthService() {
  // Create service with secure configuration
  const magicLink = createNostrMagicLink({
    nostr: {
      // In production, load from secure environment variable
      privateKey: process.env.NOSTR_PRIVATE_KEY || generatePrivateKey(),
      relayUrls: [
        'wss://relay.damus.io',
        'wss://relay.nostr.band',
        'wss://nos.lol'
      ],
      // Optional: Configure connection timeouts
      connectionTimeout: 5000
    },
    magicLink: {
      verifyUrl: 'https://your-app.com/verify',
      // Async token generation with expiry
      token: async () => {
        const token = await generateSecureToken({
          expiresIn: '15m',
          length: 32
        });
        return token;
      },
      defaultLocale: 'en',
      // Optional: Custom message templates
      templates: {
        en: {
          subject: 'Login to {{appName}}',
          body: 'Click this secure link to log in: {{link}}\nValid for 15 minutes.'
        }
      }
    }
  });

  return magicLink;
}

// Example usage in an Express route handler
app.post('/auth/magic-link', async (req, res) => {
  try {
    const { pubkey } = req.body;
    
    if (!pubkey) {
      return res.status(400).json({ error: 'Missing pubkey' });
    }

    const magicLink = await setupAuthService();
    
    const result = await magicLink.sendMagicLink({
      recipientPubkey: pubkey,
      messageOptions: {
        locale: req.locale, // From i18n middleware
        variables: {
          appName: 'YourApp',
          username: req.body.username
        }
      }
    });

    if (result.success) {
      res.json({ 
        message: 'Magic link sent successfully',
        expiresIn: '15 minutes'
      });
    }
  } catch (error) {
    if (error instanceof NostrError) {
      // Handle specific Nostr-related errors
      res.status(400).json({ 
        error: error.message,
        code: error.code 
      });
    } else {
      // Handle unexpected errors
      res.status(500).json({ 
        error: 'Failed to send magic link' 
      });
    }
  }
});
```

## Advanced Usage

### Custom Error Handling

```typescript
try {
  const result = await magicLink.sendMagicLink({
    recipientPubkey: pubkey,
    messageOptions: { locale: 'en' }
  });
  
  if (!result.success) {
    switch (result.error.code) {
      case 'RELAY_CONNECTION_FAILED':
        // Attempt reconnection or use fallback relay
        await magicLink.reconnect();
        break;
      case 'ENCRYPTION_FAILED':
        // Log encryption errors for debugging
        logger.error('Encryption failed:', result.error);
        break;
      case 'INVALID_PUBKEY':
        // Handle invalid recipient public key
        throw new UserError('Invalid recipient');
        break;
    }
  }
} catch (error) {
  // Handle other errors
}
```

### Multi-Language Support

```typescript
// Arabic (RTL) example
const result = await magicLink.sendMagicLink({
  recipientPubkey: pubkey,
  messageOptions: {
    locale: 'ar',
    // Optional: Override default template
    template: {
      subject: 'تسجيل الدخول إلى {{appName}}',
      body: 'انقر فوق هذا الرابط الآمن لتسجيل الدخول: {{link}}'
    },
    variables: {
      appName: 'تطبيقك',
      username: 'المستخدم'
    }
  }
});
```

### Custom Token Generation

```typescript
const magicLink = createNostrMagicLink({
  // ... other config
  magicLink: {
    verifyUrl: 'https://your-app.com/verify',
    token: async (recipientPubkey: string) => {
      // Generate a secure, short-lived token
      const token = await generateJWT({
        sub: recipientPubkey,
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
        jti: crypto.randomUUID(),
        iss: 'your-app'
      });
      
      // Optional: Store token in database for verification
      await db.tokens.create({
        token,
        pubkey: recipientPubkey,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      });
      
      return token;
    }
  }
});
```

### Relay Management

```typescript
const magicLink = createNostrMagicLink({
  nostr: {
    privateKey: process.env.NOSTR_PRIVATE_KEY,
    relayUrls: ['wss://relay1.com', 'wss://relay2.com'],
    // Advanced relay options
    relayOptions: {
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 5000,
      onError: async (error, relay) => {
        logger.error(`Relay ${relay} error:`, error);
        // Optionally switch to backup relay
        await magicLink.addRelay('wss://backup-relay.com');
      }
    }
  }
});

// Monitor relay status
magicLink.on('relay:connected', (relay) => {
  logger.info(`Connected to relay: ${relay}`);
});

magicLink.on('relay:disconnected', (relay) => {
  logger.warn(`Disconnected from relay: ${relay}`);
});
```

## Security Best Practices

1. **Private Key Management**
   - Never hardcode private keys
   - Use secure environment variables
   - Rotate keys periodically

```typescript
// Load private key securely
const privateKey = await loadPrivateKeyFromSecureStore();
if (!privateKey) {
  throw new Error('Missing required private key');
}
```

2. **Token Security**
   - Use short expiration times (15-30 minutes)
   - Include necessary claims (sub, exp, jti)
   - Store tokens securely for verification

3. **Error Handling**
   - Never expose internal errors to users
   - Log errors securely
   - Implement rate limiting

4. **Relay Security**
   - Use trusted relays
   - Implement connection timeouts
   - Handle connection errors gracefully

## Supported Languages

The library includes built-in support for:
- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇨🇳 Chinese (zh)
- 🇧🇷 Portuguese (pt)
- 🇷🇺 Russian (ru)
- 🇸🇦 Arabic (ar) - with RTL support

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [vveerrgg](https://github.com/vveerrgg)
