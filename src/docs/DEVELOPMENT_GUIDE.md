# Development Guide

## Table of Contents

1. [Setup](#setup)
2. [Development Workflow](#development-workflow)
3. [Project Structure](#project-structure)
4. [Creating New Modules](#creating-new-modules)
5. [Adding Translations](#adding-translations)
6. [Styling Guidelines](#styling-guidelines)
7. [Component Development](#component-development)
8. [Best Practices](#best-practices)

## Setup

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd hr-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Development Workflow

### Starting Development

1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create pull request

### Code Style

The project uses:
- **TypeScript** for type safety
- **ESLint** for linting (configuration recommended)
- **Prettier** for formatting (configuration recommended)

## Project Structure

```
/
├── components/          # All React components
│   ├── ui/             # shadcn/ui components (don't modify)
│   ├── common/         # Shared components
│   └── [Module].tsx    # Feature modules
│
├── contexts/           # React contexts
│   └── LanguageContext.tsx
│
├── translations/       # i18n translation files
│   ├── en.ts          # English
│   ├── ar.ts          # Arabic
│   ├── nl.ts          # Dutch
│   ├── fr.ts          # French
│   └── pl.ts          # Polish
│
├── data/              # Mock data (replace with API calls)
│   └── [module]Data.ts
│
├── styles/            # Global styles
│   └── globals.css    # Tailwind config + custom styles
│
└── docs/              # Documentation
```

## Creating New Modules

### Step 1: Create Component File

```tsx
// components/NewModule.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export default function NewModule() {
  const [data, setData] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Module Title</h2>
        <p className="text-sm text-gray-500">Module description</p>
      </div>

      {/* Your module content */}
    </div>
  );
}
```

### Step 2: Add to Dashboard

```tsx
// components/Dashboard.tsx

// 1. Import the module
import NewModule from './NewModule';

// 2. Add to menuItems
const menuItems = [
  // ... existing items
  { id: 'newmodule', icon: YourIcon, label: 'New Module' },
];

// 3. Add to renderContent switch
case 'newmodule':
  return <NewModule />;
```

### Step 3: Create Mock Data (if needed)

```tsx
// data/newModuleData.ts
export const newModuleData = [
  {
    id: '1',
    // ... properties
  },
];
```

### Step 4: Add Translations

Add translation keys to all language files:

```tsx
// translations/en.ts
export default {
  // ... existing translations
  'newmodule.title': 'New Module',
  'newmodule.subtitle': 'Description',
  // ... more keys
};
```

## Adding Translations

### Adding New Languages

1. Create translation file:
```tsx
// translations/de.ts (German example)
export default {
  'common.save': 'Speichern',
  'common.cancel': 'Abbrechen',
  // ... all translation keys
};
```

2. Update LanguageContext:
```tsx
// contexts/LanguageContext.tsx
type Language = 'en' | 'ar' | 'nl' | 'fr' | 'pl' | 'de';

export const languages = [
  // ... existing languages
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];
```

### Using Translations in Components

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.subtitle')}</p>
    </div>
  );
}
```

### Translation Key Naming Convention

```
[module].[section].[element]
```

Examples:
- `dashboard.title`
- `employees.addEmployee`
- `common.save`
- `attendance.calendar`

## Styling Guidelines

### Tailwind Classes

**DO:**
```tsx
<div className="flex items-center gap-4 p-6">
```

**DON'T** (avoid font sizing/weight unless requested):
```tsx
<div className="text-2xl font-bold leading-tight">
```

### Using StatCard Component

```tsx
import { StatCard } from './common';
import { Users } from 'lucide-react';

<StatCard
  title="Total Employees"
  value="1,234"
  icon={Users}
  iconColor="text-blue-600"
  trend={{ value: 5.2, isPositive: true }}
  variant="default"
/>
```

### Color Conventions

- **Success/Positive**: Green (`bg-green-*`, `text-green-*`)
- **Warning**: Yellow/Orange (`bg-yellow-*`, `text-yellow-*`)
- **Error/Negative**: Red (`bg-red-*`, `text-red-*`)
- **Info**: Blue (`bg-blue-*`, `text-blue-*`)
- **Neutral**: Gray (`bg-gray-*`, `text-gray-*`)

### Responsive Design

Always consider mobile:
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
</div>

<div className="flex flex-col sm:flex-row gap-4">
  {/* Mobile: stacked, Desktop: row */}
</div>
```

## Component Development

### Using shadcn/ui Components

Available in `/components/ui/`:

```tsx
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Search..." />
    <Button>Save</Button>
  </CardContent>
</Card>
```

### State Management

For local state:
```tsx
const [isOpen, setIsOpen] = useState(false);
const [data, setData] = useState([]);
```

For global state, use Context:
```tsx
const { language, setLanguage } = useLanguage();
```

### Event Handlers

```tsx
// Named handler functions
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  // Handle submission
};

const handleDelete = (id: string) => {
  // Handle deletion
};

<form onSubmit={handleSubmit}>
  <Button type="submit">Submit</Button>
</form>
```

### TypeScript Types

Define interfaces for props:
```tsx
interface EmployeeListProps {
  employees: Employee[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function EmployeeList({ 
  employees, 
  onSelect, 
  onEdit 
}: EmployeeListProps) {
  // Component logic
}
```

## Best Practices

### 1. Component Organization

```tsx
// Imports
import React from 'react';
import { Button } from './ui/button';

// Types
interface Props {
  // ...
}

// Component
export default function MyComponent({ prop1, prop2 }: Props) {
  // State
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Render helpers
  const renderItem = (item) => {
    // ...
  };
  
  // Main render
  return (
    // ...
  );
}
```

### 2. Avoid Prop Drilling

Use Context for deeply nested data:
```tsx
// Bad
<A prop={data}>
  <B prop={data}>
    <C prop={data} />
  </B>
</A>

// Good
<MyContext.Provider value={data}>
  <A>
    <B>
      <C />
    </B>
  </A>
</MyContext.Provider>
```

### 3. Key Props in Lists

Always use unique keys:
```tsx
// Bad
{items.map((item, index) => <div key={index}>...</div>)}

// Good
{items.map(item => <div key={item.id}>...</div>)}
```

### 4. Conditional Rendering

```tsx
// Simple condition
{isLoading && <Spinner />}

// If-else
{isLoading ? <Spinner /> : <Content />}

// Multiple conditions
{status === 'loading' && <Spinner />}
{status === 'error' && <Error />}
{status === 'success' && <Content />}
```

### 5. Form Handling

```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

<Input
  name="name"
  value={formData.name}
  onChange={handleChange}
/>
```

### 6. Error Handling

```tsx
const [error, setError] = useState<string | null>(null);

try {
  // Operation
} catch (err) {
  setError(err.message);
}

{error && (
  <Alert variant="destructive">
    {error}
  </Alert>
)}
```

### 7. Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await api.getData();
    setData(data);
  } finally {
    setIsLoading(false);
  }
};

return isLoading ? <Skeleton /> : <Content />;
```

### 8. Performance Optimization

```tsx
// Memoize expensive calculations
const sortedData = useMemo(
  () => data.sort((a, b) => a.name.localeCompare(b.name)),
  [data]
);

// Memoize callbacks
const handleClick = useCallback(
  (id) => {
    // Handle click
  },
  [dependency]
);
```

## Testing

### Unit Tests (Recommended)

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Integration Tests

Test component interactions:
```tsx
test('handles user interaction', async () => {
  render(<MyComponent />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

## Deployment

### Environment Variables

Create `.env` files:
```bash
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://api.production.com
```

Access in code:
```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npm run depcheck
```

## Troubleshooting

### Common Issues

**Issue**: Component not re-rendering
**Solution**: Check if state is being mutated directly

**Issue**: Translations not loading
**Solution**: Verify language file exports default object

**Issue**: Styling not applying
**Solution**: Check Tailwind class names, verify globals.css is imported

**Issue**: Type errors
**Solution**: Define proper TypeScript interfaces

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite Guide](https://vitejs.dev/guide/)
