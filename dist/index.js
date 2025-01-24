import { NostrService } from './services/nostr.service.js';
import { MagicLinkManager } from './services/magiclink.service.js';
import { createLogger } from './utils/logger.js';
const logger = createLogger('nostr-dm-magiclink-utils');
/**
 * Create a new instance of the magic link manager
 * @param config Service configuration
 * @returns MagicLinkManager instance
 */
export function createMagicLinkService(config) {
    // Validate required configuration
    if (!config.magicLink.token) {
        throw new Error('Token is required');
    }
    if (!config.magicLink.verifyUrl) {
        throw new Error('Verify URL is required');
    }
    logger.info('Creating magic link manager');
    const nostrService = new NostrService(config.nostr);
    return new MagicLinkManager(nostrService, config.magicLink);
}
// Export types
export * from './types/index.js';
export * from './services/nostr.service.js';
export * from './services/magiclink.service.js';
//# sourceMappingURL=index.js.map