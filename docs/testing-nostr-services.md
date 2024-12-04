# Testing Nostr Services

This guide documents our experience and best practices for testing Nostr services using Jest and TypeScript.

## Table of Contents
- [Overview](#overview)
- [Key Components](#key-components)
- [Common Challenges and Solutions](#common-challenges-and-solutions)
- [Best Practices](#best-practices)
- [Code Examples](#code-examples)

## Overview

Testing Nostr services requires careful consideration of:
1. Mocking the Nostr protocol's low-level operations
2. Handling cryptographic operations
3. Managing relay connections
4. Dealing with asynchronous events
5. Type safety with TypeScript

## Key Components

### SimplePool
The `SimplePool` class from `nostr-tools` is central to Nostr operations. When testing, we need to mock:
- Relay connections (`ensureRelay`)
- Event publishing (`publish`)
- Event querying (`list`)
- Subscription management (`sub`)

### Cryptographic Operations
Several cryptographic operations need mocking:
- `nip04.encrypt` and `nip04.decrypt` for DM encryption
- `getPublicKey` for key derivation
- `getEventHash` and `signEvent` for event signing

## Common Challenges and Solutions

### 1. TypeScript Generic Types
When mocking `SimplePool` methods, we encountered issues with generic type parameters. Here's how we solved them:

```typescript
// WRONG:
simplePool.list.mockImplementation(async () => [mockEvent]);

// RIGHT:
simplePool.list.mockImplementation(async <K extends number = number>() => 
  Promise.resolve([mockEvent] as Event<K>[])
);
```

### 2. Promise Return Types
The `publish` method expects `Promise<void>[]`. Common mistakes and solutions:

```typescript
// WRONG:
simplePool.publish.mockImplementation(async () => Promise.resolve(['ok']));
// WRONG:
simplePool.publish.mockImplementation(async () => [Promise.resolve()]);
// RIGHT:
simplePool.publish.mockImplementation(() => [Promise.resolve()]);
```

### 3. Mock Implementation Structure
For proper testing, create a complete mock structure:

```typescript
jest.mock('nostr-tools', () => ({
    SimplePool: jest.fn().mockImplementation(() => ({
        ensureRelay: jest.fn(),
        publish: jest.fn(),
        list: jest.fn(),
        sub: jest.fn(),
        close: jest.fn()
    })),
    generatePrivateKey: jest.fn(),
    getPublicKey: jest.fn(),
    nip04: {
        encrypt: jest.fn(),
        decrypt: jest.fn()
    }
}));
```

## Best Practices

1. **Type Safety**
   - Use `jest.Mocked<T>` for proper typing of mocked objects
   - Explicitly type mock return values
   - Handle generic type parameters correctly

2. **Mock Reset**
   - Clear mocks before each test using `jest.clearAllMocks()`
   - Set up fresh mock implementations in `beforeEach`

3. **Error Handling**
   - Test both success and failure scenarios
   - Mock encryption/decryption failures
   - Test relay connection failures

4. **Event Structure**
   - Create realistic mock events that match Nostr event structure
   - Include all required fields (kind, created_at, tags, content, etc.)

## Code Examples

### Setting Up Mock Events
```typescript
const mockEvent: Event = {
    kind: 4,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: 'test-content',
    pubkey: 'test-pubkey',
    id: 'test-id',
    sig: 'test-sig'
};
```

### Testing DM Functionality
```typescript
it('should send DM successfully', async () => {
    const recipientPubkey = 'recipient-pubkey';
    const message = 'Test message';

    await nostrService.sendDM(recipientPubkey, message);

    expect(nip04.encrypt).toHaveBeenCalledWith(
        privateKey,
        recipientPubkey,
        message
    );
    expect(simplePool.publish).toHaveBeenCalled();
});
```

### Testing Error Scenarios
```typescript
it('should handle encryption errors', async () => {
    jest.spyOn(nip04, 'encrypt')
        .mockRejectedValueOnce(new Error('Encryption failed'));

    await expect(nostrService.sendDM('pubkey', 'message'))
        .rejects.toThrow('Encryption failed');
});
```

## Additional Resources

- [nostr-tools Documentation](https://github.com/nbd-wtf/nostr-tools)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Testing Documentation](https://www.typescriptlang.org/docs/handbook/testing.html)
