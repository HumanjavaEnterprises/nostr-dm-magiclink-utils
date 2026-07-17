"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleService = void 0;
const en_js_1 = __importDefault(require("./en.js"));
const es_js_1 = __importDefault(require("./es.js"));
const fr_js_1 = __importDefault(require("./fr.js"));
const ar_js_1 = __importDefault(require("./ar.js"));
const ja_js_1 = __importDefault(require("./ja.js"));
const pt_js_1 = __importDefault(require("./pt.js"));
const zh_js_1 = __importDefault(require("./zh.js"));
const ko_js_1 = __importDefault(require("./ko.js"));
const ru_js_1 = __importDefault(require("./ru.js"));
const text_validator_js_1 = require("../utils/text-validator.js");
/**
 * Record of locale messages
 */
const messages = {
    en: en_js_1.default,
    es: es_js_1.default,
    fr: fr_js_1.default,
    ar: ar_js_1.default,
    ja: ja_js_1.default,
    pt: pt_js_1.default,
    zh: zh_js_1.default,
    ko: ko_js_1.default,
    ru: ru_js_1.default
};
/**
 * Service for handling internationalization and localization
 * Provides methods for managing locales, text direction, and message formatting
 */
class LocaleService {
    /**
     * Default locale
     */
    defaultLocale = 'en';
    /**
     * Current locale
     */
    currentLocale;
    /**
     * Creates a new instance of LocaleService
     * @param locale - The initial locale to use. Defaults to 'en' if not provided or invalid
     */
    constructor(locale = 'en') {
        this.currentLocale = this.isValidLocale(locale) ? locale : this.defaultLocale;
    }
    /**
     * Checks if a given locale string is a valid supported locale
     * @param locale - The locale string to validate
     * @returns True if the locale is supported, false otherwise
     */
    isValidLocale(locale) {
        return locale in messages;
    }
    /**
     * Sets the current locale for the service
     * @param locale - The locale to set as current. Must be a supported locale
     */
    setLocale(locale) {
        if (this.isValidLocale(locale)) {
            this.currentLocale = locale;
        }
    }
    /**
     * Interpolates values into a template string
     * @param template - The template string containing placeholders in the format {{key}}
     * @param params - Object containing key-value pairs to interpolate into the template
     * @returns The interpolated string with all placeholders replaced with their values
     */
    interpolate(template, params) {
        return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(params[key] || `{{${key}}}`));
    }
    /**
     * Gets the text direction (LTR or RTL) for the current locale
     * @returns The text direction for the current locale
     */
    getTextDirection() {
        return messages[this.currentLocale].direction;
    }
    /**
     * Formats a magic link message with the current locale's templates
     * @param params - Parameters for formatting the magic link message
     * @param params.appName - The name of the application
     * @param params.magicLink - The magic link URL
     * @param params.expiryMinutes - Optional number of minutes until the link expires
     * @param params.context - Optional context information
     * @param params.context.location - Optional location where the request originated
     * @param params.context.device - Optional device information
     * @param params.context.lastLogin - Optional last login information
     * @param params.context.requestSource - Optional request source information
     * @returns A formatted message string with all parameters interpolated
     */
    formatMagicLinkMessage(params) {
        // Validate all inputs
        const safeAppName = (0, text_validator_js_1.validatePlainText)(params.appName);
        const safeMagicLink = (0, text_validator_js_1.validateUrl)(params.magicLink);
        // Validate context if provided
        const safeContext = params.context ? Object.fromEntries(Object.entries(params.context)
            .map(([key, value]) => [key, value ? (0, text_validator_js_1.validatePlainText)(value) : undefined])
            .filter(([, value]) => value !== undefined)) : undefined;
        const locale = messages[this.currentLocale];
        const { title, alternative, expiry, securityTip, context: contextTemplates } = locale.magicLink;
        const direction = this.getTextDirection();
        const directionMark = direction === 'rtl' ? '\u200F' : '\u200E';
        const parts = [
            this.interpolate(title, { appName: safeAppName }),
            '',
            directionMark + safeMagicLink,
            '',
            this.interpolate(alternative, { appName: safeAppName }),
            directionMark + safeMagicLink
        ];
        if (params.expiryMinutes) {
            parts.push('', this.interpolate(expiry, { minutes: params.expiryMinutes }));
        }
        parts.push('', securityTip);
        // Add context information if provided
        if (safeContext && contextTemplates) {
            const contextParts = Object.entries(safeContext)
                .map(([key, value]) => {
                const template = contextTemplates[key];
                return template ? this.interpolate(template, { [key]: value }) : undefined;
            })
                .filter((part) => part !== undefined);
            if (contextParts.length > 0) {
                parts.push('', ...contextParts);
            }
        }
        return parts.join('\n');
    }
    /**
     * Gets a list of all supported locales
     * @returns An array of supported locale codes
     */
    getSupportedLocales() {
        return Object.keys(messages);
    }
    /**
     * Gets the currently active locale
     * @returns The current locale code
     */
    getCurrentLocale() {
        return this.currentLocale;
    }
}
exports.LocaleService = LocaleService;
//# sourceMappingURL=index.js.map