# Tests Specification

This is the tests coverage details for the spec detailed in @.agent-os/specs/2025-11-06-foundation-setup/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Test Coverage

### Unit Tests

**Supabase Client Utilities**

- Test that browser client can be created successfully with valid environment variables
- Test that server client can be created successfully with valid environment variables
- Test that client creation throws helpful error when environment variables are missing
- Test that client creation throws helpful error when environment variables are invalid

**Utility Functions**

- Test any utility functions created in `lib/utils.ts`
- Verify proper TypeScript type inference

### Integration Tests

**Environment Configuration**

- Verify that NEXT_PUBLIC_SUPABASE_URL is accessible in browser
- Verify that NEXT_PUBLIC_SUPABASE_ANON_KEY is accessible in browser
- Verify that SUPABASE_SERVICE_ROLE_KEY is NOT accessible in browser (server-only)
- Test that Next.js properly loads environment variables from .env.local

**Supabase Client Integration**

- Test that browser client can make a simple request to Supabase (e.g., ping health endpoint)
- Test that server client can make a simple authenticated request
- Verify that client maintains proper session state

### Feature Tests

**Development Environment Setup**

- E2E test that application starts successfully with `npm run dev`
- Verify that home page renders without errors
- Verify that Tailwind CSS is applied correctly
- Verify that DaisyUI components render with proper styling

**Code Quality Enforcement**

- Test that pre-commit hook runs when committing
- Test that pre-commit hook rejects commits with linting errors
- Test that pre-commit hook rejects commits with TypeScript errors
- Verify that Prettier formats code correctly

### Mocking Requirements

**Supabase Responses**

- Mock Supabase responses using MSW (Mock Service Worker) for client tests
- Create mock handlers for common Supabase operations (auth, database queries)
- Set up test environment that doesn't require actual Supabase connection

**Environment Variables**

- Mock environment variables in test environment
- Create test fixtures for valid/invalid environment configurations

## Test Implementation Notes

### Testing Framework Setup

Since this is the foundational setup spec, we will establish the testing infrastructure as part of this work:

1. Install Jest with React Testing Library for unit/integration tests
2. Install Playwright for E2E tests
3. Configure test environment with proper TypeScript support
4. Set up MSW for API mocking
5. Create test utilities for common testing patterns

### Test File Organization

```
__tests__/
├── unit/
│   ├── lib/
│   │   ├── supabase-client.test.ts
│   │   └── supabase-server.test.ts
│   └── utils.test.ts
├── integration/
│   └── supabase-integration.test.ts
└── e2e/
    └── app-startup.spec.ts
```

### Coverage Goals

- **Supabase client utilities:** 100% coverage (critical infrastructure)
- **Environment configuration:** 100% coverage (must work correctly)
- **Utility functions:** 80%+ coverage
- **Overall project:** Establish baseline for 80%+ coverage target

## Test Execution

### Running Tests

- `npm test` - Run all unit and integration tests
- `npm test:e2e` - Run Playwright E2E tests
- `npm test:coverage` - Generate coverage report
- `npm test:watch` - Run tests in watch mode during development

### CI/CD Integration

- All tests must pass before allowing PR merge
- Coverage reports automatically generated and tracked
- E2E tests run on preview deployments

## Manual Testing Checklist

Since some aspects of the foundational setup are difficult to automate, manual verification is required:

- [ ] Clone fresh repository and follow README setup instructions
- [ ] Verify all dependencies install without errors or warnings
- [ ] Start development server and verify no console errors
- [ ] Verify Supabase client connects successfully to development project
- [ ] Test that DaisyUI components render correctly with custom theme
- [ ] Verify Prettier formats code on save in IDE
- [ ] Make a commit with linting errors and verify pre-commit hook blocks it
- [ ] Verify TypeScript strict mode catches type errors
- [ ] Test hot reload works correctly during development
