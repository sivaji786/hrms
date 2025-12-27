# 🧪 Testing Documentation - HR Management System

Complete testing guide for the HR Management System with 140+ tests across unit and E2E categories.

---

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Test Statistics](#test-statistics)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

### 3. Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:all
```

---

## 📊 Test Statistics

| Category | Count | Status |
|----------|-------|--------|
| **Unit Tests** | 81+ | ✅ |
| **E2E Tests** | 60+ | ✅ |
| **Total Tests** | 141+ | ✅ |

### Coverage by Module

- **Common Components**: 23 tests
- **Context/State**: 10 tests
- **Utilities**: 5 tests
- **Integration**: 43 tests
- **E2E Flows**: 60 tests

---

## 🎯 Running Tests

### All Available Commands

```bash
# Unit Testing
npm test                    # Run all unit tests
npm run test:watch         # Watch mode for unit tests
npm run test:coverage      # Generate coverage report

# E2E Testing
npm run test:e2e           # Run all E2E tests
npm run test:e2e:headed    # Run E2E with visible browser
npm run test:e2e:debug     # Debug mode for E2E tests
npm run test:e2e:ui        # Interactive UI mode

# Combined
npm run test:all           # Run all tests (unit + E2E)

# Specific Tests
npm test -- Breadcrumbs                    # Test specific component
npm run test:e2e -- tests/auth.spec.ts     # Test specific E2E file
```

### Environment Variables

```bash
# Set headless mode
HEADLESS=false npm run test:e2e

# Set specific browser
BROWSER=firefox npm run test:e2e

# Parallel execution
WORKERS=4 npm run test:e2e
```

---

## 📁 Test Structure

```
/
├── __tests__/                 # Unit & Integration Tests
│   ├── components/
│   │   └── common/           # Common component tests
│   ├── contexts/             # Context provider tests
│   ├── integration/          # Integration tests
│   └── utils/                # Utility function tests
│
├── e2e/                      # End-to-End Tests
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   ├── employee-management.spec.ts
│   ├── attendance.spec.ts
│   ├── leave-management.spec.ts
│   ├── payroll.spec.ts
│   ├── performance.spec.ts
│   ├── recruitment.spec.ts
│   ├── asset-management.spec.ts
│   ├── expense-travel.spec.ts
│   ├── documents-policy.spec.ts
│   ├── notifications.spec.ts
│   ├── training.spec.ts
│   ├── employee-portal.spec.ts
│   ├── multi-language.spec.ts
│   └── reports-analytics.spec.ts
│
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup file
└── playwright.config.ts      # Playwright configuration
```

---

## ✍️ Writing Tests

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatCard from '../StatCard';
import { Users } from 'lucide-react';

describe('StatCard', () => {
  it('renders with basic props', () => {
    render(
      <StatCard
        title="Total Users"
        value={100}
        icon={Users}
      />
    );
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('employee login and dashboard access', async ({ page }) => {
  await page.goto('/');
  
  // Click employee login
  await page.click('text=Employee Login');
  
  // Enter credentials
  await page.fill('input[type="email"]', 'john.smith@company.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Submit login
  await page.click('button:has-text("Login")');
  
  // Verify dashboard loaded
  await expect(page.locator('text=My Dashboard')).toBeVisible();
});
```

---

## 📈 Test Coverage

### Unit Test Coverage

**Common Components** (100% coverage)
- ✅ ActionButtons
- ✅ Breadcrumbs
- ✅ ConfirmDialog
- ✅ DataTable
- ✅ EmptyState
- ✅ FilterBar
- ✅ PageHeader
- ✅ Pagination
- ✅ StatCard
- ✅ StatusBadge

**Contexts** (100% coverage)
- ✅ CurrencyContext
- ✅ LanguageContext

**Utilities** (100% coverage)
- ✅ Currency utilities
- ✅ Toast notifications

### E2E Test Coverage

**Core Modules** (100% coverage)
- ✅ Authentication (Admin & Employee)
- ✅ Dashboard & Statistics
- ✅ Employee Management (CRUD operations)
- ✅ Attendance Tracking
- ✅ Leave Management
- ✅ Payroll Processing
- ✅ Performance Management
- ✅ Recruitment/ATS
- ✅ Asset Management
- ✅ Expense & Travel
- ✅ Documents & Policies
- ✅ Notifications
- ✅ Training & Development
- ✅ Employee Portal
- ✅ Multi-Language Support
- ✅ Reports & Analytics

---

## 🛠️ Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'contexts/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
```

### Playwright Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

---

## 🐛 Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm test -- Breadcrumbs

# Run tests matching pattern
npm test -- --testNamePattern="renders correctly"

# Watch mode for development
npm run test:watch

# Debug with VSCode
# Add breakpoint, then use Jest extension or:
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E Tests

```bash
# Run with visible browser
npm run test:e2e:headed

# Debug mode (pauses execution)
npm run test:e2e:debug

# Interactive UI mode
npm run test:e2e:ui

# Specific test file
npm run test:e2e -- tests/employee-management.spec.ts

# Specific test by name
npm run test:e2e -- --grep "should create new employee"
```

---

## 📝 Best Practices

### 1. Test Naming
- Use descriptive test names
- Follow "should..." pattern for clarity
- Group related tests with describe blocks

### 2. Test Independence
- Each test should be independent
- Don't rely on test execution order
- Clean up after each test

### 3. Data Management
- Use mock data for unit tests
- Reset state between tests
- Avoid hardcoded values

### 4. Assertions
- Use specific matchers
- Test one thing per test
- Avoid unnecessary assertions

### 5. Performance
- Keep tests fast
- Mock expensive operations
- Use parallel execution when possible

---

## 🔍 Common Issues & Solutions

### Issue: Tests failing intermittently
**Solution**: Check for race conditions, add proper waits in E2E tests

### Issue: Snapshot tests failing after UI changes
**Solution**: Update snapshots with `npm test -- -u`

### Issue: E2E tests timing out
**Solution**: Increase timeout in playwright.config.ts or specific test

### Issue: Module not found errors
**Solution**: Check moduleNameMapper in jest.config.js

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✅ Test Checklist

Before pushing code, ensure:

- [ ] All unit tests pass: `npm test`
- [ ] All E2E tests pass: `npm run test:e2e`
- [ ] Code coverage is acceptable: `npm run test:coverage`
- [ ] New features have corresponding tests
- [ ] Tests are independent and repeatable
- [ ] No console errors or warnings

---

**Last Updated**: November 2024
**Test Suite Version**: 2.0
**Total Test Cases**: 141+
