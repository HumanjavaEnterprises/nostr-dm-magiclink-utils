/**
 * Utilities for validating and sanitizing text to ensure no HTML/Markdown injection
 */
const HTML_PATTERN = /<[^>]*>/;
const MARKDOWN_PATTERNS = [
    /\[.*\]\(.*\)/, // Links
    /[*_~`]{1,3}.*[*_~`]{1,3}/, // Bold, italic, strikethrough, code
    /^#+\s/, // Headers
    /^\s*[-*+]\s/, // Lists
    /^\s*\d+\.\s/, // Numbered lists
    /^>\s/, // Blockquotes
    /```[\s\S]*```/, // Code blocks
    /\|.*\|/, // Tables
];
/**
 * Checks if text contains HTML or Markdown formatting
 * @param text - The text to check for HTML or Markdown syntax
 * @returns True if the text contains HTML or Markdown formatting, false otherwise
 */
export function containsHtmlOrMarkdown(text) {
    // Check for HTML
    if (HTML_PATTERN.test(text)) {
        return true;
    }
    // Check for Markdown
    return MARKDOWN_PATTERNS.some(pattern => pattern.test(text));
}
/**
 * Validates and sanitizes text by removing HTML and Markdown formatting
 * @param text - The text to validate and sanitize
 * @returns The sanitized plain text with all HTML and Markdown syntax removed
 */
export function validatePlainText(text) {
    if (!text)
        return '';
    // Remove HTML tags
    const noHtml = text.replace(/<[^>]*>/g, '');
    // Remove markdown syntax
    const noMarkdown = noHtml
        .replace(/[*_~`#]/g, '') // Basic markdown
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Links
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Images
        .replace(/^[-*+] /gm, '') // Lists
        .replace(/^\d+\. /gm, '') // Numbered lists
        .replace(/^>/gm, '') // Blockquotes
        .replace(/\|/g, '') // Tables
        .replace(/^#{1,6} /gm, ''); // Headers
    return noMarkdown.trim();
}
/**
 * Validates and sanitizes a URL to ensure it's safe to use
 * @param url - The URL to validate and sanitize
 * @returns The sanitized URL if valid, empty string otherwise
 */
export function validateUrl(url) {
    if (!url)
        return '';
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error('Invalid protocol');
        }
        // Basic sanitization
        return parsed.toString()
            .replace(/[<>"]/g, '') // Remove potentially dangerous characters
            .replace(/[{}|\\^~[\]`]/g, ''); // Remove markdown characters
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('URL validation error:', error.message);
        }
        else {
            console.error('Unknown URL validation error');
        }
        return '';
    }
}
/**
 * Validates if a string is a valid ISO 639-1 language code
 * @param code - The language code to validate
 * @returns True if the code is a valid language code, false otherwise
 */
export function validateLanguageCode(code) {
    if (!code)
        return false;
    // ISO 639-1 language code pattern
    const languagePattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/;
    return languagePattern.test(code);
}
//# sourceMappingURL=text-validator.js.map