# Nostr DM Magic Link Examples

This directory contains example implementations showing different ways to use the nostr-dm-magiclink-middleware.

## Examples

### 1. Basic Usage (`basic-usage/`)
Simple Express.js server demonstrating:
- Key generation
- Magic link creation
- DM encryption
- Event signing
- Basic verification flow

### 2. Delegation Service (`delegation-service/`)
Complete delegation service showing:
- Platform registration
- Delegation event creation
- Token management
- Automatic cleanup

### 3. Multi-Relay Implementation (`multi-relay/`)
Advanced relay handling showing:
- Connection pooling
- Automatic reconnection
- Event publishing
- Error handling

## Running the Examples

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
export SERVICE_PRIVKEY=your_private_key_here  # Optional, will generate if not provided
```

3. Run an example:
```bash
# Basic usage
ts-node examples/basic-usage/index.ts

# Delegation service
ts-node examples/delegation-service/index.ts

# Multi-relay
ts-node examples/multi-relay/index.ts
```

## Security Notes

These examples are for demonstration purposes only. In production:
- Use proper key management
- Implement rate limiting
- Add proper error handling
- Use a database for storage
- Add logging and monitoring
- Implement proper session management
- Add CORS and other security headers
