# Contributing to Nexus Core

Thank you for your interest in contributing to Nexus Core! We appreciate your time and effort in helping us improve this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone git@github.com:your-username/nexus-core.git
   cd nexus-core
   ```
3. **Set up the upstream remote**:
   ```bash
   git remote add upstream git@github.com:nexus-org/nexus-core.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```
6. **Start the development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

1. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. **Make your changes** following the code style guidelines.

3. **Run tests** to ensure nothing is broken:
   ```bash
   npm test
   ```

4. **Lint your code**:
   ```bash
   npm run lint
   ```

5. **Format your code**:
   ```bash
   npm run format
   ```

6. **Commit your changes** following the commit guidelines.

7. **Push your changes** to your fork:
   ```bash
   git push origin your-branch-name
   ```

8. **Open a Pull Request** from your fork to the main repository.

## Code Style

We use the following tools to maintain code quality and consistency:

- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for code formatting
- **TypeScript** for type checking

### Linting

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Formatting

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### Type Checking

```bash
# Run type checker
npm run type-check

# Run type checker in watch mode
npm run type-check:watch
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages. This allows us to automatically generate changelogs and determine semantic version bumps.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Examples

```
feat(auth): add password reset functionality

Add the ability for users to reset their password via email. This includes:
- New password reset form
- Email template
- API endpoints for password reset flow

Closes #123
```

```
fix(api): prevent race condition in user creation

Add a unique constraint to the email field in the users table to prevent duplicate users.

Fixes #456
```

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, including new environment variables, exposed ports, useful file locations, and container parameters.
3. Increase the version numbers in any example files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Reporting Issues

When reporting issues, please include the following information:

1. **Description**: A clear and concise description of the issue.
2. **Steps to Reproduce**: Step-by-step instructions to reproduce the issue.
3. **Expected Behavior**: What you expected to happen.
4. **Actual Behavior**: What actually happened.
5. **Screenshots/Logs**: If applicable, add screenshots or logs to help explain your problem.
6. **Environment**:
   - OS: [e.g., Windows 10, macOS 11.2, Ubuntu 20.04]
   - Browser: [e.g., Chrome 89, Firefox 86, Safari 14]
   - Node.js version: [e.g., 14.16.0]
   - npm/yarn version: [e.g., 7.6.0]

## License

By contributing, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE) file.
