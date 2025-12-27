/**
 * Unit tests for CurrencyContext
 */
import { renderHook, act } from '@testing-library/react';
import { CurrencyProvider, useCurrency } from '../../contexts/CurrencyContext';
import { ReactNode } from 'react';

describe('CurrencyContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CurrencyProvider>{children}</CurrencyProvider>
  );

  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default currency settings', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });

    expect(result.current.currency).toBeDefined();
    expect(result.current.currency.symbol).toBeTruthy();
    expect(result.current.currency.code).toBeTruthy();
  });

  it('formats currency correctly', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });

    const formatted = result.current.formatCurrency(1000);
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  it('formats large numbers correctly', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });

    const formatted = result.current.formatCurrency(1000000);
    expect(formatted).toBeTruthy();
    expect(formatted).toContain(result.current.currency.symbol);
  });

  it('formats decimal numbers correctly', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });

    const formatted = result.current.formatCurrency(1234.56);
    expect(formatted).toBeTruthy();
  });

  it('handles zero amount', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });

    const formatted = result.current.formatCurrency(0);
    expect(formatted).toBeTruthy();
  });

  it('handles negative amounts', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });

    const formatted = result.current.formatCurrency(-500);
    expect(formatted).toBeTruthy();
  });

  it('can update currency settings', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });

    act(() => {
      result.current.updateCurrency({
        symbol: '$',
        code: 'USD',
        name: 'US Dollar',
      });
    });

    expect(result.current.currency.symbol).toBe('$');
    expect(result.current.currency.code).toBe('USD');
  });

  it('persists currency settings to localStorage', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });

    act(() => {
      result.current.updateCurrency({
        symbol: '$',
        code: 'USD',
        name: 'US Dollar',
      });
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('throws error when useCurrency is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useCurrency());
    }).toThrow('useCurrency must be used within a CurrencyProvider');

    spy.mockRestore();
  });
});
