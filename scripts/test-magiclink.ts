import { NostrDMMagicLink } from '../src/index.js';
import { config } from 'dotenv';

// Load environment variables
config();

async function testMagicLink() {
  try {
    const magicLink = new NostrDMMagicLink({
      relayUrls: ['wss://relay.damus.io', 'wss://nos.lol'],
      privateKey: process.env.PRIVATE_KEY || '', // Your test private key
      publicKey: process.env.PUBLIC_KEY || '',   // Your test public key
    });

    // Test generating a magic link
    const link = await magicLink.generateMagicLink({
      targetPubkey: process.env.TARGET_PUBKEY || '', // The recipient's public key
      redirectUrl: 'https://maiqr.app/auth/callback',
      expiresIn: '1h',
    });

    console.log('Generated Magic Link:', link);

    // Test verifying a magic link
    const verified = await magicLink.verifyMagicLink(link);
    console.log('Verification Result:', verified);

  } catch (error) {
    console.error('Error:', error);
  }
}

testMagicLink();
