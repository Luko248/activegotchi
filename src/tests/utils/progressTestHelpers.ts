import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { vi } from 'vitest'

// Accessibility test helpers
export const getAccessibilityAttributes = (element: HTMLElement) => ({
  ariaLabel: element.getAttribute('aria-label'),
  ariaDescribedBy: element.getAttribute('aria-describedby'),
  ariaExpanded: element.getAttribute('aria-expanded'),
  role: element.getAttribute('role'),
  tabIndex: element.getAttribute('tabindex'),
})

// Theme test helper (simplified for testing)
export const createThemeWrapper = (theme: 'light' | 'dark' = 'light') => 
  ({ children }: { children: React.ReactNode }) => children

// Custom render function with theme support
export const renderWithTheme = (
  ui: ReactElement,
  theme: 'light' | 'dark' = 'light',
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
    wrapper: createThemeWrapper(theme),
    ...options,
  })
}