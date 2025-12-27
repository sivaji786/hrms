# System Architecture

## Overview

The HR Management System is built using a modern, component-based architecture with React and TypeScript. The system follows a modular design pattern where each HR function is encapsulated in its own module.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│    (React Components & UI)              │
├─────────────────────────────────────────┤
│          Business Logic Layer           │
│    (State Management & Contexts)        │
├─────────────────────────────────────────┤
│          Data Layer                     │
│    (Mock Data & Future API)             │
└─────────────────────────────────────────┘
```

## Directory Structure

```
/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── common/          # Shared components (StatCard, etc.)
│   ├── Dashboard.tsx    # Main dashboard shell
│   ├── DashboardHome.tsx
│   ├── EmployeeManagement.tsx
│   ├── AttendanceTracking.tsx
│   ├── LeaveManagement.tsx
│   ├── PayrollManagement.tsx
│   ├── Recruitment.tsx
│   └── ... (other modules)
│
├── contexts/            # React contexts
│   └── LanguageContext.tsx
│
├── translations/        # i18n translations
│   ├── en.ts
│   ├── ar.ts
│   ├── nl.ts
│   ├── fr.ts
│   └── pl.ts
│
├── data/               # Mock data
│   ├── employeeData.ts
│   ├── attendanceData.ts
│   ├── payrollData.ts
│   └── ... (other data)
│
├── styles/             # Global styles
│   └── globals.css
│
├── docs/               # Documentation
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── USER_GUIDE.md
│   └── DEVELOPMENT_GUIDE.md
│
└── App.tsx            # Root component
```

## Core Components

### 1. Application Shell (`App.tsx`)
- Root component
- Manages authentication state
- Wraps application in LanguageProvider

### 2. Dashboard (`Dashboard.tsx`)
- Main navigation container
- Sidebar with module navigation
- Header with notifications and language selector
- Renders active module content

### 3. Module Components
Each major HR function is a separate component:
- **DashboardHome**: Overview and stats
- **EmployeeManagement**: Employee CRUD operations
- **AttendanceTracking**: Clock in/out, calendar
- **LeaveManagement**: Leave requests and approvals
- **PayrollManagement**: Salary processing
- **Recruitment**: Job postings and ATS
- **And more...**

## State Management

### Context API
The system uses React Context API for global state:

#### LanguageContext
```typescript
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
```

**Features:**
- Language selection
- Translation function
- RTL support for Arabic
- Persists to localStorage

### Component State
Each module manages its own local state using `useState` and `useEffect` hooks.

## Navigation Architecture

### Two-Level Navigation

1. **Module Level**
   - Sidebar navigation switches between main modules
   - State managed in Dashboard component
   - Example: Dashboard → Employees → Leave

2. **Sub-View Level**
   - Within modules, sub-views for details/forms
   - Example: Employee List → Employee Profile → Edit Employee
   - Back button returns to previous view while maintaining tab state

### Navigation Pattern
```typescript
// Dashboard tracks active module
const [activeModule, setActiveModule] = useState('dashboard');

// Modules track their own sub-views
const [currentView, setCurrentView] = useState('list');
const [activeTab, setActiveTab] = useState('employees');
```

## Data Flow

### Current Implementation (Mock Data)
```
Component → Import Mock Data → Render
```

### Future Implementation (API)
```
Component → Context/Hook → API Call → State Update → Render
```

## Design Patterns

### 1. Component Composition
Components are composed from smaller, reusable pieces:
```tsx
<Card>
  <CardHeader>
    <CardTitle>...</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### 2. Prop Drilling Avoidance
Using Context API to avoid excessive prop drilling:
```tsx
const { t } = useLanguage();
```

### 3. Controlled Components
Forms and inputs are controlled components:
```tsx
<Input 
  value={searchTerm} 
  onChange={(e) => setSearchTerm(e.target.value)} 
/>
```

### 4. Render Props Pattern
Callbacks for navigation and actions:
```tsx
<EmployeeList 
  onViewEmployee={handleViewEmployee}
  onEditEmployee={handleEditEmployee}
/>
```

## Styling Architecture

### Tailwind CSS v4.0
- Utility-first CSS framework
- Custom design tokens in `/styles/globals.css`
- No separate config file needed

### Design System
```css
/* Typography */
--font-sans, --font-mono

/* Colors */
--color-*, --gray-*, --blue-*, etc.

/* Spacing */
Standard Tailwind spacing scale

/* Components */
shadcn/ui component library
```

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Responsive sidebar (drawer on mobile)

## Internationalization (i18n)

### Translation System
```typescript
// 1. Translation files per language
// /translations/en.ts, /translations/ar.ts, etc.

// 2. LanguageContext loads translations
const [translations, setTranslations] = useState({});

// 3. Components use t() function
const { t } = useLanguage();
<h1>{t('dashboard.title')}</h1>
```

### RTL Support
For Arabic language:
- Sets `dir="rtl"` on document
- Tailwind automatically mirrors layouts
- Custom RTL styles where needed

## Performance Considerations

### Code Splitting
- Lazy loading for translation files
- Dynamic imports for language modules

### Memoization Opportunities
- Memoize expensive calculations
- Use `useMemo` for derived data
- Use `useCallback` for event handlers

### Virtualization
For large lists (future):
- Implement virtual scrolling
- Paginate API responses

## Security Architecture

### Current State (Demo)
- Client-side authentication mock
- No API security
- All data is client-side

### Production Recommendations
1. **Authentication**: JWT or OAuth 2.0
2. **Authorization**: Role-based access control (RBAC)
3. **API Security**: HTTPS, API keys, rate limiting
4. **Data Protection**: Encryption at rest and in transit
5. **GDPR Compliance**: Data privacy, right to deletion

## Future Enhancements

### API Integration
```typescript
// services/api.ts
export const api = {
  employees: {
    getAll: () => fetch('/api/employees'),
    getById: (id) => fetch(`/api/employees/${id}`),
    create: (data) => fetch('/api/employees', { method: 'POST' }),
    // ...
  }
}
```

### State Management (if needed)
Consider Redux or Zustand for:
- Complex global state
- Time-travel debugging
- Middleware requirements

### Testing Architecture
```
/tests
├── unit/              # Component unit tests
├── integration/       # Integration tests
└── e2e/              # End-to-end tests
```

## Scalability Considerations

### Module Independence
Each module can be:
- Developed independently
- Tested in isolation
- Deployed separately (micro-frontends)

### Code Organization
- Clear separation of concerns
- Single responsibility principle
- Easy to locate and modify code

### Data Caching
Future implementation:
- Cache API responses
- Optimistic UI updates
- Background sync

## Deployment Architecture

### Build Process
```bash
npm run build
→ Vite bundles application
→ Outputs to /dist
→ Ready for static hosting
```

### Hosting Options
- **Static Hosting**: Netlify, Vercel, AWS S3
- **Container**: Docker + Kubernetes
- **Traditional**: Apache/Nginx

### Environment Configuration
```
/.env.development
/.env.production
```

## Monitoring & Analytics

### Future Integration
- **Error Tracking**: Sentry, Rollbar
- **Analytics**: Google Analytics, Mixpanel
- **Performance**: Web Vitals, Lighthouse
- **User Behavior**: Hotjar, FullStory
