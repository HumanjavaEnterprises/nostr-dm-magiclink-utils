/**
 * @module services/consumed-token-store
 * @description Pluggable storage for consumed magic-link token identifiers (jti),
 * used to enforce single-use of magic-link tokens (replay protection).
 */

/**
 * Storage backend for consumed token identifiers (jti).
 *
 * Implementations track which token JTIs have already been redeemed so a token
 * cannot be replayed. All methods may be synchronous or asynchronous.
 *
 * ⚠️ SECURITY / SCALING NOTE:
 * The default {@link InMemoryConsumedTokenStore} keeps state in a per-process
 * `Map`. Replay protection therefore does NOT survive a process restart and is
 * NOT shared across horizontally-scaled instances or serverless invocations — a
 * token replayed against a fresh or different instance will be accepted again
 * until its JWT `exp` (15 minutes) elapses. For multi-instance or serverless
 * deployments, inject a shared/persistent implementation (e.g. backed by Redis
 * or a database keyed on `jti` with the token's `exp` as TTL). See the README
 * "Replay protection" section.
 */
export interface ConsumedTokenStore {
  /**
   * Returns whether the given jti has already been consumed.
   * @param jti - The token's unique identifier
   */
  has(jti: string): Promise<boolean> | boolean;

  /**
   * Marks a jti as consumed.
   * @param jti - The token's unique identifier
   * @param expiry - The token's expiry time (unix seconds), for TTL/cleanup
   */
  set(jti: string, expiry: number): Promise<void> | void;

  /**
   * Optional: remove entries that have expired at or before `now`.
   * Called opportunistically before verification to bound memory growth.
   * Persistent stores backed by native TTL can omit this.
   * @param now - Current time in unix seconds
   */
  cleanup?(now: number): Promise<void> | void;
}

/**
 * Default in-memory {@link ConsumedTokenStore} backed by a `Map`.
 *
 * Suitable ONLY for single-instance deployments. See the warning on
 * {@link ConsumedTokenStore} for the multi-instance / serverless limitation.
 */
export class InMemoryConsumedTokenStore implements ConsumedTokenStore {
  /** Maps jti -> expiry timestamp (unix seconds). */
  private readonly consumed: Map<string, number> = new Map();

  has(jti: string): boolean {
    return this.consumed.has(jti);
  }

  set(jti: string, expiry: number): void {
    this.consumed.set(jti, expiry);
  }

  cleanup(now: number): void {
    for (const [jti, expiry] of this.consumed) {
      if (expiry <= now) {
        this.consumed.delete(jti);
      }
    }
  }
}
