import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NostrService } from '../../services/nostr.service';
import { NostrError } from '../../types/errors';
import { NostrServiceConfig } from '../../types/config';

// Mock external dependencies
const mockConnect = vi.fn().mockResolvedValue(undefined);
const mockDisconnect = vi.fn().mockResolvedValue(undefined);
const mockSendMessage = vi.fn().mockResolvedValue(undefined);

vi.mock('nostr-websocket-utils', () => ({
  NostrWSClient: vi.fn().mockImplementation(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    sendMessage: mockSendMessage
  }))
}));

vi.mock('nostr-crypto-utils', () => ({
  encrypt: vi.fn().mockResolvedValue('encrypted_test message'),
  generateKeyPair: vi.fn().mockResolvedValue({
    publicKey: 'pub_test-private-key',
    privateKey: 'test-private-key'
  })
}));

// Mock NIP-01 functions
vi.mock('../../nips/nip01', () => ({
  signedEvent: vi.fn().mockResolvedValue({
    id: 'test-event-id',
    pubkey: 'test-pubkey',
    created_at: Math.floor(Date.now() / 1000),
    kind: 4,
    tags: [['p', 'test-pubkey']],
    content: 'encrypted_test message',
    sig: 'test-signature'
  })
}));

describe('NostrService', () => {
  let service: NostrService;
  let config: NostrServiceConfig;

  beforeEach(() => {
    vi.clearAllMocks();
    
    config = {
      relayUrls: ['wss://relay1.example.com'],
      privateKey: 'test-private-key'
    };
    
    service = new NostrService(config);
  });

  describe('core functionality', () => {
    it('should send direct message successfully when connected', async () => {
      await service.connect();
      const event = await service.sendDirectMessage('test-pubkey', 'test message');
      
      expect(event).toBeDefined();
      expect(event.kind).toBe(4); // Direct message kind
      expect(mockSendMessage).toHaveBeenCalled();
    });

    it('should throw error if private key is empty', async () => {
      service = new NostrService({ ...config, privateKey: '' });
      await expect(
        service.sendDirectMessage('test-pubkey', 'test message')
      ).rejects.toThrow(NostrError);
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should throw error if no relay URLs configured', async () => {
      service = new NostrService({ ...config, relayUrls: [] });
      await expect(service.connect()).rejects.toThrow(NostrError);
    });
  });
});
