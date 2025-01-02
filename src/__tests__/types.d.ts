import 'vitest/globals';

declare global {
  const describe: typeof import('vitest').describe;
  const expect: typeof import('vitest').expect;
  const it: typeof import('vitest').it;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterEach: typeof import('vitest').afterEach;
  const test: typeof import('vitest').test;
}

declare module 'vitest' {
  interface TestContext {
    mockWebSocket: {
      onopen: () => void;
      onerror: (error: Error) => void;
      close: () => void;
      send: (data: string) => void;
    };
  }
}

export interface MockLogger {
  info: (message: string | object, ...args: unknown[]) => void;
  error: (message: string | object, ...args: unknown[]) => void;
  warn: (message: string | object, ...args: unknown[]) => void;
  debug: (message: string | object, ...args: unknown[]) => void;
}
