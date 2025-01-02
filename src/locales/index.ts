import en from './en';
import es from './es';
import fr from './fr';
import ar from './ar';
import ja from './ja';
import pt from './pt';
import zh from './zh';
import ko from './ko';
import ru from './ru';
import { validatePlainText, validateUrl } from '../utils/text-validator';

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
 * Record of locale messages
 */
const messages: Record<Locale, LocaleMessages> = {
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
  private defaultLocale: Locale = 'en';
  /**
   * Current locale
   */
  private currentLocale: Locale;

  /**
   * Creates a new instance of LocaleService
   * @param locale - The initial locale to use. Defaults to 'en' if not provided or invalid
   */
  constructor(locale: Locale = 'en') {
    this.currentLocale = this.isValidLocale(locale) ? locale : this.defaultLocale;
  }

  /**
   * Checks if a given locale string is a valid supported locale
   * @param locale - The locale string to validate
   * @returns True if the locale is supported, false otherwise
   */
  private isValidLocale(locale: string): locale is Locale {
    return locale in messages;
  }

  /**
   * Sets the current locale for the service
   * @param locale - The locale to set as current. Must be a supported locale
   */
  setLocale(locale: Locale) {
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
  private interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => 
      String(params[key] || `{{${key}}}`)
    );
  }

  /**
   * Gets the text direction (LTR or RTL) for the current locale
   * @returns The text direction for the current locale
   */
  getTextDirection(): TextDirection {
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
  }): string {
    // Validate all inputs
    const safeAppName = validatePlainText(params.appName);
    const safeMagicLink = validateUrl(params.magicLink);
    
    // Validate context if provided
    const safeContext = params.context ? Object.fromEntries(
      Object.entries(params.context)
        .map(([key, value]) => [key, value ? validatePlainText(value) : undefined])
        .filter(([, value]) => value !== undefined)
    ) as Record<string, string> : undefined;

    const locale = messages[this.currentLocale];
    const {
      title,
      alternative,
      expiry,
      securityTip,
      context: contextTemplates
    } = locale.magicLink;

    const direction = this.getTextDirection();
    const directionMark = direction === 'rtl' ? '\u200F' : '\u200E';

    const parts: string[] = [
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
          const template = contextTemplates[key as keyof typeof contextTemplates];
          return template ? this.interpolate(template, { [key]: value }) : undefined;
        })
        .filter((part): part is string => part !== undefined);

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
  getSupportedLocales(): Locale[] {
    return Object.keys(messages) as Locale[];
  }

  /**
   * Gets the currently active locale
   * @returns The current locale code
   */
  getCurrentLocale(): Locale {
    return this.currentLocale;
  }
}
