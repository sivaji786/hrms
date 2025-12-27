/**
 * Currency Settings
 * Manages currency configuration for the entire HR system
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
  thousandSeparator: string;
  decimalSeparator: string;
}

export const availableCurrencies: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: '.',
    decimalSeparator: ',',
  },
  {
    code: 'MXN',
    symbol: 'Mex$',
    name: 'Mexican Peso',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
];

// Default currency (can be changed by admin)
let selectedCurrency: Currency = availableCurrencies[0]; // USD by default

// Get the current selected currency
export const getSelectedCurrency = (): Currency => {
  // Try to get from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('hrms_currency');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = availableCurrencies.find(c => c.code === parsed.code);
        if (found) {
          selectedCurrency = found;
          return found;
        }
      } catch (e) {
        // Invalid data, use default
      }
    }
  }
  return selectedCurrency;
};

// Set the selected currency
export const setSelectedCurrency = (currencyCode: string): boolean => {
  const currency = availableCurrencies.find(c => c.code === currencyCode);
  if (currency) {
    selectedCurrency = currency;
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hrms_currency', JSON.stringify(currency));
    }
    return true;
  }
  return false;
};

// Get currency by code
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return availableCurrencies.find(c => c.code === code);
};

// Check if a currency exists
export const isCurrencyAvailable = (code: string): boolean => {
  return availableCurrencies.some(c => c.code === code);
};
