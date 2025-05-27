# Testing Infrastructure Documentation

## Overview

This document outlines the testing infrastructure and practices used in the project.

## Test Types

### 1. Unit Tests
- Located in `__tests__` directories next to source files
- Uses Jest and React Testing Library
- Coverage threshold: 80% for branches, functions, lines, and statements
- Run with `npm test`

### 2. Integration Tests
- Located in `app/api/__tests__`
- Tests API endpoints and service interactions
- Uses MSW for API mocking
- Run with `npm test`

### 3. End-to-End Tests
- Located in `e2e` directory
- Uses Playwright
- Tests user flows across multiple browsers and devices
- Run with `npm run test:e2e`

### 4. Performance Tests
- Located in `performance` directory
- Uses k6 for load testing
- Includes custom metrics and reporting
- Run with `npm run test:perf`

### 5. Security Tests
- Automated security scanning with Snyk
- OWASP ZAP baseline scanning
- Run as part of CI/CD pipeline

## Test Setup

### Jest Configuration
- Custom matchers and mocks in `jest.setup.ts`
- Environment setup for Next.js
- Global mocks for:
  - Fetch API
  - WebSocket
  - Window methods
  - Stripe
  - Logger

### Playwright Configuration
- Configured for multiple browsers and devices
- Screenshot and trace capture on failure
- Custom test reporters

## Best Practices

1. **Test Organization**
   - Keep test files close to source files
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

2. **Mocking**
   - Use MSW for API mocking
   - Mock external services and dependencies
   - Keep mocks simple and focused

3. **Coverage**
   - Maintain minimum 80% coverage
   - Focus on critical paths
   - Include edge cases and error scenarios

4. **Performance Testing**
   - Define performance budgets
   - Monitor key metrics
   - Regular baseline testing

5. **Security Testing**
   - Regular dependency scanning
   - API security testing
   - Authentication and authorization testing

## Running Tests

```bash
# Run unit and integration tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run end-to-end tests
npm run test:e2e

# Run performance tests
npm run test:perf

# Generate coverage report
npm test -- --coverage
```

## CI/CD Integration

Tests are automatically run in GitHub Actions:
1. Unit and integration tests
2. End-to-end tests
3. Performance tests
4. Security scans
5. Coverage reporting to Codecov

## Debugging Tests

1. Use `test.only()` or `describe.only()` to run specific tests
2. Enable debug logging with `DEBUG=pw:api` for Playwright
3. Use `console.log()` with `--verbose` flag
4. Check test artifacts in CI (screenshots, traces)

## Adding New Tests

1. Create test file in appropriate directory
2. Import necessary test utilities
3. Mock external dependencies
4. Write test cases following AAA pattern
5. Verify coverage
6. Run full test suite locally before pushing 