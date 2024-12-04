import express, { Request, Response, NextFunction, Router } from 'express';
import { MagicLinkService } from '../services/magiclink.service.js';
import { NostrService } from '../services/nostr.service.js';

export interface NostrMagicLinkConfig {
  nostrService: NostrService;
  magicLinkService: MagicLinkService;
}

export interface NostrMagicLinkRequest extends Request {
  nostr?: {
    npub: string;
    sessionId: string;
  };
  body: {
    npub: string;
    [key: string]: any;
  };
  query: {
    session?: string;
    token?: string;
    [key: string]: string | undefined;
  };
}

export class NostrMagicLinkMiddleware {
  private nostrService: NostrService;
  private magicLinkService: MagicLinkService;
  public router: Router;

  constructor(config: NostrMagicLinkConfig) {
    this.nostrService = config.nostrService;
    this.magicLinkService = config.magicLinkService;
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/request', this.requestMagicLink.bind(this));
    this.router.get('/verify', this.verifyMagicLink.bind(this));
  }

  private async requestMagicLink(req: NostrMagicLinkRequest, res: Response) {
    try {
      const { npub } = req.body;
      if (!npub) {
        return res.status(400).json({ error: 'npub is required' });
      }

      if (!npub.startsWith('npub1')) {
        return res.status(400).json({ error: 'Invalid npub format' });
      }

      const token = await this.magicLinkService.createMagicLink(npub);
      const verifyUrl = `${process.env.MAGIC_LINK_BASE_URL}?token=${token}`;
      
      await this.nostrService.sendDM(npub, `Click to verify: ${verifyUrl}`);
      
      res.json({ success: true, message: 'Magic link sent' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid npub format') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error requesting magic link:', error);
      res.status(500).json({ error: 'Failed to send magic link' });
    }
  }

  private async verifyMagicLink(req: NostrMagicLinkRequest, res: Response) {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token is required' });
      }

      const npub = await this.magicLinkService.verifyMagicLink(token);
      if (!npub) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Attach verified npub to request for downstream middleware
      req.nostr = {
        npub,
        sessionId: req.query.session as string
      };

      res.json({ success: true, npub });
    } catch (error) {
      console.error('Error verifying magic link:', error);
      res.status(500).json({ error: 'Failed to verify magic link' });
    }
  }
}
