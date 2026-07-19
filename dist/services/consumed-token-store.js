/**
 * @module services/consumed-token-store
 * @description Pluggable storage for consumed magic-link token identifiers (jti),
 * used to enforce single-use of magic-link tokens (replay protection).
 */
/**
 * Default in-memory {@link ConsumedTokenStore} backed by a `Map`.
 *
 * Suitable ONLY for single-instance deployments. See the warning on
 * {@link ConsumedTokenStore} for the multi-instance / serverless limitation.
 */
export class InMemoryConsumedTokenStore {
    /** Maps jti -> expiry timestamp (unix seconds). */
    consumed = new Map();
    has(jti) {
        return this.consumed.has(jti);
    }
    set(jti, expiry) {
        this.consumed.set(jti, expiry);
    }
    cleanup(now) {
        for (const [jti, expiry] of this.consumed) {
            if (expiry <= now) {
                this.consumed.delete(jti);
            }
        }
    }
}
//# sourceMappingURL=consumed-token-store.js.map