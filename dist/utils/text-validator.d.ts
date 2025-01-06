/**
 * Utilities for validating and sanitizing text to ensure no HTML/Markdown injection
 */
/**
 * Checks if text contains HTML or Markdown formatting
 * @param text - The text to check for HTML or Markdown syntax
 * @returns True if the text contains HTML or Markdown formatting, false otherwise
 */
export declare function containsHtmlOrMarkdown(text: string): boolean;
/**
 * Validates and sanitizes text by removing HTML and Markdown formatting
 * @param text - The text to validate and sanitize
 * @returns The sanitized plain text with all HTML and Markdown syntax removed
 */
export declare function validatePlainText(text: string): string;
/**
 * Validates and sanitizes a URL to ensure it's safe to use
 * @param url - The URL to validate and sanitize
 * @returns The sanitized URL if valid, empty string otherwise
 */
export declare function validateUrl(url: string): string;
/**
 * Validates if a string is a valid ISO 639-1 language code
 * @param code - The language code to validate
 * @returns True if the code is a valid language code, false otherwise
 */
export declare function validateLanguageCode(code: string): boolean;
//# sourceMappingURL=text-validator.d.ts.map