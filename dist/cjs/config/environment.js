"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetConfig = exports.getConfig = exports.loadEnvironment = void 0;
const nostr_js_1 = require("../types/nostr.js");
const dotenv_1 = __importDefault(require("dotenv"));
let config = null;
const getEnvVar = (key, defaultValue, required = true) => {
    const value = process.env[key] || defaultValue;
    if (!value && required) {
        throw new nostr_js_1.NostrError(`Missing required environment variable: ${key}`, nostr_js_1.NostrErrorCode.VALIDATION_ERROR);
    }
    return value || '';
};
const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
const loadEnvironment = async () => {
    dotenv_1.default.config({ quiet: true });
    const nodeEnv = getEnvVar('NODE_ENV', 'development', false);
    const isProduction = nodeEnv === 'production';
    // Support both comma-separated RELAY_URLS and single RELAY_URL for backward compatibility
    const relayUrls = (process.env.RELAY_URLS || process.env.RELAY_URL || '')
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);
    if (relayUrls.length === 0) {
        if (isProduction || nodeEnv === 'test') {
            throw new nostr_js_1.NostrError('No relay URLs provided. Set either RELAY_URLS or RELAY_URL environment variable.', nostr_js_1.NostrErrorCode.VALIDATION_ERROR);
        }
        // In development, use a default relay
        relayUrls.push('wss://relay.damus.io');
    }
    // Validate URLs
    for (const url of relayUrls) {
        if (!validateUrl(url)) {
            throw new nostr_js_1.NostrError(`Invalid relay URL format: ${url}`, nostr_js_1.NostrErrorCode.VALIDATION_ERROR);
        }
    }
    const baseUrl = getEnvVar('BASE_URL', 'http://localhost:3000', !isProduction);
    if (!validateUrl(baseUrl)) {
        throw new nostr_js_1.NostrError('Invalid BASE_URL format', nostr_js_1.NostrErrorCode.VALIDATION_ERROR);
    }
    const port = parseInt(getEnvVar('PORT', '3000', false), 10);
    if (isNaN(port)) {
        throw new nostr_js_1.NostrError('Invalid PORT number', nostr_js_1.NostrErrorCode.VALIDATION_ERROR);
    }
    const jwtSecret = getEnvVar('JWT_SECRET', 'dev-secret', isProduction);
    if (isProduction && jwtSecret === 'dev-secret') {
        throw new nostr_js_1.NostrError('JWT_SECRET is required in production', nostr_js_1.NostrErrorCode.VALIDATION_ERROR);
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
exports.loadEnvironment = loadEnvironment;
const getConfig = () => {
    if (!config) {
        throw new nostr_js_1.NostrError('Configuration not loaded', nostr_js_1.NostrErrorCode.VALIDATION_ERROR);
    }
    return config;
};
exports.getConfig = getConfig;
const resetConfig = () => {
    config = null;
};
exports.resetConfig = resetConfig;
//# sourceMappingURL=environment.js.map