/**
 * @module logger
 * @description Logger utility for the application
 */

import pino from 'pino';

/**
 * Redacts sensitive data from objects before logging
 * @param obj - Object to redact
 * @returns Redacted object
 */
function redactSensitiveData(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitiveFields = ['privkey', 'nsec', 'secret', 'password', 'token'];
  const redactedObj: Record<string, unknown> = { ...obj as Record<string, unknown> };

  for (const key in redactedObj) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      redactedObj[key] = '[REDACTED]';
    } else if (typeof redactedObj[key] === 'object') {
      redactedObj[key] = redactSensitiveData(redactedObj[key]);
    }
  }

  return redactedObj;
}

/**
 * Create a logger instance with consistent configuration
 * @param name - Component or module name for the logger
 * @returns Configured pino logger instance
 */
export function createLogger(name: string): pino.Logger {
  return pino({
    name,
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      }
    } : undefined,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
      log: (obj: Record<string, unknown>) => {
        // Redact sensitive data
        return redactSensitiveData(obj) as Record<string, unknown>;
      }
    },
    mixin: () => ({})
  });
}

/**
 * Simple log function for basic logging needs
 * @param message - Message to log
 * @param data - Optional data to include
 */
export function log(message: string, data?: unknown): void {
  const redactedData = data ? redactSensitiveData(data) : undefined;
  console.log(message, redactedData);
}

/**
 * Default logger instance for the application
 * Includes enhanced error handling and formatting
 */
export const logger = createLogger('nostr-dm-magiclink-utils');

// Re-export the Logger type for use in other files
export type { Logger } from 'pino';
