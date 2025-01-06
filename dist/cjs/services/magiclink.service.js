import { createLogger } from '../utils/logger.js';
import { NostrError, NostrErrorCode } from '../types/index.js';
import jwt from 'jsonwebtoken';
/**
 * Service for handling magic link authentication
 * Manages generation, sending, and verification of magic links through Nostr protocol
 */
export class MagicLinkService {
    nostrService;
    config;
    logger;
    defaultTemplate = {
        en: 'Click this magic link to login: {{link}}',
        ar: 'انقر فوق هذا الرابط السحري لتسجيل الدخول: {{link}}',
        es: 'Haz clic en este enlace mágico para iniciar sesión: {{link}}',
        fr: 'Cliquez sur ce lien magique pour vous connecter: {{link}}',
        ja: 'ログインするには、このマジックリンクをクリックしてください：{{link}}',
        ko: '로그인하려면 이 매직 링크를 클릭하세요: {{link}}',
        pt: 'Clique neste link mágico para fazer login: {{link}}',
        ru: 'Нажмите на эту волшебную ссылку, чтобы войти: {{link}}',
        zh: '点击此魔法链接登录：{{link}}'
    };
    /**
     * Creates a new instance of MagicLinkService
     * @param nostrService - Service for handling Nostr protocol operations
     * @param config - Configuration for magic link functionality
     * @param logger - Optional logger instance. If not provided, creates a new logger
     */
    constructor(nostrService, config, logger) {
        this.nostrService = nostrService;
        this.config = config;
        this.logger = logger || createLogger('MagicLinkService');
    }
    /**
     * Sends a magic link to a recipient via Nostr direct message
     * @param options - Options for sending the magic link
     * @param options.recipientPubkey - Public key of the recipient
     * @param options.messageOptions - Optional message formatting options
     * @returns Promise resolving to a response object containing success status and magic link or error
     */
    async sendMagicLink(options) {
        try {
            const { recipientPubkey, messageOptions = {} } = options;
            const token = await this.generateToken();
            const link = `${this.config.verifyUrl}?token=${token}`;
            const message = this.formatMessage(link, messageOptions);
            await this.nostrService.sendDirectMessage(recipientPubkey, message);
            return {
                success: true,
                magicLink: link
            };
        }
        catch (error) {
            const errorDetails = new NostrError('Failed to send magic link', NostrErrorCode.GENERAL_ERROR, error instanceof Error ? error : undefined);
            throw errorDetails;
        }
    }
    /**
     * Verifies a magic link token and returns the associated public key
     * @param token - The token to verify
     * @returns Promise resolving to the public key if verification succeeds, null otherwise
     */
    async verifyMagicLink(token) {
        try {
            // If token is a function, get the actual token
            const actualToken = typeof this.config.token === 'function'
                ? await this.config.token()
                : this.config.token;
            const decoded = jwt.verify(token, actualToken);
            if (!decoded || !decoded.pubkey) {
                throw new Error('Invalid token payload');
            }
            this.logger.debug({ pubkey: decoded.pubkey }, 'Token verified successfully');
            return decoded.pubkey;
        }
        catch (error) {
            const errorDetails = new NostrError('Failed to verify magic link', NostrErrorCode.GENERAL_ERROR, error instanceof Error ? error : undefined);
            throw errorDetails;
        }
    }
    /**
     * Generates a token for magic link authentication
     * @returns Promise resolving to the generated token
     * @throws {NostrError} If token generation fails
     */
    async generateToken() {
        try {
            // If token is a function, call it to get the token
            if (typeof this.config.token === 'function') {
                return await this.config.token();
            }
            return this.config.token;
        }
        catch (error) {
            const errorDetails = new NostrError('Failed to generate token', NostrErrorCode.TOKEN_GENERATION_ERROR, error instanceof Error ? error : undefined);
            throw errorDetails;
        }
    }
    /**
     * Formats a message with the given template and variables
     * @param link - The magic link URL
     * @param options - Message formatting options
     * @returns Formatted message string
     */
    formatMessage(link, options = {}) {
        const { template, variables = {}, textDirection = this.config.defaultTextDirection || 'ltr' } = options;
        const locale = options.locale || this.config.defaultLocale || 'en';
        let message = template || this.defaultTemplate[locale] || this.defaultTemplate.en;
        const allVariables = {
            ...variables,
            link,
            device: variables.device || ''
        };
        // Replace all variables in the template
        Object.entries(allVariables).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            message = message.replace(placeholder, value || '');
        });
        // Handle RTL text if needed
        if (textDirection === 'rtl') {
            message = `\u200F${message}\u200F`; // Add RLM markers
        }
        return message;
    }
}
//# sourceMappingURL=magiclink.service.js.map