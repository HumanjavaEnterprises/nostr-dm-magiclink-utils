"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMagicLinkService = createMagicLinkService;
const nostr_service_js_1 = require("./services/nostr.service.js");
const magiclink_service_js_1 = require("./services/magiclink.service.js");
const logger_js_1 = require("./utils/logger.js");
const logger = (0, logger_js_1.createLogger)('nostr-dm-magiclink-utils');
/**
 * Create a new instance of the magic link manager
 * @param config Service configuration
 * @returns MagicLinkManager instance
 */
function createMagicLinkService(config) {
    // Validate required configuration
    if (!config.magicLink.token) {
        throw new Error('Token is required');
    }
    if (!config.magicLink.verifyUrl) {
        throw new Error('Verify URL is required');
    }
    logger.info('Creating magic link manager');
    const nostrService = new nostr_service_js_1.NostrService(config.nostr);
    return new magiclink_service_js_1.MagicLinkManager(nostrService, config.magicLink);
}
// Export types
__exportStar(require("./types/index.js"), exports);
__exportStar(require("./services/nostr.service.js"), exports);
__exportStar(require("./services/magiclink.service.js"), exports);
//# sourceMappingURL=index.js.map