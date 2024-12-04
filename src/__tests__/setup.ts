import { config } from 'dotenv';
import { generatePrivateKey } from 'nostr-tools';
import { EventEmitter } from 'events';

// Load environment variables
config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3003';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MAGIC_LINK_BASE_URL = 'http://localhost:3003/auth/magiclink/verify';

// Generate test keys if not present
if (!process.env.NOSTR_PRIVATE_KEY) {
    process.env.NOSTR_PRIVATE_KEY = generatePrivateKey();
}

// Mock WebSocket for Nostr relay connections
class MockWebSocket extends EventEmitter {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    readyState = MockWebSocket.CONNECTING;
    url: string;

    constructor(url: string) {
        super();
        this.url = url;
        setTimeout(() => {
            this.readyState = MockWebSocket.OPEN;
            this.emit('open');
        }, 0);
    }

    send(data: string) {
        // Mock relay response
        setTimeout(() => {
            this.emit('message', { data: JSON.stringify({ success: true }) });
        }, 0);
    }

    close() {
        this.readyState = MockWebSocket.CLOSED;
        this.emit('close');
    }
}

// Replace global WebSocket with mock
(global as any).WebSocket = MockWebSocket;
