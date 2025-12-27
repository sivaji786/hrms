# Currency Management System

## Overview

The HR Management System now includes a comprehensive currency management feature that allows administrators to configure a single currency that is used consistently across both the Admin Portal and Employee Portal.

## Features

- **16 Pre-configured Currencies**: Support for major global currencies including USD, EUR, GBP, INR, JPY, CNY, AUD, CAD, CHF, AED, SAR, SGD, MYR, ZAR, BRL, and MXN
- **Centralized Configuration**: Set currency once in Admin Settings, applies everywhere
- **Consistent Formatting**: All monetary values use the same currency format
- **Locale-aware**: Respects thousand separators, decimal separators, and symbol positioning
- **Persistent Settings**: Currency selection is saved in browser localStorage
- **Real-time Preview**: See currency format examples before applying changes

## Architecture

### Files Structure

```
/data/
  └── currencySettings.ts       # Currency definitions and configuration
/utils/
  └── currency.ts                # Currency formatting utilities
/contexts/
  └── CurrencyContext.tsx        # React context for currency state
/components/
  └── CurrencySettings.tsx       # Admin UI for currency management
```

### Data Layer (`/data/currencySettings.ts`)

Defines:
- `Currency` interface with properties:
  - `code`: ISO currency code (USD, EUR, etc.)
  - `symbol`: Currency symbol ($, €, £, etc.)
  - `name`: Full currency name
  - `symbolPosition`: 'before' or 'after' the amount
  - `decimalPlaces`: Number of decimal places (0-2)
  - `thousandSeparator`: Character for thousands (comma, period, etc.)
  - `decimalSeparator`: Character for decimals
- `availableCurrencies`: Array of 16 supported currencies
- `getSelectedCurrency()`: Returns currently selected currency
- `setSelectedCurrency(code)`: Updates selected currency
- `getCurrencyByCode(code)`: Finds currency by ISO code

### Utility Layer (`/utils/currency.ts`)

Provides formatting functions:

#### `formatCurrency(amount, currency?, showSymbol?)`
Formats a number as currency with proper separators and symbol.

```typescript
formatCurrency(1234567.89)  // "$1,234,567.89" (using USD)
formatCurrency(1234567.89, getCurrencyByCode('EUR'))  // "€1,234,567.89"
formatCurrency(1000, undefined, false)  // "1,000.00" (no symbol)
```

#### `formatCompactCurrency(amount, currency?)`
Formats large amounts with K/M/B suffix.

```typescript
formatCompactCurrency(1500)      // "$1.5K"
formatCompactCurrency(2500000)   // "$2.5M"
formatCompactCurrency(3000000000) // "$3B"
```

#### `parseCurrency(formattedAmount, currency?)`
Parses a formatted currency string back to a number.

```typescript
parseCurrency("$1,234.56")  // 1234.56
parseCurrency("€1.234,56")  // 1234.56 (European format)
```

#### Helper Functions
- `getCurrencySymbol()`: Returns current currency symbol
- `getCurrencyCode()`: Returns current currency code (USD, EUR, etc.)
- `getCurrencyName()`: Returns current currency full name

### Context Layer (`/contexts/CurrencyContext.tsx`)

React context that provides:
- `currency`: Current currency object
- `refreshCurrency()`: Reload currency from localStorage

Must wrap the app in `<CurrencyProvider>` (already done in App.tsx).

### UI Layer (`/components/CurrencySettings.tsx`)

Admin interface providing:
- **Current Currency Display**: Shows active currency with example
- **Currency Selection**: Dropdown with all 16 currencies
- **Live Preview**: Shows formatting example before saving
- **Currency Details**: Displays symbol, code, separators, etc.
- **Available Currencies Grid**: Visual list of all supported currencies
- **Warning Messages**: Alerts about system-wide impact

## Usage Guide

### For Administrators

1. **Access Currency Settings**:
   - Log in to Admin Portal
   - Navigate to Admin & Role Management
   - Click on "Currency Settings" tab

2. **Change Currency**:
   - Select desired currency from dropdown
   - Review the preview and format example
   - Click "Save Currency" button
   - Page will reload to apply changes system-wide

3. **Impact**:
   - All monetary values in both Admin and Employee portals will use the new currency
   - Includes: Dashboard stats, payroll, expenses, reports, payslips, etc.

### For Developers

#### Using Currency Formatting in Components

```typescript
import { formatCurrency, formatCompactCurrency } from '../utils/currency';

// In your component
const salary = 85000;
const displayValue = formatCurrency(salary);  // "$85,000.00"

// For large numbers on dashboard
const totalPayroll = 8500000;
const compactValue = formatCompactCurrency(totalPayroll);  // "$8.5M"
```

#### Adding Currency to Data

```typescript
// Before (hardcoded currency)
const payslip = {
  gross: '$6,000',
  net: '$5,200'
};

// After (dynamic currency)
const payslip = {
  gross: 6000,
  net: 5200
};

// In component render
<span>{formatCurrency(payslip.gross)}</span>
```

#### Using the Currency Context

```typescript
import { useCurrency } from '../contexts/CurrencyContext';

function MyComponent() {
  const { currency, refreshCurrency } = useCurrency();
  
  return (
    <div>
      <p>Current: {currency.name} ({currency.code})</p>
      <p>Symbol: {currency.symbol}</p>
    </div>
  );
}
```

## Supported Currencies

| Code | Name | Symbol | Decimal Places | Example Format |
|------|------|--------|----------------|----------------|
| USD | US Dollar | $ | 2 | $1,234.56 |
| EUR | Euro | € | 2 | €1,234.56 |
| GBP | British Pound | £ | 2 | £1,234.56 |
| INR | Indian Rupee | ₹ | 2 | ₹1,234.56 |
| JPY | Japanese Yen | ¥ | 0 | ¥1,235 |
| CNY | Chinese Yuan | ¥ | 2 | ¥1,234.56 |
| AUD | Australian Dollar | A$ | 2 | A$1,234.56 |
| CAD | Canadian Dollar | C$ | 2 | C$1,234.56 |
| CHF | Swiss Franc | CHF | 2 | CHF1,234.56 |
| AED | UAE Dirham | د.إ | 2 | د.إ1,234.56 |
| SAR | Saudi Riyal | ر.س | 2 | ر.س1,234.56 |
| SGD | Singapore Dollar | S$ | 2 | S$1,234.56 |
| MYR | Malaysian Ringgit | RM | 2 | RM1,234.56 |
| ZAR | South African Rand | R | 2 | R1,234.56 |
| BRL | Brazilian Real | R$ | 2 | R$1.234,56 |
| MXN | Mexican Peso | Mex$ | 2 | Mex$1,234.56 |

## Adding New Currencies

To add a new currency:

1. **Update `/data/currencySettings.ts`**:

```typescript
export const availableCurrencies: Currency[] = [
  // ... existing currencies
  {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
];
```

2. **No other changes needed**: The currency will automatically appear in the admin dropdown.

## Migration Notes

### Updating Existing Components

If you have components with hardcoded currency symbols:

**Before:**
```typescript
<div>Salary: ₹{salary.toLocaleString()}</div>
```

**After:**
```typescript
import { formatCurrency } from '../utils/currency';
<div>Salary: {formatCurrency(salary)}</div>
```

### Data Format Changes

Store monetary values as numbers, not formatted strings:

**Before:**
```typescript
const employee = {
  salary: '$85,000'  // ❌ String
};
```

**After:**
```typescript
const employee = {
  salary: 85000  // ✅ Number
};
```

## Translations

Currency settings are fully translated. Translation keys in `/translations/[lang]/admin.ts`:

- `admin.currencyTab`: Tab label
- `admin.currencySettings`: Page title
- `admin.currencySettingsDesc`: Description
- `admin.currentCurrency`: Current currency section
- `admin.changeCurrency`: Change currency section
- `admin.selectCurrency`: Select label
- `admin.currencyPreview`: Preview label
- `admin.saveCurrency`: Save button
- `admin.currencyUpdated`: Success message
- `admin.currencyWarning`: Warning message
- And more...

## Best Practices

1. **Always use utilities**: Never hardcode currency symbols or formats
2. **Store numbers**: Keep monetary values as numbers in data structures
3. **Format on display**: Apply currency formatting in the render/display layer
4. **Consider performance**: For large lists, consider memoization
5. **Test conversions**: When changing currencies, verify all displays update correctly

## Troubleshooting

### Currency not updating after change
- Ensure page reloaded after save
- Check browser console for errors
- Clear localStorage and try again

### Formatting looks wrong
- Verify the currency configuration in `currencySettings.ts`
- Check that `formatCurrency()` is being used correctly
- Ensure number is passed, not string

### Currency resets to default
- localStorage might be disabled or cleared
- Check browser privacy settings
- Currency will default to USD if localStorage unavailable

## Future Enhancements

Potential improvements for the currency system:

1. **Multi-currency support**: Allow different currencies for different locations
2. **Exchange rates**: Add currency conversion functionality
3. **Historical rates**: Track currency changes over time
4. **Custom currencies**: Allow admins to define custom currency formats
5. **Regional formats**: Add locale-specific number formatting beyond currency
6. **API integration**: Fetch live exchange rates from external APIs

## Related Documentation

- [Multi-language Guide](./MULTI_LANGUAGE_GUIDE.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
