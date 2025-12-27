import { CurrencyCode, Currency } from '../contexts/CurrencyContext';

/**
 * Format a number with Indian numbering system (Lakhs and Crores)
 */
export function formatIndianNumber(num: number, decimals: number = 0): string {
  const parts = num.toFixed(decimals).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';
  
  // Indian numbering system: last 3 digits, then groups of 2
  const lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree + decimalPart;
  } else {
    return lastThree + decimalPart;
  }
}

/**
 * Format a number with standard international numbering (groups of 3)
 */
export function formatInternationalNumber(num: number, decimals: number = 0): string {
  const parts = num.toFixed(decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = parts[1] ? `.${parts[1]}` : '';
  return `${integerPart}${decimalPart}`;
}

/**
 * Format currency based on the currency configuration
 */
export function formatCurrencyValue(
  amount: number,
  currency: Currency,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
    compact?: boolean;
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    decimals = 0,
    compact = false,
  } = options;

  let value = amount;

  // Handle compact format (e.g., 1.2K, 3.5M)
  if (compact) {
    if (value >= 10000000) {
      // For values >= 10M, show in Cr/M format
      if (currency.code === 'INR') {
        value = value / 10000000;
        const formatted = value.toFixed(decimals || 1);
        return showSymbol 
          ? `${currency.symbol}${formatted}Cr`
          : `${formatted}Cr`;
      } else {
        value = value / 1000000;
        const formatted = value.toFixed(decimals || 1);
        return showSymbol 
          ? `${currency.symbol}${formatted}M`
          : `${formatted}M`;
      }
    } else if (value >= 100000) {
      // For values >= 100K
      if (currency.code === 'INR') {
        value = value / 100000;
        const formatted = value.toFixed(decimals || 1);
        return showSymbol 
          ? `${currency.symbol}${formatted}L`
          : `${formatted}L`;
      } else {
        value = value / 1000;
        const formatted = value.toFixed(decimals || 1);
        return showSymbol 
          ? `${currency.symbol}${formatted}K`
          : `${formatted}K`;
      }
    }
  }

  // Format with thousands separator
  const formattedValue = currency.code === 'INR'
    ? formatIndianNumber(value, decimals)
    : formatInternationalNumber(value, decimals);

  // Build final string
  let result = formattedValue;
  
  if (showSymbol && currency.symbolPosition === 'before') {
    result = `${currency.symbol}${result}`;
  } else if (showSymbol && currency.symbolPosition === 'after') {
    result = `${result}${currency.symbol}`;
  }
  
  if (showCode) {
    result = `${result} ${currency.code}`;
  }

  return result;
}

/**
 * Parse a currency string back to a number
 */
export function parseCurrencyString(value: string): number {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = value.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Get compact suffix for large numbers
 */
export function getCompactSuffix(amount: number, currencyCode: CurrencyCode): string {
  if (currencyCode === 'INR') {
    if (amount >= 10000000) return 'Cr';
    if (amount >= 100000) return 'L';
    if (amount >= 1000) return 'K';
  } else {
    if (amount >= 1000000) return 'M';
    if (amount >= 1000) return 'K';
  }
  return '';
}
