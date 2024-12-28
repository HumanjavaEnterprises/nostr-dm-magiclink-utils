# Nostr DM Magic Link Middleware

Secure, internationalized magic link authentication for Nostr DMs. Supports multiple languages, RTL text, and contextual authentication with location and device info. Perfect for passwordless auth in Nostr-based applications.

## Features

- 🔒 Secure magic link generation and verification
- 🌐 Multi-language support (EN, ES, FR, AR, JA, PT, ZH, KO, RU)
- 🖊️ RTL (Right-to-Left) text support for Arabic and similar languages
- 📱 Contextual authentication with location and device info
- 🔐 Built-in security features and input validation
- 📨 Direct to Nostr client delivery
- 🔑 Flexible token generation
- 🚀 Built on nostr-tools and nostr-crypto-utils
- 📦 TypeScript-first design
- ⚡ Async/await API
- 🌐 Multi-relay support
- 🔒 One-time use tokens
- 🌍 i18n with 9 languages out of the box
- 🛡️ HTML and Markdown injection protection
- 🔐 NIP-26 delegation support (no nsec required!)

## Installation

```bash
npm install nostr-dm-magiclink-middleware
```

## Quick Start

```typescript
import { MagicLinkService } from 'nostr-dm-magiclink-middleware';

const magicLink = new MagicLinkService({
  appName: 'YourApp',
  verifyUrl: 'https://your-app.com/auth/verify',
  locale: 'en',  // Optional, defaults to 'en'
  expiryMinutes: 15,  // Optional, defaults to 15
  context: {
    // Optional context information
    location: 'San Francisco, USA',
    device: 'Chrome on macOS',
    lastLogin: '2 hours ago',
    requestSource: 'Web Dashboard'
  }
});

// Create a magic link
const result = await magicLink.createMagicLink({
  pubkey: 'user-public-key',
  context: {
    location: 'San Francisco, USA',
    device: 'Chrome on macOS'
  }
});

if (result.success) {
  console.log('Magic link message:', result.magicLink);
} else {
  console.error('Error:', result.error);
}
```

## Secure Key Management with NIP-26 Delegation

One of the most powerful features of this middleware is its support for NIP-26 delegation. This means you don't need to expose your service's nsec (private key) to use magic links!

### Why Use Delegation?

1. 🔒 **Enhanced Security**: Never expose your main private key
2. 🎯 **Limited Scope**: Restrict delegated keys to specific actions
3. ⏰ **Time-Bound**: Automatically expire delegations
4. 🔄 **Easy Rotation**: Update delegations without changing your main key

### Using Delegation

```typescript
import { NostrService } from 'nostr-dm-magiclink-middleware';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';

// Your service's main key (keep this secure!)
const SERVICE_PUBKEY = 'your-main-pubkey';

// Create a delegation
const createDelegation = async () => {
  // Generate a temporary keypair for delegation
  const tempPrivKey = generatePrivateKey();
  const tempPubKey = getPublicKey(tempPrivKey);

  const nostrService = new NostrService({
    delegationEvent: {
      delegator: SERVICE_PUBKEY,
      delegatee: tempPubKey,
      allowedKinds: [4], // Only allow DM events
      expiresAt: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }
  });

  return {
    privateKey: tempPrivKey,
    delegationEvent: await nostrService.createDelegation()
  };
};

// Use the delegation
const { privateKey, delegationEvent } = await createDelegation();
const magicLink = new MagicLinkService({
  nostr: {
    privateKey, // Temporary delegated key
    delegationEvent,
    relays: ['wss://relay.damus.io']
  },
  // ... other config
});
```

### Best Practices for Delegation

1. **Limited Scope**
   - Only delegate permission for DM events (kind: 4)
   - Set appropriate expiration times
   - Use different delegations for different purposes

2. **Key Rotation**
   ```typescript
   // Rotate delegations every 24 hours
   setInterval(async () => {
     const { privateKey, delegationEvent } = await createDelegation();
     updateServiceKeys(privateKey, delegationEvent);
   }, 24 * 60 * 60 * 1000);
   ```

3. **Multiple Relays**
   ```typescript
   const magicLink = new MagicLinkService({
     nostr: {
       privateKey,
       delegationEvent,
       relays: [
         'wss://relay.damus.io',
         'wss://relay.nostr.band',
         'wss://nos.lol'
       ]
     }
   });
   ```

## Security Keys Setup

The middleware requires two secret keys for secure operation:

1. JWT Secret Key (for authentication tokens)
2. Nostr Private Key (for signing Nostr events)

### Setting Up Keys

Create a `.keys` directory in the project root and generate the required keys:

```bash
# Create .keys directory
mkdir -p .keys

# Generate JWT secret (64 bytes of random data)
openssl rand -base64 48 > .keys/jwt_secret

# Generate Nostr private key (32 bytes in hex format)
openssl rand -hex 32 > .keys/nostr_private_key
```

⚠️ **IMPORTANT SECURITY NOTES**:

- Never commit these keys to version control
- Keep your production keys secure and separate from development keys
- Regularly rotate your JWT secret in production
- Back up your Nostr private key securely - losing it means losing access to your Nostr identity
- Set appropriate file permissions:
  ```bash
  chmod 600 .keys/jwt_secret .keys/nostr_private_key
  ```

## Internationalization Examples

The middleware supports multiple languages with RTL support. Here's how messages look in different languages:

### English (LTR)
```
Click this link to sign in to YourApp:
https://app.com/verify?token=abc123

This link will expire in 15 minutes.
Do not share this link.

Location: San Francisco, USA
Device: Chrome on macOS
```

### Arabic (RTL)
```
انقر على هذا الرابط لتسجيل الدخول إلى YourApp:
https://app.com/verify?token=abc123

ستنتهي صلاحية هذا الرابط خلال 15 دقيقة.
لا تشارك هذا الرابط.

الموقع: سان فرانسيسكو، الولايات المتحدة
الجهاز: كروم على نظام ماك
```

## Supported Languages

- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇸🇦 Arabic (ar) - with RTL support
- 🇯🇵 Japanese (ja)
- 🇵🇹 Portuguese (pt)
- 🇨🇳 Chinese (zh)
- 🇰🇷 Korean (ko)
- 🇷🇺 Russian (ru)

## Security Features

- ✅ Input validation and sanitization
- ✅ HTML and Markdown injection protection
- ✅ One-time use tokens
- ✅ Configurable expiry times
- ✅ No storage of sensitive data
- ✅ Secure token generation
- ✅ NIP-26 delegation support
- ✅ Key rotation support
- ✅ Multi-relay redundancy

## Troubleshooting Guide

### Common Issues

#### 1. Delegation Not Working

```typescript
Error: "Invalid delegation signature" or "Delegation verification failed"
```

**Common Causes:**
- Incorrect delegator public key
- Expired delegation
- Wrong event kinds in delegation
- Signature mismatch

**Solutions:**
```typescript
// 1. Verify your delegation setup
const nostrService = new NostrService({
  delegationEvent: {
    delegator: SERVICE_PUBKEY,    // Make sure this is your main pubkey
    delegatee: tempPubKey,        // Generated temporary key
    allowedKinds: [4],            // Must include kind 4 for DMs
    expiresAt: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Not expired
  }
});

// 2. Debug delegation event
console.log('Delegation Event:', delegationEvent);
console.log('Current Time:', Math.floor(Date.now() / 1000));
console.log('Expires At:', delegationEvent.expiresAt);
```

#### 2. Messages Not Being Delivered

```typescript
Error: "Message delivery timeout" or "No relay connection"
```

**Common Causes:**
- Relay connection issues
- Rate limiting
- Invalid relay URLs
- Network problems

**Solutions:**
```typescript
// 1. Use multiple relays for redundancy
const magicLink = new MagicLinkService({
  nostr: {
    privateKey,
    delegationEvent,
    relays: [
      'wss://relay.damus.io',
      'wss://relay.nostr.band',
      'wss://nos.lol'
    ],
    // Add connection timeout
    connectionTimeout: 5000,
    // Add retry logic
    connectionRetries: 3
  }
});

// 2. Monitor relay connections
magicLink.on('relay:error', (error, relay) => {
  console.error(`Relay ${relay} error:`, error);
  // Implement fallback logic
});
```

#### 3. Token Verification Issues

```typescript
Error: "Invalid token" or "Token expired"
```

**Common Causes:**
- Clock synchronization issues
- Token expiry too short
- Invalid token format
- Missing verification URL

**Solutions:**
```typescript
// 1. Use longer expiry times for testing
const magicLink = new MagicLinkService({
  expiryMinutes: 30,  // Increase from default 15
  verifyUrl: 'https://your-app.com/auth/verify',
  // Add token verification options
  tokenOptions: {
    clockTolerance: 30,  // 30 seconds tolerance for clock sync
    validateExpiry: true // Explicitly check expiration
  }
});

// 2. Debug token issues
magicLink.on('token:error', (error, token) => {
  console.error('Token error:', {
    error,
    currentTime: new Date(),
    tokenExpiry: token.expiry,
    tokenFormat: token.format
  });
});
```

#### 4. Internationalization Problems

```typescript
Error: "RTL text not displaying correctly" or "Missing translations"
```

**Common Causes:**
- Missing locale files
- RTL/LTR mixing issues
- Context string formatting
- Character encoding problems

**Solutions:**
```typescript
// 1. Verify locale setup
const magicLink = new MagicLinkService({
  locale: 'ar',
  // Force UTF-8 encoding
  encoding: 'utf8',
  // Add fallback locale
  fallbackLocale: 'en',
  // Debug mode for translations
  debug: true
});

// 2. Test with various content types
const result = await magicLink.createMagicLink({
  pubkey: 'user-public-key',
  context: {
    // Test mixed RTL/LTR content
    location: 'دبي، الإمارات / Dubai, UAE',
    // Test numbers and special characters
    device: 'آيفون 12 / iPhone 12',
    // Test timestamps
    lastLogin: 'قبل ٣ دقائق / 3 minutes ago'
  }
});
```

#### 5. Performance and Rate Limiting

```typescript
Error: "Too many requests" or "Rate limit exceeded"
```

**Common Causes:**
- Too many concurrent requests
- Relay rate limiting
- Network bottlenecks
- Resource constraints

**Solutions:**
```typescript
// 1. Implement request queuing
const magicLink = new MagicLinkService({
  rateLimit: {
    maxRequests: 10,
    perTimeWindow: 60000, // 1 minute
    queueExceeding: true
  },
  // Add request timeout
  requestTimeout: 10000,
  // Enable request batching
  batchRequests: true,
  batchWindow: 100 // ms
});

// 2. Monitor performance
magicLink.on('performance', (metrics) => {
  console.log('Performance metrics:', {
    requestTime: metrics.requestTime,
    queueLength: metrics.queueLength,
    relayLatency: metrics.relayLatency
  });
});
```

### Debug Mode

Enable debug mode for detailed logging:

```typescript
const magicLink = new MagicLinkService({
  debug: true,
  logLevel: 'debug',
  // Log to custom function
  logger: (level, message, meta) => {
    console.log(`[${level}] ${message}`, meta);
  }
});
```

### Health Checks

Monitor the health of your magic link service:

```typescript
// 1. Basic health check
const health = await magicLink.checkHealth();
console.log('Service health:', health);

// 2. Detailed diagnostics
const diagnostics = await magicLink.getDiagnostics();
console.log('Service diagnostics:', {
  relayConnections: diagnostics.relays,
  delegationStatus: diagnostics.delegation,
  tokenService: diagnostics.tokens,
  localizationStatus: diagnostics.i18n
});
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `ERR_DELEGATION_EXPIRED` | Delegation has expired | Create new delegation |
| `ERR_INVALID_PUBKEY` | Invalid public key format | Check key format (hex) |
| `ERR_RELAY_TIMEOUT` | Relay connection timeout | Try different relays |
| `ERR_TOKEN_EXPIRED` | Magic link token expired | Increase expiry time |
| `ERR_RATE_LIMIT` | Too many requests | Implement queuing |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT 
