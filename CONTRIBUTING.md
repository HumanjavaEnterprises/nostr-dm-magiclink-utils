# Contributing to Nostr DM Magic Link Middleware

First off, thank you for considering contributing to our Nostr ecosystem! This is an open-source project, and we love to receive contributions from our community.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include any error messages or logs

### Suggesting Enhancements

If you have a suggestion for a new feature or enhancement:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the TypeScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. Fork the repo and create your branch from `main`
2. Run `npm install` to install dependencies
3. Make your changes
4. Add tests for any new functionality
5. Run `npm test` to ensure nothing is broken
6. Update documentation if needed
7. Submit your pull request

### Testing

We use Jest for testing. Please ensure all tests pass before submitting a PR:

```bash
npm test
```

For more information about testing, see our [Testing Guide](docs/testing-nostr-services.md).

### TypeScript

This project is written in TypeScript. Please ensure your code:

* Has proper type definitions
* Doesn't use `any` unless absolutely necessary
* Follows our existing patterns for generics and type safety

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

## Related Projects

This middleware is part of a larger Nostr ecosystem. Consider contributing to our related projects:

* [nostr-auth-middleware](https://github.com/HumanjavaEnterprises/nostr-auth-middleware)
* [nostr-relay-nestjs](https://github.com/HumanjavaEnterprises/nostr-relay-nestjs)
* [ipfs-nostr-file-store](https://github.com/HumanjavaEnterprises/ipfs-nostr-file-store)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
