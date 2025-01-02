import { NostrService } from './services/nostr.service';
import { MagicLinkService } from './services/magiclink.service';
import { NostrMagicLinkConfig } from './types/config';
import { createLogger } from './utils/logger';

const logger = createLogger('nostr-dm-magiclink-utils');

/**
 * Create a new instance of the magic link service
 * @param config Service configuration
 * @returns MagicLinkService instance
 */
export function createMagicLinkService(config: NostrMagicLinkConfig): MagicLinkService {
  // Validate required configuration
  if (!config.magicLink.token) {
    throw new Error('Token is required');
  }

  if (!config.magicLink.verifyUrl) {
    throw new Error('Verify URL is required');
  }

  if (!config.nostr.privateKey) {
    throw new Error('Nostr private key is required');
  }

  if (!config.nostr.relayUrls || config.nostr.relayUrls.length === 0) {
    throw new Error('At least one relay URL is required');
  }

  // Create services
  const nostrService = new NostrService(config.nostr);
  const magicLinkService = new MagicLinkService(
    nostrService,
    config.magicLink
  );

  logger.info('Magic link service created successfully');

  return magicLinkService;
}

// Export types
export * from './types';
