import { NostrServiceInterface, MagicLinkServiceInterface } from '../types/service';
import { 
  MagicLinkConfig, 
  SendMagicLinkOptions, 
  MagicLinkResponse,
  MessageOptions 
} from '../types';
import { createLogger } from '../utils/logger';
import { Logger } from 'pino';
import { NostrError, NostrErrorCode, ErrorDetails } from '../types';
import jwt from 'jsonwebtoken';

/**
 * Service for handling magic link authentication
 * Manages generation, sending, and verification of magic links through Nostr protocol
 */
export class MagicLinkService implements MagicLinkServiceInterface {
  private readonly logger: Logger;
  private readonly defaultTemplate: Record<string, string> = {
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
  constructor(
    private readonly nostrService: NostrServiceInterface,
    private readonly config: MagicLinkConfig,
    logger?: Logger
  ) {
    this.logger = logger || createLogger('MagicLinkService');
  }

  /**
   * Sends a magic link to a recipient via Nostr direct message
   * @param options - Options for sending the magic link
   * @param options.recipientPubkey - Public key of the recipient
   * @param options.messageOptions - Optional message formatting options
   * @returns Promise resolving to a response object containing success status and magic link or error
   */
  async sendMagicLink(options: SendMagicLinkOptions): Promise<MagicLinkResponse> {
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
    } catch (error) {
      this.handleError(error, 'send magic link');
      return {
        success: false,
        error: 'Failed to send magic link'
      };
    }
  }

  /**
   * Verifies a magic link token and returns the associated public key
   * @param token - The token to verify
   * @returns Promise resolving to the public key if verification succeeds, null otherwise
   */
  async verifyMagicLink(token: string): Promise<string | null> {
    try {
      // If token is a function, get the actual token
      const actualToken = typeof this.config.token === 'function' 
        ? await this.config.token()
        : this.config.token;

      const decoded = jwt.verify(token, actualToken) as { pubkey: string };
      if (!decoded || !decoded.pubkey) {
        throw new Error('Invalid token payload');
      }
      this.logger.debug({ pubkey: decoded.pubkey }, 'Token verified successfully');
      return decoded.pubkey;
    } catch (error) {
      this.handleError(error, 'verify magic link');
      return null;
    }
  }

  /**
   * Generates a token for magic link authentication
   * @returns Promise resolving to the generated token
   * @throws {NostrError} If token generation fails
   */
  private async generateToken(): Promise<string> {
    try {
      // If token is a function, call it to get the token
      if (typeof this.config.token === 'function') {
        return await this.config.token();
      }
      return this.config.token;
    } catch (error) {
      this.handleError(error, 'generate token');
      throw new NostrError(
        'Failed to generate token',
        NostrErrorCode.TOKEN_GENERATION_ERROR
      );
    }
  }

  /**
   * Formats a message with the given template and variables
   * @param link - The magic link URL
   * @param options - Message formatting options
   * @returns Formatted message string
   */
  private formatMessage(link: string, options: MessageOptions = {}): string {
    const {
      template,
      variables = {},
      textDirection = this.config.defaultTextDirection || 'ltr'
    } = options;

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

  private handleError(error: unknown, operation: string): never {
    const details: ErrorDetails = {
      cause: error instanceof Error ? error : new Error('Unknown error occurred')
    };

    throw new NostrError(
      `Failed to ${operation}`,
      NostrErrorCode.GENERAL_ERROR,
      details
    );
  }
}
