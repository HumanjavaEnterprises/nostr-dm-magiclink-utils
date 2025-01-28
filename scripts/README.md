# Test Scripts for nostr-dm-magiclink-utils

This directory contains test scripts to demonstrate and verify the functionality of the nostr-dm-magiclink-utils package.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your test keys and configuration:
   - `PRIVATE_KEY`: Your Nostr private key (hex format)
   - `PUBLIC_KEY`: Your Nostr public key (hex format)
   - `TARGET_PUBKEY`: Recipient's public key for testing
   - Other settings as needed

## Available Scripts

### test-magiclink.ts
Tests the core magic link functionality:
- Generating magic links
- Sending DMs with magic links
- Verifying magic links

To run:
```bash
ts-node test-magiclink.ts
```

## Notes
- Never use production keys in test scripts
- Make sure relays are accessible
- Keep test timeouts reasonable (1h max for testing)
