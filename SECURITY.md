# Security Policy for nostr-dm-magiclink-utils

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of nostr-dm-magiclink-utils seriously, especially given its role in authentication workflows. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [INSERT SECURITY EMAIL]. You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below to help us better understand the nature and scope of the possible issue:

* Type of issue (e.g., token exposure, encryption weakness, key leakage, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit it

## Security Model

### Package Scope

This package is responsible for:

1. **Secure DM Delivery**
   - End-to-end encryption of magic link messages
   - Proper relay management and fallback
   - Message delivery confirmation

2. **Key Management**
   - Safe handling of service private key
   - Public key validation
   - Prevention of key exposure

3. **Message Security**
   - Template sanitization
   - Variable escaping
   - RTL/LTR text handling
   - Prevention of injection attacks

4. **Error Handling**
   - Secure error messages (no sensitive data exposure)
   - Proper logging of security events
   - Relay failure handling

### Parent Application Responsibilities

Your application MUST handle:

1. **Token Security**
   - Secure token generation
   - Short expiration times (recommended: 15 minutes)
   - One-time use enforcement
   - Token storage and cleanup

2. **Rate Limiting**
   - Limit magic link requests per user
   - Implement cooldown periods
   - Monitor for abuse patterns

3. **Authentication Flow**
   - Secure session creation
   - IP validation (optional)
   - Device fingerprinting (optional)
   - Concurrent session handling

4. **Link Security**
   - HTTPS-only verification endpoints
   - Secure redirect handling
   - Prevention of link enumeration
   - Protection against replay attacks

## Best Practices

### 1. Configuration

```typescript
const magicLink = createNostrMagicLink({
  nostr: {
    // Store private key securely
    privateKey: process.env.NOSTR_SERVICE_PRIVATE_KEY,
    // Use multiple relays for reliability
    relayUrls: [
      "wss://relay.damus.io",
      "wss://relay.nostr.band"
    ]
  },
  magicLink: {
    // Always use HTTPS
    verifyUrl: "https://your-app.com/auth/verify",
    // Use async token generation
    token: async () => generateSecureToken(),
    // Set appropriate timeouts
    timeout: 5000 // 5 seconds
  }
});
```

### 2. Token Generation

```typescript
// Recommended token generation
async function generateSecureToken() {
  return jwt.sign(
    { 
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      jti: crypto.randomBytes(32).toString('hex') // Unique token ID
    },
    process.env.JWT_SECRET,
    { algorithm: 'ES256' }
  );
}
```

### 3. Secure Message Handling

```typescript
const result = await magicLink.sendMagicLink({
  recipientPubkey: pubkey,
  messageOptions: {
    // Avoid including sensitive data in templates
    template: "Click to verify your login: {{link}}",
    // Only include necessary variables
    variables: {
      appName: "YourApp"
    }
  }
});
```

### 4. Verification Endpoint

```typescript
app.get('/auth/verify', async (req, res) => {
  const { token } = req.query;
  
  try {
    // Verify the token
    const pubkey = await magicLink.verifyMagicLink(token);
    if (!pubkey) {
      return res.status(401).json({ 
        error: 'Invalid or expired token'
      });
    }

    // Check if token was already used
    if (await isTokenUsed(token)) {
      return res.status(401).json({ 
        error: 'Token already used'
      });
    }

    // Mark token as used
    await markTokenAsUsed(token);

    // Create session
    const session = await createSecureSession(pubkey);
    res.json({ success: true, session });

  } catch (error) {
    // Log error securely
    logger.error('Verification failed', {
      error: error.message,
      // Mask sensitive data
      token: maskToken(token)
    });
    
    res.status(500).json({ 
      error: 'Verification failed'
    });
  }
});
```

## Common Vulnerabilities to Avoid

1. **Token Exposure**
   - Never log full tokens
   - Don't include tokens in error messages
   - Use secure storage for tokens

2. **Replay Attacks**
   - Implement one-time use tokens
   - Use short expiration times
   - Track used tokens

3. **Timing Attacks**
   - Use constant-time comparison for tokens
   - Implement rate limiting
   - Add small random delays

4. **Information Disclosure**
   - Sanitize error messages
   - Log securely
   - Mask sensitive data

## Disclosure Policy

Upon receipt of a security report, we will:

1. Confirm the problem and determine affected versions
2. Audit code for similar issues
3. Prepare fixes for all supported versions
4. Release security patches
5. Notify affected users (if necessary)

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.
