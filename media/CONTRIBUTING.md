# Contributing to nostr-dm-magiclink-utils

First off, thank you for considering contributing to nostr-dm-magiclink-utils! It's people like you that make this package a great tool for the Nostr community.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following our commit message convention
4. Push to your branch
5. Open a Pull Request

### Commit Message Convention

We follow semantic commit messages:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc)
- `refactor:` - Code changes that neither fix bugs nor add features
- `perf:` - Performance improvements
- `test:` - Test-related changes
- `chore:` - Changes to build process or auxiliary tools

Example: `feat: add support for custom relay prioritization`

### Development Setup

1. Clone your fork
2. Install dependencies:
```bash
npm install
```
3. Run tests:
```bash
npm test
```

### Type Safety

- All code must be written in TypeScript
- Maintain 100% type safety
- No use of `any` without explicit justification
- Document complex types

### Testing Requirements

1. Unit tests for all new functionality
2. Integration tests for relay interactions
3. Test coverage must not decrease
4. Tests must pass in CI before merge

### Code Style

We use ESLint and Prettier. Before submitting:
```bash
npm run lint
npm run format
```

### Documentation

For any changes, update:
1. TSDoc comments for public APIs
2. README.md if adding features
3. Example code if relevant
4. CHANGELOG.md following semver

### Security

- Review [SECURITY.md](SECURITY.md) before contributing
- Never commit sensitive keys or credentials
- Report security issues privately
- Always sanitize user input
- Follow secure coding practices

### Internationalization

When adding or modifying messages:
1. Update all language templates
2. Maintain RTL support
3. Follow i18n best practices
4. Test with various locales

## Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure CI passes
4. Get review from maintainers
5. Squash commits before merge

### PR Title Format

Follow the commit message convention, but with more detail:
```
feat(relay): add support for custom relay prioritization

- Add RelayPriority interface
- Implement priority queue for relay connections
- Update documentation with examples
```

## Release Process

1. Update CHANGELOG.md
2. Update version in package.json
3. Create GitHub release
4. Publish to npm

## Getting Help

- Open an issue for bugs
- Discussions for questions
- Security issues: see [SECURITY.md](SECURITY.md)

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing!
