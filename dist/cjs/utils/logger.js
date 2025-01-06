/**
 * @file Logger utility
 * @description Logger utility for the application
 */
import pino from 'pino';
/**
 * Redacts sensitive data from objects before logging
 * @param obj - Object to redact
 * @param sensitiveKeys - Array of sensitive keys to redact
 * @returns Redacted object
 */
function redactSensitiveData(obj, sensitiveKeys = ['privateKey', 'secret', 'password', 'token']) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    const redacted = { ...obj };
    for (const key in redacted) {
        if (sensitiveKeys.includes(key)) {
            redacted[key] = '[REDACTED]';
        }
        else if (typeof redacted[key] === 'object') {
            redacted[key] = redactSensitiveData(redacted[key], sensitiveKeys);
        }
    }
    return redacted;
}
/**
 * Creates a logger instance with the given name
 * @param name - Name for the logger instance
 * @returns Pino logger instance
 */
export function createLogger(name) {
    return pino.default({
        name,
        level: process.env.LOG_LEVEL || 'info',
        redact: {
            paths: ['privateKey', 'secret', 'password', 'token'],
            censor: '[REDACTED]'
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
            level: (label) => {
                return { level: label };
            },
            // Use redactSensitiveData for log objects
            log: (obj) => redactSensitiveData(obj)
        }
    });
}
/**
 * Default logger instance for the library
 */
export const logger = createLogger('nostr-dm-magiclink-utils');
//# sourceMappingURL=logger.js.map