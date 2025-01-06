import en from './en.js';
import es from './es.js';
import fr from './fr.js';
import ar from './ar.js';
import ja from './ja.js';
import pt from './pt.js';
import zh from './zh.js';
import ko from './ko.js';
import ru from './ru.js';
import { validatePlainText, validateUrl } from '../utils/text-validator.js';
/**
 * Record of locale messages
 */
const messages = {
    en,
    es,
    fr,
    ar,
    ja,
    pt,
    zh,
    ko,
    ru
};
/**
 * Service for handling internationalization and localization
 * Provides methods for managing locales, text direction, and message formatting
 */
export class LocaleService {
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
        const safeAppName = validatePlainText(params.appName);
        const safeMagicLink = validateUrl(params.magicLink);
        // Validate context if provided
        const safeContext = params.context ? Object.fromEntries(Object.entries(params.context)
            .map(([key, value]) => [key, value ? validatePlainText(value) : undefined])
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
//# sourceMappingURL=index.js.map