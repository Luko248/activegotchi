# Progress Map Testing Suite

This document outlines the comprehensive testing strategy for the ActiveGotchi progress map functionality.

## Overview

The testing suite provides >90% code coverage with comprehensive unit, integration, accessibility, and performance tests for the progress map feature.

## Test Structure

```
src/tests/
├── setup.ts                          # Test environment configuration
├── utils/
│   └── progressTestHelpers.ts        # Testing utilities and helpers
├── fixtures/
│   └── progressData.ts              # Test data fixtures
├── mocks/
│   ├── healthDataService.ts         # Service mocks
│   └── zustandStore.ts             # State management mocks
├── components/
│   ├── __tests__/
│   │   └── healthDataService.test.ts # Service unit tests
│   └── progress/
│       ├── ProgressMap.test.tsx     # ProgressMap component tests
│       └── WeekProgress.test.tsx    # WeekProgress component tests
├── integration/
│   └── progress/
│       └── ProgressMapIntegration.test.tsx # Integration tests
├── accessibility/
│   └── progress/
│       └── ProgressAccessibility.test.tsx  # A11y tests
└── performance/
    └── ProgressPerformance.test.tsx # Performance benchmarks
```

## Testing Framework

- **Framework**: Vitest + Testing Library
- **Coverage**: >90% line, branch, function coverage
- **Environment**: jsdom with React support
- **Accessibility**: jest-axe for WCAG 2.1 AA compliance
- **Performance**: Custom performance measurement utilities

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run once (CI mode)
npm run test:run

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Specific Test Suites

```bash
# Health service tests
npm run test:health

# Component tests only
npm run test:components

# Integration tests
npm run test:integration

# Accessibility tests
npm run test:accessibility

# Performance benchmarks
npm run test:performance
```

## Test Categories

### 1. Unit Tests

#### HealthDataService Tests
- Singleton pattern verification
- Permission request handling
- Data retrieval and manipulation
- Goal tracking calculations
- Error scenarios

#### Component Tests
- **ProgressMap**: Navigation, state management, user interactions
- **WeekProgress**: Data display, statistics calculation, user interactions

### 2. Integration Tests

- Data flow between services and components
- State management coordination
- localStorage persistence
- Theme integration
- Responsive behavior
- Error recovery

### 3. Accessibility Tests

- WCAG 2.1 AA compliance verification
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast validation
- Semantic structure

### 4. Performance Tests

- Rendering performance with various dataset sizes
- Memory usage optimization
- Animation performance (60fps target)
- User interaction responsiveness
- Bundle size impact

## Key Testing Utilities

### Test Helpers (`progressTestHelpers.ts`)

```typescript
// Mock services
createMockHealthDataService(options)
createMockStore(initialState)

// Test data generation
generateWeekProgressData(weekIndex, completedDays)
generateMultiWeekData(numberOfWeeks)

// Performance measurement
measureRenderTime(renderFunction)
mockAnimationFrame()

// Accessibility helpers
getAccessibilityAttributes(element)

// Responsive testing
mockViewport(width, height)
```

### Mock Data (`progressData.ts`)

- Complete week progress datasets
- Various completion scenarios
- Performance test datasets
- Error state scenarios

### Service Mocks

- Configurable health data service responses
- Async operation simulation
- Error scenario testing
- State management mocking

## Coverage Goals

- **Lines**: >90%
- **Branches**: >90%  
- **Functions**: >90%
- **Statements**: >90%

## Test Examples

### Component Testing Example

```typescript
it('should handle week navigation', async () => {
  const user = userEvent.setup()
  const onWeekChange = vi.fn()
  
  render(
    <ProgressMap 
      progressData={mockWeekProgressData.weeks}
      currentWeek={0}
      onWeekChange={onWeekChange}
    />
  )
  
  await user.click(screen.getByRole('button', { name: /next week/i }))
  expect(onWeekChange).toHaveBeenCalledWith(1)
})
```

### Accessibility Testing Example

```typescript
it('should have no accessibility violations', async () => {
  const { container } = render(<ProgressMap {...props} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Performance Testing Example

```typescript
it('should render large datasets efficiently', async () => {
  const largeDataset = generateMultiWeekData(52)
  
  const renderTime = await measureRenderTime(() => {
    render(<ProgressMap progressData={largeDataset} {...props} />)
  })
  
  expect(renderTime).toBeLessThan(1000)
})
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mock Strategy
- Mock external dependencies
- Use real implementations for internal logic
- Provide configurable mocks for different scenarios

### 3. Accessibility Testing
- Test with keyboard navigation
- Verify screen reader announcements
- Check color contrast and focus indicators
- Test with various assistive technologies

### 4. Performance Testing
- Set reasonable performance budgets
- Test with realistic data sizes
- Measure both rendering and interaction performance
- Monitor memory usage

### 5. Error Testing
- Test edge cases and error scenarios
- Verify graceful degradation
- Test recovery mechanisms

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Release preparation

Coverage reports are generated and tracked over time.

## Debugging Tests

### Common Issues

1. **Async/Await Problems**
   - Use `waitFor` for async operations
   - Advance timers with `vi.advanceTimersByTime()`

2. **Mock Issues**
   - Clear mocks between tests with `vi.clearAllMocks()`
   - Verify mock calls with proper matchers

3. **DOM Cleanup**
   - Testing Library handles cleanup automatically
   - Use `cleanup()` if manual cleanup needed

### Debug Commands

```bash
# Run specific test file
npx vitest src/tests/components/progress/ProgressMap.test.tsx

# Run with debug info
npx vitest --reporter=verbose

# Run specific test pattern
npx vitest --grep "accessibility"
```

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure >90% coverage for new code
3. Include accessibility tests
4. Add performance tests for UI components
5. Update this documentation

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)