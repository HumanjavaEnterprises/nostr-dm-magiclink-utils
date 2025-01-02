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

A lightweight, focused utility for sending magic links via Nostr DMs. Perfect for implementing passwordless authentication in Nostr-based applications.

## Features

- 🔐 **Secure Authentication**: Send magic links via encrypted Nostr DMs
- 🌍 **Full i18n Support**: 9 languages including RTL support (Arabic, Chinese, English, French, Japanese, Korean, Portuguese, Russian, Spanish)
- 🔄 **Reliable Delivery**: Multiple relay support with automatic failover
- 🛡️ **Type Safety**: Written in TypeScript with comprehensive types
- 📝 **Flexible Templates**: Customizable messages with variable interpolation
- 🚀 **Easy Integration**: Simple API with minimal configuration
- 🎯 **Focused Design**: Streamlined for magic link delivery without unnecessary features

## Installation

```bash
npm install nostr-dm-magiclink-utils
```

## Quick Start

```typescript
import { createNostrMagicLink } from 'nostr-dm-magiclink-utils';

// Create the magic link service
const magicLink = createNostrMagicLink({
  nostr: {
    privateKey: "your_service_private_key",
    relayUrls: ["wss://relay.damus.io", "wss://relay.nostr.band"]
  },
  magicLink: {
    verifyUrl: "https://your-app.com/auth/verify",
    token: "your_jwt_token", // or async token generator
    defaultLocale: "en"      // optional, defaults to "en"
  }
});

// Send a magic link
const result = await magicLink.sendMagicLink({
  recipientPubkey: "npub1...",
  messageOptions: {
    locale: "ja",           // optional, override default locale
    template: "Login to {{appName}}: {{link}}", // optional custom template
    variables: {            // optional custom variables
      appName: "YourApp"
    }
  }
});

if (result.success) {
  console.log("Magic link sent:", result.magicLink);
} else {
  console.error("Failed to send:", result.error);
}
```

## Advanced Usage

### Dynamic Token Generation

```typescript
const magicLink = createNostrMagicLink({
  nostr: {
    privateKey: process.env.NOSTR_PRIVATE_KEY,
    relayUrls: ["wss://relay1.com", "wss://relay2.com"]
  },
  magicLink: {
    verifyUrl: "https://your-app.com/verify",
    // Async token generation
    token: async () => {
      const token = await generateJWT({
        expiresIn: '1h',
        // ... other JWT options
      });
      return token;
    }
  }
});
```

### Custom Message Templates

```typescript
const result = await magicLink.sendMagicLink({
  recipientPubkey: recipientPubkey,
  messageOptions: {
    locale: "fr",
    template: "Bienvenue sur {{appName}}! Connectez-vous depuis {{device}}: {{link}}",
    variables: {
      appName: "MonApp",
      device: "iPhone"
    }
  }
});
```

### RTL Language Support

```typescript
const result = await magicLink.sendMagicLink({
  recipientPubkey: recipientPubkey,
  messageOptions: {
    locale: "ar",
    textDirection: "rtl",  // Optional, automatically set for RTL languages
    variables: {
      appName: "تطبيقك"
    }
  }
});
```

### Multiple Relay Management

```typescript
const magicLink = createNostrMagicLink({
  nostr: {
    privateKey: "your_private_key",
    relayUrls: ["wss://relay1.com", "wss://relay2.com"]
  },
  magicLink: {
    verifyUrl: "https://your-app.com/verify",
    token: "your_token"
  }
});

// Add a new relay at runtime
await magicLink.nostrService.addRelay("wss://relay3.com");

// Remove a relay
await magicLink.nostrService.removeRelay("wss://relay1.com");

// Check relay status
const status = magicLink.nostrService.getStatus();
console.log("Connected relays:", status.connected);
```

### Error Handling

The package provides detailed error information with specific error codes:

```typescript
try {
  const result = await magicLink.sendMagicLink({
    recipientPubkey: "npub1..."
  });
  
  if (!result.success) {
    console.error("Failed to send magic link:", result.error);
  }
} catch (error) {
  if (error instanceof NostrError) {
    switch (error.code) {
      case NostrErrorCode.ENCRYPTION_FAILED:
        console.error("Message encryption failed");
        break;
      case NostrErrorCode.DECRYPTION_FAILED:
        console.error("Message decryption failed");
        break;
      case NostrErrorCode.RELAY_CONNECTION_FAILED:
        console.error("Failed to connect to relays");
        break;
      // ... handle other error types
    }
  }
}
```

## Supported Languages

The package includes built-in templates for:
- 🇺🇸 English (en)
- 🇸🇦 Arabic (ar) - RTL Support
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇵🇹 Portuguese (pt)
- 🇷🇺 Russian (ru)
- 🇨🇳 Chinese (zh)

## Security Considerations

This package handles:
- ✅ Message encryption (NIP-04)
- ✅ Public key validation
- ✅ Input sanitization
- ✅ Message validation

Your application is responsible for:
- Token generation and validation
- Rate limiting
- Link expiration
- Access control
- Session management
- Token storage and cleanup

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License - see LICENSE file for details
