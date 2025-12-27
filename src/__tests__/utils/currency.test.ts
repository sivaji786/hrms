/**
 * Unit tests for currency utility functions
 */
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency';

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('formats basic currency with INR symbol', () => {
      const result = formatCurrency(1000);
      expect(result).toContain('₹');
      expect(result).toContain('1,000');
    });

    it('formats large numbers with commas', () => {
      const result = formatCurrency(1000000);
      expect(result).toContain('₹');
      expect(result).toContain(',');
    });

    it('formats decimal numbers correctly', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('₹');
    });

    it('handles zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('₹');
      expect(result).toContain('0');
    });

    it('handles negative amounts', () => {
      const result = formatCurrency(-500);
      expect(result).toContain('₹');
      expect(result).toContain('-');
    });

    it('accepts custom currency symbol', () => {
      const result = formatCurrency(1000, '$');
      expect(result).toContain('$');
    });
  });

  describe('formatCurrencyCompact', () => {
    it('formats thousands with K suffix', () => {
      const result = formatCurrencyCompact(5000);
      expect(result).toContain('5K');
    });

    it('formats lakhs with L suffix', () => {
      const result = formatCurrencyCompact(500000);
      expect(result).toContain('5L');
    });

    it('formats crores with Cr suffix', () => {
      const result = formatCurrencyCompact(10000000);
      expect(result).toContain('1Cr');
    });

    it('formats numbers less than thousand without suffix', () => {
      const result = formatCurrencyCompact(999);
      expect(result).not.toContain('K');
    });

    it('handles zero', () => {
      const result = formatCurrencyCompact(0);
      expect(result).toContain('0');
    });
  });
});
