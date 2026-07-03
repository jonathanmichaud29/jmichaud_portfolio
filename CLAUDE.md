# CLAUDE.md

This is merely an example of what we should include in a project with JS/TS/Python/PHP in a monorepo.

We ignore this file for this current project.

## Project Structure

- `/api` — Laravel (PHP 8.3)
- `/frontend` — TypeScript (React/Vue)
- `/scripts` — Python 3.11

## Code Style — Non-Negotiable

### All Languages

- Line endings: LF only. Never CRLF.
- Encoding: UTF-8
- No trailing whitespace
- Newline at end of every file

### PHP (`/api`)

- Standard: PSR-12
- Formatter: PHP CS Fixer (`composer format`)
- Analysis: PHPStan level 6 (`composer analyse`)
- Quotes: single quotes for strings
- Array syntax: short (`[]` not `array()`)

### TypeScript/JavaScript (`/frontend`)

- Formatter: Prettier (`npm run format`)
- Linter: ESLint (`npm run lint`)
- Quotes: single quotes
- Semicolons: required
- Trailing commas: all

### Python (`/scripts`)

- Formatter + linter: Ruff (`ruff format . && ruff check .`)
- Python version: 3.11
- Quote style: double quotes

## Git Workflow

- Never commit directly to `main` or `develop`
- All changes via PR — CI must pass before merge
- Run formatters before staging: `composer format` / `npm run format` / `ruff format .`
- Pre-commit hooks handle this automatically if installed

## Before Generating Code

1. Match the formatting of surrounding code exactly
2. Run the language-appropriate formatter mentally before outputting
3. Never introduce `any` types in TypeScript without a comment explaining why
4. Never leave `console.log` or `var_dump` in committed code
