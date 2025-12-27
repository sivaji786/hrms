import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'SAR';

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalSeparator: string;
  thousandsSeparator: string;
  conversionRate: number; // Rate to convert from INR (base currency)
}

export const currencies: Record<CurrencyCode, Currency> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    conversionRate: 0.012, // 1 INR = 0.012 USD
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    conversionRate: 0.011, // 1 INR = 0.011 EUR
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    conversionRate: 0.0095, // 1 INR = 0.0095 GBP
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    conversionRate: 1, // Base currency
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    conversionRate: 0.044, // 1 INR = 0.044 AED
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    conversionRate: 0.045, // 1 INR = 0.045 SAR
  },
};

interface CurrencyContextType {
  currency: Currency;
  currencyCode: CurrencyCode;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatCurrency: (amount: number, options?: FormatCurrencyOptions) => string;
  convertAmount: (amount: number, fromCurrency?: CurrencyCode) => number;
}

interface FormatCurrencyOptions {
  showSymbol?: boolean;
  showCode?: boolean;
  decimals?: number;
  compact?: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('AED');
  const currency = currencies[currencyCode];

  const convertAmount = (amount: number, fromCurrency: CurrencyCode = 'INR'): number => {
    if (fromCurrency === currencyCode) return amount;

    // Convert from source currency to INR first (if not already INR)
    const amountInINR = fromCurrency === 'INR'
      ? amount
      : amount / currencies[fromCurrency].conversionRate;

    // Then convert from INR to target currency
    return currencyCode === 'INR'
      ? amountInINR
      : amountInINR * currency.conversionRate;
  };

  const formatCurrency = (
    amount: number,
    options: FormatCurrencyOptions = {}
  ): string => {
    const {
      showSymbol = true,
      showCode = false,
      decimals = 0,
      compact = false,
    } = options;

    let value = Number(amount);
    if (isNaN(value)) {
      value = 0;
    }

    // Handle compact format (e.g., 1.2K, 3.5M)
    if (compact) {
      if (value >= 10000000) {
        // For values >= 10M, show in Cr/M format
        if (currencyCode === 'INR') {
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
        if (currencyCode === 'INR') {
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
    const parts = value.toFixed(decimals).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator);
    const decimalPart = parts[1] ? `${currency.decimalSeparator}${parts[1]}` : '';
    const formattedValue = `${integerPart}${decimalPart}`;

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
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyCode,
        setCurrencyCode,
        formatCurrency,
        convertAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
