# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-07-18

Correctness release. A coherence audit confirmed the library's core send path
was broken out of the box: every default `sendMagicLink` call threw, and the
only working encryption mode published events under a kind no client recognises
as a DM. This release fixes all eight confirmed bugs. **It is a breaking release**
because both the emitted event kind and the required `nostr-crypto-utils` API
have changed.

### Breaking Changes
- **Canonical NIP-04 crypto API.** The package now depends on
  `nostr-crypto-utils` ^0.8.0 and calls `encryptMessage(message, senderPrivkey,
  recipientPubkey)` / `decryptMessage(ciphertext, recipientPrivkey, senderPubkey)`.
  The previous swapped-order `encrypt` / `decrypt` exports were removed upstream.
- **Direct messages are always emitted as kind 4** (standard NIP-04 encrypted
  DM). Previously the NIP-44 encryption mode emitted the non-standard **kind 44**,
  which no relay or client treats as a DM, so recipients never saw the message.
  The `encryptionMode: 'nip44'` option still selects NIP-44 payload encryption but
  the event kind is now 4 in all cases.

### Fixed
- **NIP-04 encrypt path threw on every default send (release blocker).** All three
  encrypt call sites (`src/services/nostr.service.ts`, `src/nips/nip04.ts`,
  `src/protocol/nips/nip04.ts`) now use the canonical `encryptMessage` signature,
  so the out-of-the-box `sendMagicLink` flow works. The NIP-04 decrypt wrapper
  argument order was corrected to `decryptMessage(ciphertext, recipientPrivkey,
  senderPubkey)`.
- **Non-standard kind 44 DMs (release blocker).** Events are now kind 4 so relays
  and clients recognise them as direct messages.
- **Content corruption in `protocol/nips/nip01.ts createEvent`.** A random nonce
  was appended to the event content before signing (`content:nonce`), which
  mangled NIP-04 ciphertext and broke recipient decryption. The content is now
  signed unchanged; NIP-01 uniqueness already derives from `created_at` + pubkey
  + the event id hash.
- **Template placeholders replaced only once.** `formatMessage` now uses
  `replaceAll`, so a placeholder used more than once (e.g. `{{link}}` as visible
  text and again inside markup) is fully substituted.
- **Relay socket leak in `connectToRelay`.** A failed `connect()` now tears down
  the partially-opened websocket, and a dedup guard prevents overwriting (and
  orphaning) an already-connected client.
- **Unvalidated recipient pubkey.** `sendDirectMessage` and `sendMagicLink` now
  reject a recipient public key that is not a 64-character hex string before any
  crypto/event work, instead of failing with an opaque low-level error.
- **`validateEvent` rejected valid events.** It used truthiness checks that
  wrongly rejected `content: ''` (contact lists, reactions, deletes) and
  `created_at: 0`. It now uses `typeof` / presence checks.

### Added
- **Pluggable replay-protection store.** The consumed-token (jti) store is now an
  injectable `ConsumedTokenStore` interface (4th constructor arg of
  `MagicLinkManager`), defaulting to the in-memory `InMemoryConsumedTokenStore`.
  The in-memory default is single-instance only; inject a shared/persistent
  implementation (e.g. Redis/DB keyed on jti + exp) for multi-instance or
  serverless deployments. See the README "Replay protection" section.
- Real end-to-end integration tests exercising actual NIP-04 crypto (encrypt →
  publish → decrypt round-trip, kind-4 assertion, recipient-pubkey validation)
  that would have caught the shipped bugs.

### Future
- **NIP-17 (modern private DMs).** The correct long-term path for the NIP-44
  encryption mode is NIP-17: a kind 14 rumor sealed (kind 13) and gift-wrapped
  (kind 1059, NIP-59). Kind 4 is the correct minimum for interoperability today;
  NIP-17 support is planned as a follow-up enhancement.
- **Persistent replay store implementations** (Redis/DB) shipped in-box are a
  planned follow-up; the store is already injectable today.

## [0.3.2] - 2026-07-16

### Fixed
- CJS consumers could not `require()` the package. The `dist/cjs` build used `module: NodeNext`, which under the root `"type": "module"` emitted ESM (`import`) into `dist/cjs` — and there was no `dist/cjs/package.json` shim. `tsconfig.cjs.json` now uses `module: CommonJS` / `moduleResolution: Node`, and `build` writes `dist/cjs/package.json` `{"type":"commonjs"}`, so the `require` export condition works.
- `utils/logger.ts` now uses a plain `import pino from 'pino'` instead of the ESM-only `createRequire(import.meta.url)` idiom, so the source compiles cleanly for both the ESM and CommonJS targets.

## [0.3.0] - 2026-03-06

### Changed
- **Noble 2.0 migration:** `@noble/curves` ^2.0.1, `@noble/hashes` ^2.0.1
- **Pino 10:** Upgraded logger from pino 8.x
- **Vitest 4:** Upgraded test framework
- **nostr-crypto-utils** and **nostr-websocket-utils** dependencies upgraded to published ^0.6.0 versions
- Dropped Node.js 16 support

### Added
- NIP-44 encryption support via nostr-crypto-utils v0.5.1

### Fixed
- Removed magic link URL from API response — uses crypto nonces instead
- Enforced key validation in all environments; implemented message verification
- Redesigned magic link token architecture for security
- Updated tests for key validation error messages
- Resolved npm audit vulnerabilities (ajv, minimatch, rollup)

### Security
- Eliminated elliptic HIGH vulnerability by updating nostr-crypto-utils

## [0.2.1] - 2025-02-19

### Changed
- Updated dependencies to latest within major versions
- Replaced nip19 with @scure/base for bech32 encoding/decoding
- Fixed ESLint config to ignore scripts directory

### Fixed
- Fixed import paths and module resolution issues
- Updated jsonwebtoken to latest version to fix security vulnerability

## [0.2.0] - 2025-01-23

### Breaking Changes
- Renamed `MagicLinkService` to `MagicLinkManager` for consistency with consumer usage
- All instances of `MagicLinkService` in types and documentation have been updated to `MagicLinkManager`

### Dependencies
- Updated `nostr-crypto-utils` from ^0.4.10 to ^0.4.13
  - Includes enhanced logging system
  - Improved error handling and stack traces
  - Better TypeScript type exports

### Migration Guide
If you were using `MagicLinkService` directly, you'll need to update your imports and type references to use `MagicLinkManager` instead. If you were using the `createMagicLinkService` factory function, no changes are required as it will now return the correctly named type.

Note: This package is still in MVP phase, hence the 0.x.x versioning. While we maintain backward compatibility within minor versions, the API may undergo significant changes before reaching 1.0.0.

## [0.1.4] - 2025-01-02

### Changed
- Updated dependencies to use published versions:
  - nostr-crypto-utils: ^0.4.10
  - nostr-websocket-utils: ^0.3.10
- Removed local file references for better package distribution

## [0.1.0] - 2024-12-28

### Added
- Initial release of the Nostr DM Magic Link Middleware
- Core magic link functionality for secure authentication
- Support for multiple languages (en, es, fr, ar, ja, pt, zh, ko, ru)
- RTL language support with proper text direction handling
- Optional context information in magic link messages
- Text validation and URL sanitization
- Fastify and Express middleware support
- Comprehensive TypeScript type definitions
- Localization service with message templating
- Security best practices implementation

### Security
- Input validation for all user-provided content
- URL sanitization for magic links
- Text content validation to prevent injection
- Proper handling of RTL/LTR text markers
