import React from 'react';
import { useCurrency, CurrencyCode } from '../../contexts/CurrencyContext';

interface CurrencyDisplayProps {
  amount: number;
  fromCurrency?: CurrencyCode;
  showSymbol?: boolean;
  showCode?: boolean;
  decimals?: number;
  compact?: boolean;
  className?: string;
}

export default function CurrencyDisplay({
  amount,
  fromCurrency = 'INR',
  showSymbol = true,
  showCode = false,
  decimals = 0,
  compact = false,
  className = '',
}: CurrencyDisplayProps) {
  const { convertAmount, formatCurrency } = useCurrency();

  // Convert amount to selected currency
  const convertedAmount = convertAmount(amount, fromCurrency);

  // Format the converted amount
  const formattedAmount = formatCurrency(convertedAmount, {
    showSymbol,
    showCode,
    decimals,
    compact,
  });

  return <span className={className}>{formattedAmount}</span>;
}
