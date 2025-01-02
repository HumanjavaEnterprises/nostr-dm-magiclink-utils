# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
