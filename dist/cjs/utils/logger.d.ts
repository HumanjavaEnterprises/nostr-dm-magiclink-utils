/**
 * @file Logger utility
 * @module utils/logger
 */
import type { Logger } from 'pino';
/**
 * Create a new logger instance
 * @param name Name of the logger
 * @returns Logger instance
 */
export declare function createLogger(name: string): Logger;
/**
 * Get a logger instance for a specific component
 * @param component Component name for the logger
 * @returns Logger instance
 */
export declare function getLogger(component: string): Logger;
/**
 * Get a child logger instance
 * @param parent Parent logger instance
 * @param bindings Additional bindings for the child logger
 * @returns Child logger instance
 */
export declare function getChildLogger(parent: Logger, bindings: object): Logger;
/**
 * Default logger instance
 */
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map