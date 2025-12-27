/**
 * Test utilities for React Testing Library
 * Provides custom render function with all necessary providers
 */
import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { CurrencyProvider } from '../../contexts/CurrencyContext';

interface AllProvidersProps {
  children: ReactNode;
}

const AllProviders = ({ children }: AllProvidersProps) => {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </LanguageProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
