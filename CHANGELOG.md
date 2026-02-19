# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
