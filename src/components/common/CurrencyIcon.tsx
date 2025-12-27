import { useCurrency } from '../../contexts/CurrencyContext';

interface CurrencyIconProps {
  className?: string;
}

/**
 * Dynamic currency icon component that displays the current currency symbol
 * This replaces the static DollarSign icon and adapts based on the selected currency
 */
export default function CurrencyIcon({ className = 'w-6 h-6' }: CurrencyIconProps) {
  const { currency } = useCurrency();
  
  return (
    <div className={`flex items-center justify-center font-semibold ${className}`}>
      <span className="text-current">{currency.symbol}</span>
    </div>
  );
}
