"use strict";
/**
 * @file Logger utility
 * @module utils/logger
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createLogger = createLogger;
exports.getLogger = getLogger;
exports.getChildLogger = getChildLogger;
const pino_1 = __importDefault(require("pino"));
/**
 * Create a new logger instance
 * @param name Name of the logger
 * @returns Logger instance
 */
function createLogger(name) {
    return (0, pino_1.default)({
        name,
        level: process.env.LOG_LEVEL || 'info'
    });
}
/**
 * Get a logger instance for a specific component
 * @param component Component name for the logger
 * @returns Logger instance
 */
function getLogger(component) {
    return createLogger(component);
}
/**
 * Get a child logger instance
 * @param parent Parent logger instance
 * @param bindings Additional bindings for the child logger
 * @returns Child logger instance
 */
function getChildLogger(parent, bindings) {
    return parent.child(bindings);
}
/**
 * Default logger instance
 */
exports.logger = createLogger('nostr-dm-magiclink-utils');
//# sourceMappingURL=logger.js.map