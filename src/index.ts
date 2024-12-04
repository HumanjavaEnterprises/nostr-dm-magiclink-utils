import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { NostrMagicLinkMiddleware, NostrMagicLinkConfig } from './middleware/magiclink.middleware.js';
import { NostrService } from './services/nostr.service.js';
import { MagicLinkService } from './services/magiclink.service.js';
import { validatePrivateKey } from './utils/key.utils.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('Server');
const app = express();
const port = process.env.PORT || 3003;

// Validate environment variables
logger.info('Validating environment variables...');

// Validate and clean private key
const privateKey = validatePrivateKey(process.env.NOSTR_PRIVATE_KEY);

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

if (!process.env.MAGIC_LINK_BASE_URL) {
    throw new Error('MAGIC_LINK_BASE_URL environment variable is required');
}

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

// Initialize services
const nostrService = new NostrService(
    process.env.NOSTR_RELAY_URL || 'wss://relay.damus.io',
    privateKey
);

const magicLinkService = new MagicLinkService(
    process.env.JWT_SECRET,
    process.env.MAGIC_LINK_BASE_URL,
    process.env.MAGIC_LINK_EXPIRY_MINUTES ? parseInt(process.env.MAGIC_LINK_EXPIRY_MINUTES) : undefined
);

// Initialize middleware
const magicLinkMiddleware = new NostrMagicLinkMiddleware({
    nostrService,
    magicLinkService
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Use middleware
app.use('/auth/magiclink', magicLinkMiddleware.router);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Magic Link Middleware listening on port ${port}`);
});

// Export main middleware and types
export {
  NostrMagicLinkMiddleware,
  NostrMagicLinkConfig,
  NostrMagicLinkRequest
} from './middleware/magiclink.middleware.js';

// Export services for advanced usage
export { NostrService } from './services/nostr.service.js';
export { MagicLinkService } from './services/magiclink.service.js';

// Create a default middleware factory function for easier usage
export function createNostrMagicLink(config: NostrMagicLinkConfig): NostrMagicLinkMiddleware {
  return new NostrMagicLinkMiddleware(config);
}

// Example usage:
/*
import { createNostrMagicLink } from 'nostr-dm-magiclink-middleware';

const magicLink = createNostrMagicLink({
  privateKey: 'your-nostr-private-key',
  baseUrl: 'https://your-app.com/auth',
  relayUrl: 'wss://relay.damus.io'
});

app.post('/auth/login', magicLink.initiate);
app.get('/auth/verify', magicLink.verify, (req, res) => {
  // User is verified, create session etc.
  const { npub } = req.nostr;
  // ...
});
*/
