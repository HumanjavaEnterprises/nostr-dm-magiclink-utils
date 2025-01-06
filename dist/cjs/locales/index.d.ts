/**
 * Enum of supported locales
 */
export type Locale = 'en' | 'es' | 'fr' | 'ar' | 'ja' | 'pt' | 'zh' | 'ko' | 'ru';
/**
 * Enum of text directions
 */
export type TextDirection = 'ltr' | 'rtl';
/**
 * Interface for locale message templates
 */
interface LocaleMessageTemplates {
    /**
     * Title template
     */
    title: string;
    /**
     * Alternative template
     */
    alternative: string;
    /**
     * Expiry template
     */
    expiry: string;
    /**
     * Security tip template
     */
    securityTip: string;
    /**
     * Context templates
     */
    context?: {
        /**
         * Location template
         */
        location: string;
        /**
         * Device template
         */
        device: string;
        /**
         * Last login template
         */
        lastLogin: string;
        /**
         * Request source template
         */
        requestSource: string;
    };
}
/**
 * Interface for locale messages
 */
export interface LocaleMessages {
    /**
     * Text direction
     */
    direction: TextDirection;
    /**
     * Magic link message templates
     */
    magicLink: LocaleMessageTemplates;
}
/**
 * Service for handling internationalization and localization
 * Provides methods for managing locales, text direction, and message formatting
 */
export declare class LocaleService {
    /**
     * Default locale
     */
    private defaultLocale;
    /**
     * Current locale
     */
    private currentLocale;
    /**
     * Creates a new instance of LocaleService
     * @param locale - The initial locale to use. Defaults to 'en' if not provided or invalid
     */
    constructor(locale?: Locale);
    /**
     * Checks if a given locale string is a valid supported locale
     * @param locale - The locale string to validate
     * @returns True if the locale is supported, false otherwise
     */
    private isValidLocale;
    /**
     * Sets the current locale for the service
     * @param locale - The locale to set as current. Must be a supported locale
     */
    setLocale(locale: Locale): void;
    /**
     * Interpolates values into a template string
     * @param template - The template string containing placeholders in the format {{key}}
     * @param params - Object containing key-value pairs to interpolate into the template
     * @returns The interpolated string with all placeholders replaced with their values
     */
    private interpolate;
    /**
     * Gets the text direction (LTR or RTL) for the current locale
     * @returns The text direction for the current locale
     */
    getTextDirection(): TextDirection;
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
    formatMagicLinkMessage(params: {
        appName: string;
        magicLink: string;
        expiryMinutes?: number;
        context?: {
            location?: string;
            device?: string;
            lastLogin?: string;
            requestSource?: string;
        };
    }): string;
    /**
     * Gets a list of all supported locales
     * @returns An array of supported locale codes
     */
    getSupportedLocales(): Locale[];
    /**
     * Gets the currently active locale
     * @returns The current locale code
     */
    getCurrentLocale(): Locale;
}
export {};
//# sourceMappingURL=index.d.ts.map