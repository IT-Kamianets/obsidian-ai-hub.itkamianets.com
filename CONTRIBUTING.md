# Contributing Guidelines

## Discussions
Have a question or proposal? Join the conversation in [GitHub Discussions](../../discussions).

## When to Open an Issue
- **Minor changes** (typos, small notes, broken links): No issue needed. Open a Pull Request directly.
- **Major changes** (restructuring, new plugins, build tooling changes): Open an [Issue](../../issues) first to discuss the proposal before writing code.

## Pull Request Process
1. Fork the repository and create your branch from `dev`.
2. Format your commit messages using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: ...` (new features, plugin integrations)
   - `fix: ...` (bug fixes, broken wikilinks)
   - `docs: ...` (documentation updates, notes)
3. Ensure all checks and builds pass locally:
   ```bash
   npm run lint
   npm run build
