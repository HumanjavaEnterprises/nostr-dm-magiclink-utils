/**
 * @file Logger utility
 * @description Logger utility for the application
 */
import pino from 'pino';
import { Logger } from 'pino';
/**
 * Creates a logger instance with the specified name
 * @param name - Name for the logger instance
 * @returns Pino logger instance
 */
export declare function createLogger(name: string): Logger;
/**
 * Default logger instance for the library
 */
export declare const logger: pino.Logger;
export type { Logger } from 'pino';
//# sourceMappingURL=logger.d.ts.map