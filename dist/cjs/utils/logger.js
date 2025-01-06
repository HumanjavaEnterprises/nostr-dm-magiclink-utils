/**
 * @file Logger utility
 * @description Logger utility for the application
 */
import pino from 'pino';
/**
 * Creates a logger instance with the specified name
 * @param name - Name for the logger instance
 * @returns Pino logger instance
 */
export function createLogger(name) {
    const logger = pino.default({
        name,
        level: process.env.LOG_LEVEL || 'info',
        redact: {
            paths: ['nsec', 'privkey', 'sk', 'secret', 'password', 'apiKey'],
            censor: '[REDACTED]'
        },
        timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
        formatters: {
            level: (label) => {
                return { level: label };
            },
        },
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
    });
    return logger;
}
/**
 * Default logger instance for the library
 */
export const logger = createLogger('nostr-dm-magiclink-utils');
//# sourceMappingURL=logger.js.map