"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEvent = exports.createEvent = void 0;
const nostr_crypto_utils_1 = require("nostr-crypto-utils");
const crypto_1 = __importDefault(require("crypto"));
const errors_js_1 = require("../../types/errors.js");
const logger_js_1 = require("../../utils/logger.js");
/**
 * Create a signed Nostr event
 * Uses finalizeEvent for one-step create+sign and getPublicKeySync for sync pubkey derivation.
 * @param content Event content
 * @param kind Event kind
 * @param privateKey Private key to sign the event
 * @param tags Optional event tags
 * @returns Signed Nostr event
 */
const createEvent = async (content, kind, privateKey, tags = []) => {
    try {
        const pubkey = (0, nostr_crypto_utils_1.getPublicKeySync)(privateKey);
        const nonce = crypto_1.default.randomBytes(4).readUInt32BE(0) % 1000000;
        // Use finalizeEvent for one-step create + hash + sign
        const signed = await (0, nostr_crypto_utils_1.finalizeEvent)({
            pubkey,
            kind,
            tags,
            content: `${content}:${nonce}`,
        }, privateKey);
        return {
            pubkey: signed.pubkey,
            created_at: signed.created_at,
            kind: signed.kind,
            tags: signed.tags,
            content: signed.content,
            id: signed.id,
            sig: signed.sig,
        };
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Error creating event');
        throw new errors_js_1.NostrError('Failed to create event', errors_js_1.NostrErrorCode.EVENT_CREATION_FAILED, error instanceof Error ? error : new Error(String(error)));
    }
};
exports.createEvent = createEvent;
/**
 * Verify a Nostr event's signature and structure
 * @param event Event to verify
 * @returns True if event is valid, false otherwise
 */
const verifyEvent = async (event) => {
    try {
        const now = Math.floor(Date.now() / 1000);
        // Check timestamp
        if (event.created_at > now + 60) { // Allow 1 minute clock skew
            logger_js_1.logger.warn('Event from future');
            return false;
        }
        if (event.created_at < now - 60 * 60 * 24 * 365) { // Reject events older than 1 year
            logger_js_1.logger.warn('Event too old');
            return false;
        }
        // Verify signature
        return await (0, nostr_crypto_utils_1.verifySignature)(event);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Error verifying event');
        return false;
    }
};
exports.verifyEvent = verifyEvent;
//# sourceMappingURL=nip01.js.map