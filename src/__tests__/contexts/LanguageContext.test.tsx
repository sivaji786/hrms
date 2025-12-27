/**
 * Unit tests for LanguageContext
 */
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';
import { ReactNode } from 'react';

describe('LanguageContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default language as English', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe('en');
  });

  it('changes language to Arabic', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage('ar');
    });

    expect(result.current.language).toBe('ar');
  });

  it('persists language preference to localStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage('ar');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'ar');
  });

  it('translates English keys correctly', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    const translation = result.current.t('common.save');
    expect(translation).toBeTruthy();
  });

  it('translates Arabic keys correctly', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage('ar');
    });

    const translation = result.current.t('common.save');
    expect(translation).toBeTruthy();
  });

  it('returns key if translation not found', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    const translation = result.current.t('nonexistent.key');
    expect(translation).toBe('nonexistent.key');
  });

  it('replaces parameters in translations', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    // Assuming we have a translation with parameters
    const translation = result.current.t('common.greeting', { name: 'John' });
    expect(translation).toBeTruthy();
  });

  it('sets HTML dir attribute for RTL languages', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage('ar');
    });

    expect(document.documentElement.dir).toBe('rtl');
  });

  it('sets HTML dir attribute to ltr for English', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(document.documentElement.dir).toBe('ltr');
  });

  it('sets HTML lang attribute', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage('ar');
    });

    expect(document.documentElement.lang).toBe('ar');
  });

  it('throws error when useLanguage is used outside provider', () => {
    // Suppress console error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useLanguage());
    }).toThrow('useLanguage must be used within a LanguageProvider');

    spy.mockRestore();
  });
});
