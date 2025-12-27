# Multi-Language Implementation Guide

## Overview

The HR Management System supports internationalization (i18n) with 5 languages:
- 🇬🇧 English (`en`)
- 🇸🇦 Arabic (`ar`) - with RTL support
- 🇳🇱 Dutch (`nl`)
- 🇫🇷 French (`fr`)
- 🇵🇱 Polish (`pl`)

## Architecture

### Components

1. **LanguageContext** (`/contexts/LanguageContext.tsx`)
   - Manages current language state
   - Provides translation function
   - Handles RTL layout
   - Persists language preference

2. **Translation Files** (`/translations/`)
   - One file per language
   - Key-value pairs for all text
   - Organized by module

3. **LanguageSelector** (`/components/LanguageSelector.tsx`)
   - UI component for language selection
   - Displays current language with flag
   - Dropdown with all available languages

## How It Works

### 1. Language Context

```tsx
// contexts/LanguageContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar' | 'nl' | 'fr' | 'pl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
```

**Features:**
- **State Management**: Tracks current language
- **Translation Function**: `t(key)` returns translated string
- **RTL Support**: Sets `dir="rtl"` for Arabic
- **Persistence**: Saves to localStorage
- **Dynamic Loading**: Imports translation files on demand

### 2. Translation Files

Each file exports a default object with translation keys:

```tsx
// translations/en.ts
export default {
  'common.save': 'Save',
  'dashboard.title': 'Dashboard',
  'employees.addEmployee': 'Add Employee',
  // ... more keys
};
```

**Key Structure:**
```
[module].[section].[element]
```

Examples:
- `common.save` - Common actions
- `dashboard.title` - Dashboard page title
- `employees.addEmployee` - Employee module, add action
- `attendance.calendar` - Attendance module, calendar view

### 3. Using Translations

In any component:

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <Button>{t('common.save')}</Button>
    </div>
  );
}
```

### 4. Language Selector

```tsx
import LanguageSelector from './LanguageSelector';

// In your component
<LanguageSelector />
```

## Adding a New Language

### Step 1: Create Translation File

Create a new file in `/translations/` folder:

```tsx
// translations/de.ts (German example)
export default {
  // Common
  'common.save': 'Speichern',
  'common.cancel': 'Abbrechen',
  'common.delete': 'Löschen',
  // ... all other keys
};
```

**Important**: Include ALL translation keys from `en.ts`

### Step 2: Update Language Type

```tsx
// contexts/LanguageContext.tsx

// Add to type union
type Language = 'en' | 'ar' | 'nl' | 'fr' | 'pl' | 'de';
```

### Step 3: Add to Languages List

```tsx
// contexts/LanguageContext.tsx

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }, // New
];
```

### Step 4: Test

1. Clear browser localStorage
2. Refresh the application
3. Select the new language
4. Verify all translations appear correctly

## Translation Best Practices

### 1. Consistent Keys

Always use the same key structure:
```tsx
// Good
'employees.title'
'employees.subtitle'
'employees.addEmployee'

// Bad
'employeesTitle'
'employee_subtitle'
'add_employee'
```

### 2. Descriptive Keys

Use clear, descriptive key names:
```tsx
// Good
'leave.applyLeave'
'payroll.generatePayslip'

// Bad
'leave.button1'
'payroll.action'
```

### 3. Avoid Hardcoding

Never hardcode text:
```tsx
// Bad
<h1>Employee Management</h1>

// Good
<h1>{t('employees.title')}</h1>
```

### 4. Pluralization

Handle plurals explicitly:
```tsx
// translations/en.ts
'employees.count.one': '1 employee',
'employees.count.many': '{{count}} employees',

// In component
const text = count === 1 
  ? t('employees.count.one') 
  : t('employees.count.many').replace('{{count}}', count);
```

### 5. Variables in Translations

For dynamic content:
```tsx
// Translation
'welcome.message': 'Welcome back, {{name}}!',

// Usage
const message = t('welcome.message').replace('{{name}}', userName);
```

### 6. Context-Specific Translations

Same word, different contexts:
```tsx
'common.save': 'Save',          // Button text
'common.saving': 'Saving...',   // Loading state
'common.saved': 'Saved',        // Success message
```

## RTL (Right-to-Left) Support

### Automatic RTL Layout

When Arabic is selected:
1. `dir="rtl"` is set on `<html>`
2. Tailwind automatically mirrors layouts
3. Flexbox and grid reverse direction
4. Text alignment adjusts

### Manual RTL Adjustments

For specific cases:
```tsx
// Use directional utilities
<div className="ltr:ml-4 rtl:mr-4">
  {/* Margin-left in LTR, margin-right in RTL */}
</div>
```

### Testing RTL

1. Select Arabic language
2. Verify layout mirrors correctly
3. Check alignment of text and icons
4. Test all navigation flows
5. Verify modal/dialog positioning

## Handling Missing Translations

If a translation key is missing, the system returns the key itself:

```tsx
// If 'new.key' doesn't exist in translation file
t('new.key') // Returns: 'new.key'
```

**Prevention:**
1. Always add keys to ALL language files
2. Use TypeScript for type safety (optional enhancement)
3. Test in multiple languages before deploying

## Performance Optimization

### Lazy Loading

Translations are loaded dynamically:
```tsx
// Only loaded when language is selected
import(`../translations/${language}.ts`)
```

### Caching

Translation object is cached in state:
```tsx
const [translations, setTranslations] = useState({});
```

### Memoization (Optional)

For expensive translations:
```tsx
const translatedTitle = useMemo(
  () => t('complex.key'),
  [language]
);
```

## Translation Workflow

### For Developers

1. Add new feature with English keys
2. Add keys to `en.ts`
3. Create translation tasks for other languages
4. Update all language files
5. Test in all languages

### For Translators

1. Receive list of new keys
2. Translate to target language
3. Maintain consistency with existing translations
4. Consider cultural context
5. Test translations in context

## Common Translation Patterns

### Navigation

```tsx
'nav.dashboard': 'Dashboard',
'nav.employees': 'Employees',
'nav.settings': 'Settings',
```

### Actions

```tsx
'common.save': 'Save',
'common.cancel': 'Cancel',
'common.edit': 'Edit',
'common.delete': 'Delete',
```

### Status Messages

```tsx
'status.success': 'Success!',
'status.error': 'Error occurred',
'status.loading': 'Loading...',
```

### Form Labels

```tsx
'form.name': 'Name',
'form.email': 'Email',
'form.password': 'Password',
```

### Validation

```tsx
'validation.required': 'This field is required',
'validation.email': 'Invalid email address',
'validation.minLength': 'Minimum {{min}} characters',
```

## Future Enhancements

### 1. Professional Translation Service

Integrate with services like:
- Crowdin
- Lokalise
- POEditor

### 2. Plural Rules

Implement proper pluralization:
```tsx
// Using Intl.PluralRules
const pluralRules = new Intl.PluralRules(language);
const rule = pluralRules.select(count);
```

### 3. Date/Number Formatting

```tsx
// Locale-specific formatting
const formattedDate = new Intl.DateTimeFormat(language).format(date);
const formattedNumber = new Intl.NumberFormat(language).format(number);
```

### 4. Language Detection

Auto-detect user's browser language:
```tsx
const browserLang = navigator.language.split('-')[0];
const defaultLang = languages.includes(browserLang) ? browserLang : 'en';
```

### 5. Translation Keys as Types

TypeScript type safety:
```tsx
type TranslationKey = 
  | 'common.save'
  | 'dashboard.title'
  | /* ... all keys */;

const t = (key: TranslationKey): string => {
  // ...
};
```

## Troubleshooting

### Issue: Translations not updating

**Solution:**
1. Check if translation file is saved
2. Clear browser cache
3. Restart dev server
4. Verify import path

### Issue: RTL layout broken

**Solution:**
1. Check `dir` attribute on HTML element
2. Verify Tailwind classes
3. Test with minimal RTL-specific styles
4. Use browser DevTools to inspect

### Issue: Language not persisting

**Solution:**
1. Check localStorage in DevTools
2. Verify localStorage is not blocked
3. Check for typos in storage key
4. Test in incognito mode

### Issue: Missing translations show keys

**Solution:**
1. Add missing keys to translation file
2. Verify key spelling matches exactly
3. Check for nested object structure
4. Ensure export default is used

## Resources

- [React i18n Guide](https://react.i18next.com/)
- [Tailwind RTL Plugin](https://github.com/20lives/tailwindcss-rtl)
- [Unicode CLDR](http://cldr.unicode.org/) - Locale data
- [Google Translate](https://translate.google.com/) - Quick translations (not recommended for production)
