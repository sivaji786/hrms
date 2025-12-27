# Goals & KRA Module - Quick Reference Guide

## 🚀 Quick Start

### Using the Module

```typescript
// In PerformanceManagement.tsx (already integrated)
import Goals from './performance/Goals';

<TabsContent value="goals">
  <Goals />
</TabsContent>
```

### Component Imports

```typescript
// Import all components
import {
  Goals,
  GoalsList,
  CreateGoal,
  GoalDetails,
  KRAManagement,
  CreateKRA,
  KRADetails,
  AssignGoal
} from './components/performance';

// Or import individually
import Goals from './components/performance/Goals';
```

## 📋 Data Structure

### Goal Object
```typescript
const goal: Goal = {
  id: 'GOAL001',
  title: 'Achieve Q1 Revenue Target',
  description: '...',
  employeeId: 'EMP004',
  employeeName: 'Amit Kumar',
  department: 'Sales',
  kraId: 'KRA001',
  kraName: 'Sales & Revenue Growth',
  type: 'Individual', // or 'Team', 'Organizational'
  measurementCriteria: '...',
  targetValue: '₹50,00,000',
  currentValue: '₹37,50,000',
  progress: 75, // 0-100
  startDate: '2025-01-01',
  endDate: '2025-03-31',
  weight: 40, // percentage
  priority: 'Critical', // 'High', 'Medium', 'Low'
  status: 'On Track', // See status options below
  assignedBy: 'Manager Name',
  assignedDate: '2024-12-28',
  lastUpdated: '2025-11-20',
  milestones: [...],
  updates: [...]
};
```

### KRA Object
```typescript
const kra: KRA = {
  id: 'KRA001',
  name: 'Sales & Revenue Growth',
  description: '...',
  department: 'Sales',
  weight: 30, // percentage
  measurementCriteria: '...',
  status: 'Active', // or 'Inactive'
  createdDate: '2024-01-15',
  goals: 45 // count
};
```

## 🎨 Status Options

### Goal Status
- `'Not Started'` - Goal not yet begun
- `'In Progress'` - Work ongoing
- `'On Track'` - Progressing well ✅
- `'At Risk'` - Potential issues ⚠️
- `'Completed'` - Successfully finished ✅
- `'Overdue'` - Past deadline ❌
- `'Cancelled'` - Goal cancelled

### Priority Levels
- `'Critical'` - 🔴 Red - Highest priority
- `'High'` - 🟠 Orange - Important
- `'Medium'` - 🟡 Yellow - Normal
- `'Low'` - 🔵 Blue - Lower priority

### Goal Types
- `'Individual'` - Personal objectives
- `'Team'` - Collaborative objectives
- `'Organizational'` - Company-wide objectives

## 🔧 Common Operations

### Import Data
```typescript
import { goals, kras, goalStats } from '../../data/goalsData';
```

### Filter Goals
```typescript
const filteredGoals = goals.filter(goal => {
  return goal.status === 'On Track' && 
         goal.priority === 'High' &&
         goal.department === 'Sales';
});
```

### Calculate Progress
```typescript
const avgProgress = goals.reduce((sum, g) => sum + g.progress, 0) / goals.length;
```

### Get Goals by KRA
```typescript
const kraGoals = goals.filter(g => g.kraId === 'KRA001');
```

## 🌍 Translation Keys

### Common Keys
```typescript
// Goals
t('performance.goals.title')           // "Goals & KRAs"
t('performance.goals.createGoal')      // "Create Goal"
t('performance.goals.totalGoals')      // "Total Goals"

// KRAs
t('performance.kra.title')             // "Key Result Areas (KRAs)"
t('performance.kra.createKRA')         // "Create KRA"

// Status
t('performance.goals.onTrack')         // "On Track"
t('performance.goals.completed')       // "Completed"

// Priority
t('performance.goals.critical')        // "Critical"
t('performance.goals.high')            // "High"
```

### Using Translations
```typescript
import { useLanguage } from '../../contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return <h1>{t('performance.goals.title')}</h1>;
}
```

## 🎯 Component Props

### GoalsList
```typescript
<GoalsList
  onCreateGoal={() => {}}
  onViewGoal={(goalId) => {}}
  onManageKRAs={() => {}}
  onAssignGoal={() => {}}
/>
```

### CreateGoal
```typescript
// Create mode
<CreateGoal onBack={() => {}} />

// Edit mode
<CreateGoal 
  onBack={() => {}} 
  goal={existingGoal} 
/>
```

### GoalDetails
```typescript
<GoalDetails
  goalId="GOAL001"
  onBack={() => {}}
  onEdit={(goalId) => {}}
/>
```

### KRAManagement
```typescript
<KRAManagement
  onBack={() => {}}
  onCreateKRA={() => {}}
  onViewKRA={(kraId) => {}}
/>
```

## 📊 Stats Calculation

### Goal Statistics
```typescript
const stats = {
  totalGoals: goals.length,
  activeGoals: goals.filter(g => 
    ['In Progress', 'On Track'].includes(g.status)
  ).length,
  completedGoals: goals.filter(g => 
    g.status === 'Completed'
  ).length,
  atRiskGoals: goals.filter(g => 
    ['At Risk', 'Overdue'].includes(g.status)
  ).length,
  avgProgress: Math.round(
    goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
  ),
};
```

## 🎨 Status Badge Colors

### Using StatusBadge
```typescript
import { StatusBadge } from '../common';

const getStatusVariant = (status: string) => {
  const variants = {
    'Not Started': 'default',
    'In Progress': 'default',
    'On Track': 'success',
    'At Risk': 'warning',
    'Completed': 'success',
    'Overdue': 'destructive',
    'Cancelled': 'default',
  };
  return variants[status] || 'default';
};

<StatusBadge variant={getStatusVariant(goal.status)}>
  {goal.status}
</StatusBadge>
```

### Custom Badge Colors
```typescript
const getPriorityColor = (priority: string) => {
  const colors = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return colors[priority];
};

<Badge className={getPriorityColor(goal.priority)}>
  {goal.priority}
</Badge>
```

## 📅 Date Formatting

```typescript
// Short format
new Date(goal.endDate).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});
// Output: "Mar 31, 2025"

// Calculate days remaining
const daysRemaining = Math.ceil(
  (new Date(goal.endDate).getTime() - new Date().getTime()) 
  / (1000 * 60 * 60 * 24)
);
```

## 🔔 Toast Notifications

```typescript
import { toast } from '../../utils/toast';

// Success
toast.success(t('performance.goals.goalCreated'));

// Error
toast.error('Please fill all required fields');

// Info
toast.info('Goal updated successfully');
```

## ✅ Form Validation Example

```typescript
const validateForm = () => {
  const errors: Record<string, string> = {};
  
  if (!formData.title.trim()) {
    errors.title = 'Goal title is required';
  }
  
  if (!formData.targetValue.trim()) {
    errors.targetValue = 'Target value is required';
  }
  
  if (parseInt(formData.weight) < 1 || parseInt(formData.weight) > 100) {
    errors.weight = 'Weight must be between 1 and 100';
  }
  
  if (new Date(formData.endDate) <= new Date(formData.startDate)) {
    errors.endDate = 'End date must be after start date';
  }
  
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

## 🔍 Search & Filter Pattern

```typescript
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState('all');

const filteredGoals = useMemo(() => {
  return goals.filter(goal => {
    const matchesSearch = searchQuery === '' ||
      goal.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      goal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
}, [searchQuery, statusFilter]);
```

## 📱 Responsive Grid

```typescript
// Stats cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard {...} />
</div>

// Two-column layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

## 🛠️ Common Patterns

### Navigation State Management
```typescript
type View = 'list' | 'create' | 'edit' | 'details';
const [view, setView] = useState<View>('list');

// Navigate
setView('create');
setView('details');
```

### Confirmation Dialog
```typescript
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

<ConfirmDialog
  isOpen={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  onConfirm={handleDelete}
  title={t('performance.goals.deleteConfirmTitle')}
  message={t('performance.goals.deleteConfirmMessage')}
  confirmText={t('common.delete')}
  variant="danger"
/>
```

### Empty State
```typescript
<EmptyState
  icon={Target}
  title={t('performance.goals.noGoals')}
  description={t('performance.goals.noGoalsDescription')}
  action={{
    label: t('performance.goals.createGoal'),
    onClick: onCreateGoal,
  }}
/>
```

## 📖 Helpful Resources

### Files to Reference
- `/data/goalsData.ts` - Data structure examples
- `/components/performance/GoalsList.tsx` - Filtering example
- `/components/performance/CreateGoal.tsx` - Form validation
- `/translations/en/performance.ts` - All translation keys
- `/docs/GOALS_KRA_MODULE.md` - Full documentation

### Common Components
- `StatCard` - `/components/common/StatCard.tsx`
- `DataTable` - `/components/common/DataTable.tsx`
- `Pagination` - `/components/common/Pagination.tsx`
- `EmptyState` - `/components/common/EmptyState.tsx`

## 🐛 Troubleshooting

### Goal not displaying?
```typescript
// Check filters
console.log('Filtered goals:', filteredGoals.length);

// Check data
console.log('All goals:', goals.length);
```

### Translation not working?
```typescript
// Check if key exists
console.log(t('performance.goals.title'));

// Fallback to English
const { t, currentLang } = useLanguage();
```

### Progress bar not showing?
```typescript
// Ensure progress is 0-100
const validProgress = Math.min(100, Math.max(0, goal.progress));

<Progress value={validProgress} />
```

## 💡 Tips

1. **Always validate forms** before submission
2. **Use useMemo** for expensive filtering operations
3. **Reset page to 1** when filters change
4. **Show loading states** during operations
5. **Provide clear error messages**
6. **Use toast notifications** for feedback
7. **Implement confirmation dialogs** for destructive actions
8. **Keep components focused** - single responsibility
9. **Reuse common components** - don't reinvent
10. **Follow project patterns** - consistency is key

---

**Quick Reference Version:** 1.0.0  
**Last Updated:** November 27, 2025
