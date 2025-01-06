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
function redactSensitiveData(obj: any, sensitiveKeys: string[] = ['privateKey', 'secret', 'password', 'token']): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const redacted = { ...obj };
  for (const key in redacted) {
    if (sensitiveKeys.includes(key)) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object') {
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
export function createLogger(name: string) {
  return pino({
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
}

/**
 * Default logger instance for the library
 */
export const logger = createLogger('nostr-dm-magiclink-utils');

// Re-export the Logger type for use in other files
export type { Logger } from 'pino';
