import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

interface MagicLinkSession {
    token: string;
    npub: string;
    expiresAt: number;
}

export class MagicLinkService {
    private sessions: Map<string, MagicLinkSession>;
    private baseUrl: string;
    private tokenExpiry: number;
    private jwtSecret: string;

    constructor(
        jwtSecret: string,
        baseUrl: string,
        expiryMinutes: number = 5
    ) {
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is required');
        }
        if (!baseUrl) {
            throw new Error('BASE_URL is required');
        }
        
        this.jwtSecret = jwtSecret;
        this.baseUrl = baseUrl;
        this.tokenExpiry = expiryMinutes * 60 * 1000; // Convert to milliseconds
        this.sessions = new Map();
    }

    async createMagicLink(npub: string, expiresIn: number = 300): Promise<string> {
        if (!npub || npub.trim() === '') {
            throw new Error('Invalid pubkey: pubkey cannot be empty');
        }
        const token = jwt.sign(
            { npub },
            this.jwtSecret,
            { expiresIn: expiresIn } 
        );
        return token;
    }

    async verifyMagicLink(token: string): Promise<string | null> {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { npub: string };
            return decoded.npub;
        } catch (error) {
            console.error('Error verifying magic link:', error);
            return null;
        }
    }

    cleanup(): void {
        const now = Date.now();
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.expiresAt < now) {
                this.sessions.delete(sessionId);
            }
        }
    }
}
