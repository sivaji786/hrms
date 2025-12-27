import { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { LucideIcon } from 'lucide-react';
import { useCurrency, CurrencyCode } from '../../contexts/CurrencyContext';

/**
 * Common table cell components for consistent rendering across DataTables
 */

// Avatar Cell Props
interface AvatarCellProps {
  name: string;
  subtitle?: string;
  secondarySubtitle?: string;
  avatarUrl?: string;
  fallbackColor?: string;
}

/**
 * Renders an avatar with name and optional subtitle(s)
 * Used for employee/user columns
 */
export function AvatarCell({ 
  name, 
  subtitle, 
  secondarySubtitle,
  avatarUrl,
  fallbackColor = 'from-blue-500 to-indigo-500'
}: AvatarCellProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-10 h-10">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
        <AvatarFallback className={`bg-gradient-to-br ${fallbackColor} text-white`}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">
            {subtitle}
            {secondarySubtitle && ` • ${secondarySubtitle}`}
          </p>
        )}
      </div>
    </div>
  );
}

// Status Badge Cell Props
interface StatusBadgeCellProps {
  status: string;
  icon?: LucideIcon;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  showIcon?: boolean;
}

/**
 * Renders a status badge with optional icon
 */
export function StatusBadgeCell({ 
  status, 
  icon: Icon,
  variant = 'outline',
  className = '',
  showIcon = true
}: StatusBadgeCellProps) {
  return (
    <div className="flex items-center gap-2">
      {Icon && showIcon && <Icon className="w-4 h-4" />}
      <Badge variant={variant} className={className}>
        {status}
      </Badge>
    </div>
  );
}

// ID Cell Props
interface IdCellProps {
  id: string | number;
  color?: string;
}

/**
 * Renders a formatted ID with color
 */
export function IdCell({ id, color = 'text-blue-600' }: IdCellProps) {
  return <span className={`font-medium ${color}`}>{id}</span>;
}

// Multi-line Text Cell Props
interface MultiLineTextCellProps {
  primary: string;
  secondary?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
}

/**
 * Renders primary text with optional secondary text below
 */
export function MultiLineTextCell({ 
  primary, 
  secondary,
  primaryClassName = 'font-medium text-gray-900',
  secondaryClassName = 'text-sm text-gray-500'
}: MultiLineTextCellProps) {
  return (
    <div className="text-sm">
      <p className={primaryClassName}>{primary}</p>
      {secondary && <p className={secondaryClassName}>{secondary}</p>}
    </div>
  );
}

// Action Buttons Cell Props
interface ActionButtonsCellProps {
  actions: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
    icon?: LucideIcon;
    className?: string;
    disabled?: boolean;
  }[];
}

/**
 * Renders multiple action buttons in a row
 */
export function ActionButtonsCell({ actions }: ActionButtonsCellProps) {
  return (
    <div className="flex gap-2">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            size="sm"
            variant={action.variant || 'outline'}
            className={action.className}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            disabled={action.disabled}
          >
            {Icon && <Icon className="w-4 h-4 mr-1" />}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

// Number Cell Props
interface NumberCellProps {
  value: number;
  currency?: string; // Legacy: specific currency symbol (₹, $, etc.)
  useCurrencyContext?: boolean; // Use global currency context
  fromCurrency?: CurrencyCode; // Source currency for conversion
  className?: string;
  decimals?: number;
}

/**
 * Renders formatted number with optional currency
 * If useCurrencyContext is true, uses the global currency context
 * Otherwise, uses the legacy currency string
 */
export function NumberCell({ 
  value, 
  currency,
  useCurrencyContext = false,
  fromCurrency = 'INR',
  className = 'font-medium text-gray-900',
  decimals = 0
}: NumberCellProps) {
  const { convertAmount, formatCurrency: formatCurrencyFromContext } = useCurrency();

  if (useCurrencyContext) {
    const convertedValue = convertAmount(value, fromCurrency);
    const formatted = formatCurrencyFromContext(convertedValue, { decimals });
    return <span className={className}>{formatted}</span>;
  }

  // Legacy behavior
  const formattedValue = value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {currency && `${currency}`}
      {formattedValue}
    </span>
  );
}

// Date Cell Props
interface DateCellProps {
  date: string;
  format?: 'date' | 'datetime' | 'relative';
  className?: string;
}

/**
 * Renders formatted date
 */
export function DateCell({ 
  date, 
  format = 'date',
  className = 'text-gray-900'
}: DateCellProps) {
  // Simple date display - can be enhanced with date-fns or similar
  return <span className={className}>{date}</span>;
}

// Badge Cell (simple)
interface SimpleBadgeCellProps {
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

/**
 * Renders a simple badge
 */
export function SimpleBadgeCell({ 
  label, 
  variant = 'outline',
  className = ''
}: SimpleBadgeCellProps) {
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

// Icon Text Cell Props
interface IconTextCellProps {
  icon?: LucideIcon | null;
  text: string;
  subtext?: string;
  iconClassName?: string;
  textClassName?: string;
  subtextClassName?: string;
}

/**
 * Renders an icon with text and optional subtext
 */
export function IconTextCell({ 
  icon: Icon, 
  text,
  subtext,
  iconClassName = 'w-4 h-4 text-gray-400',
  textClassName = 'text-gray-600',
  subtextClassName = 'text-xs text-gray-500'
}: IconTextCellProps) {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className={iconClassName} />}
      <div className="flex flex-col">
        <span className={textClassName}>{text}</span>
        {subtext && <span className={subtextClassName}>{subtext}</span>}
      </div>
    </div>
  );
}

// Email Cell
interface EmailCellProps {
  email: string;
  icon?: boolean;
}

/**
 * Renders an email with optional icon
 */
export function EmailCell({ email, icon = false }: EmailCellProps) {
  return (
    <span className="text-sm text-gray-600">
      {email}
    </span>
  );
}

// Progress Cell Props
interface ProgressCellProps {
  percentage: number;
  showLabel?: boolean;
  color?: string;
}

/**
 * Renders a progress bar
 */
export function ProgressCell({ 
  percentage, 
  showLabel = true,
  color = 'bg-blue-600'
}: ProgressCellProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 min-w-[3rem]">{percentage}%</span>
      )}
    </div>
  );
}
