import { NostrService } from './services/nostr.service.js';
import { MagicLinkService } from './services/magiclink.service.js';
import { NostrMagicLinkConfig } from './types/config.js';
import { createLogger } from './utils/logger.js';

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

  logger.info('Creating magic link service');
  const nostrService = new NostrService(config.nostr);
  return new MagicLinkService(nostrService, config.magicLink);
}

// Export types
export * from './types/index.js';
export * from './services/nostr.service.js';
export * from './services/magiclink.service.js';
