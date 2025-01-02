import { NostrError, NostrErrorCode } from '../types/nostr';
import dotenv from 'dotenv';

export interface Config {
  port: number;
  jwtSecret: string;
  relayUrl: string;  // Kept for backward compatibility
  relayUrls: string[];  // New field for multiple relays
  baseUrl: string;
  nodeEnv: string;
  logLevel: string;
  retryAttempts: number;
  retryDelay: number;
  isTest?: boolean;
  isProduction?: boolean;
}

let config: Config | null = null;

const getEnvVar = (key: string, defaultValue?: string, required = true): string => {
  const value = process.env[key] || defaultValue;
  if (!value && required) {
    throw new NostrError(
      `Missing required environment variable: ${key}`,
      NostrErrorCode.VALIDATION_ERROR
    );
  }
  return value || '';
};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const loadEnvironment = async (): Promise<void> => {
  dotenv.config();
  
  const nodeEnv = getEnvVar('NODE_ENV', 'development', false);
  const isProduction = nodeEnv === 'production';
  
  // Support both comma-separated RELAY_URLS and single RELAY_URL for backward compatibility
  const relayUrls = (process.env.RELAY_URLS || process.env.RELAY_URL || '')
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0);

  if (relayUrls.length === 0) {
    if (isProduction || nodeEnv === 'test') {
      throw new NostrError(
        'No relay URLs provided. Set either RELAY_URLS or RELAY_URL environment variable.',
        NostrErrorCode.VALIDATION_ERROR
      );
    }
    // In development, use a default relay
    relayUrls.push('wss://relay.damus.io');
  }

  // Validate URLs
  for (const url of relayUrls) {
    if (!validateUrl(url)) {
      throw new NostrError(
        `Invalid relay URL format: ${url}`,
        NostrErrorCode.VALIDATION_ERROR
      );
    }
  }

  const baseUrl = getEnvVar('BASE_URL', 'http://localhost:3000', !isProduction);
  if (!validateUrl(baseUrl)) {
    throw new NostrError(
      'Invalid BASE_URL format',
      NostrErrorCode.VALIDATION_ERROR
    );
  }

  const port = parseInt(getEnvVar('PORT', '3000', false), 10);
  if (isNaN(port)) {
    throw new NostrError(
      'Invalid PORT number',
      NostrErrorCode.VALIDATION_ERROR
    );
  }

  const jwtSecret = getEnvVar('JWT_SECRET', 'dev-secret', isProduction);
  if (isProduction && jwtSecret === 'dev-secret') {
    throw new NostrError(
      'JWT_SECRET is required in production',
      NostrErrorCode.VALIDATION_ERROR
    );
  }

  config = {
    port,
    jwtSecret,
    relayUrl: relayUrls[0], // Use first URL for backward compatibility
    relayUrls,
    baseUrl,
    nodeEnv,
    logLevel: getEnvVar('LOG_LEVEL', 'info', false),
    retryAttempts: parseInt(getEnvVar('RETRY_ATTEMPTS', '3', false), 10),
    retryDelay: parseInt(getEnvVar('RETRY_DELAY', '1000', false), 10),
    isProduction,
    isTest: nodeEnv === 'test'
  };
};

export const getConfig = (): Config => {
  if (!config) {
    throw new NostrError(
      'Configuration not loaded',
      NostrErrorCode.VALIDATION_ERROR
    );
  }
  return config;
};

export const resetConfig = (): void => {
  config = null;
};
