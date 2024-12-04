import '@jest/globals';

declare global {
  const describe: typeof import('@jest/globals').describe;
  const expect: typeof import('@jest/globals').expect;
  const it: typeof import('@jest/globals').it;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterEach: typeof import('@jest/globals').afterEach;
  const jest: typeof import('@jest/globals').jest;
}
