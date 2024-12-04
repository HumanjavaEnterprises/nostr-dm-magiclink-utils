import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import { nip19 } from 'nostr-tools';

// Generate a new private key
const privateKey = generatePrivateKey();
const publicKey = getPublicKey(privateKey);

// Convert to nsec/npub format
const nsec = nip19.nsecEncode(privateKey);
const npub = nip19.npubEncode(publicKey);

// Output as JSON
const output = {
    privateKey,
    publicKey,
    nsec,
    npub,
    timestamp: new Date().toISOString()
};

console.log(JSON.stringify(output, null, 2));
