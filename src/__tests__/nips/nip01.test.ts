import { describe, expect, it } from 'vitest';
import { createEvent, serializeEvent, validateEvent } from '../../nips/nip01';
import { NostrEvent } from '../../types/nostr';

describe('nip01', () => {
  describe('createEvent', () => {
    it('should create a valid event object', () => {
      const event = createEvent({
        kind: 1,
        content: 'test content',
        pubkey: 'test-pubkey'
      });
      
      expect(event).toBeDefined();
      expect(event.kind).toBe(1);
      expect(event.content).toBe('test content');
      expect(event.tags).toEqual([]);
      expect(event.pubkey).toBe('test-pubkey');
    });

    it('should include created_at timestamp', () => {
      const event = createEvent({
        kind: 1,
        content: 'test content',
        pubkey: 'test-pubkey'
      });
      expect(event.created_at).toBeDefined();
      expect(typeof event.created_at).toBe('number');
    });
  });

  describe('serializeEvent', () => {
    it('should serialize event object correctly', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        created_at: 1234567890,
        kind: 1,
        tags: [],
        content: 'test content',
        sig: 'test-sig'
      };
      const serialized = serializeEvent(event);
      expect(typeof serialized).toBe('string');
      expect(serialized).toContain('test content');
    });
  });

  describe('validateEvent', () => {
    it('should validate correct event', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        created_at: 1234567890,
        kind: 1,
        tags: [],
        content: 'test content',
        sig: 'test-sig'
      };
      expect(validateEvent(event)).toBe(true);
    });

    it('should reject event with missing required fields', () => {
      const event = {
        created_at: 1234567890,
        kind: 1,
        tags: [],
        content: 'test content',
        sig: 'test-sig'
      } as NostrEvent; // Missing pubkey and id
      expect(validateEvent(event)).toBe(false);
    });

    it('should reject event with future timestamp', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        created_at: Math.floor(Date.now() / 1000) + 900,
        kind: 1,
        tags: [],
        content: 'test content',
        sig: 'test-sig'
      };
      expect(validateEvent(event)).toBe(false);
    });

    it('should reject event with invalid tags structure', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        created_at: 1234567890,
        kind: 1,
        tags: [null] as unknown[], // Using unknown[] instead of any
        content: 'test content',
        sig: 'test-sig'
      };
      expect(validateEvent(event)).toBe(false);
    });
  });
});
