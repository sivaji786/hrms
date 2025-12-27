# Goals & KRA Module Documentation

## Overview

The Goals & KRA (Key Result Areas) module is a comprehensive performance management system that allows organizations to set, track, and manage employee goals aligned with organizational Key Result Areas. This module implements SMART goal methodology and provides end-to-end goal lifecycle management.

## Features

### 1. **Goals Management**
- Create and manage individual, team, and organizational goals
- Link goals to KRAs for strategic alignment
- Set SMART goals with clear measurement criteria
- Track goal progress with visual indicators
- Set priorities (Critical, High, Medium, Low)
- Define timelines with start and end dates
- Assign weights to goals for performance evaluation

### 2. **KRA Management**
- Define organizational Key Result Areas
- Department-specific or organization-wide KRAs
- Weight-based KRA importance
- Link multiple goals to each KRA
- Track KRA performance through linked goals

### 3. **Goal Assignment**
- Bulk goal assignment to multiple employees
- Filter employees by department
- Search functionality for quick employee selection
- Assignment summary and confirmation

### 4. **Progress Tracking**
- Visual progress bars
- Milestone tracking
- Progress updates with comments
- Timeline visualization
- Status tracking (Not Started, In Progress, On Track, At Risk, Completed, Overdue, Cancelled)

### 5. **Advanced Filtering & Search**
- Filter by status, priority, type, department, and KRA
- Full-text search across goals
- Combined filters for precise results
- Clear filters functionality

### 6. **Professional UI/UX**
- Breadcrumb navigation
- Stats cards with key metrics
- Responsive design
- Data tables with sorting and export
- Pagination for large datasets
- Empty states with helpful actions

## Components

### Core Components

#### 1. **Goals.tsx**
Main routing component that manages navigation between all goal-related views.

**Views:**
- `list` - Goals listing
- `create` - Create new goal
- `edit` - Edit existing goal
- `details` - View goal details
- `assign-goal` - Bulk goal assignment
- `kra-management` - KRA listing
- `kra-create` - Create new KRA
- `kra-edit` - Edit existing KRA
- `kra-details` - View KRA details

#### 2. **GoalsList.tsx**
Displays all goals with advanced filtering and search capabilities.

**Features:**
- Stats cards showing total, active, completed, and at-risk goals
- Advanced filters (status, priority, type, department, KRA)
- Search functionality
- Pagination
- Data table with sorting and export
- Empty states

**Props:**
```typescript
interface GoalsListProps {
  onCreateGoal: () => void;
  onViewGoal: (goalId: string) => void;
  onManageKRAs: () => void;
  onAssignGoal: () => void;
}
```

#### 3. **CreateGoal.tsx**
Form for creating and editing goals.

**Features:**
- Comprehensive form validation
- Employee selection
- KRA selection
- Goal type and priority selection
- Measurement criteria definition
- Timeline selection
- Weight assignment

**Props:**
```typescript
interface CreateGoalProps {
  onBack: () => void;
  goal?: Goal; // For edit mode
}
```

#### 4. **GoalDetails.tsx**
Detailed view of a single goal with progress tracking.

**Features:**
- Goal information display
- Progress visualization
- Employee and timeline information
- Milestone tracking
- Progress updates history
- Edit and delete actions

**Props:**
```typescript
interface GoalDetailsProps {
  goalId: string;
  onBack: () => void;
  onEdit: (goalId: string) => void;
}
```

#### 5. **KRAManagement.tsx**
Listing and management of Key Result Areas.

**Features:**
- KRA listing with stats
- Search functionality
- Data table with sorting
- Goals linked count
- Create, view, edit, and delete KRAs

**Props:**
```typescript
interface KRAManagementProps {
  onBack: () => void;
  onCreateKRA: () => void;
  onViewKRA: (kraId: string) => void;
}
```

#### 6. **CreateKRA.tsx**
Form for creating and editing KRAs.

**Features:**
- KRA name and description
- Department assignment
- Weight definition
- Measurement criteria
- Status management

**Props:**
```typescript
interface CreateKRAProps {
  onBack: () => void;
  kra?: KRA; // For edit mode
}
```

#### 7. **KRADetails.tsx**
Detailed view of a single KRA with linked goals.

**Features:**
- KRA information display
- Stats on linked goals
- Average progress calculation
- Linked goals table
- Edit and delete actions

**Props:**
```typescript
interface KRADetailsProps {
  kraId: string;
  onBack: () => void;
  onEdit: (kraId: string) => void;
  onViewGoal?: (goalId: string) => void;
}
```

#### 8. **AssignGoal.tsx**
Bulk goal assignment interface.

**Features:**
- Goal selection
- Employee multi-select
- Department filtering
- Search employees
- Assignment summary
- Bulk assignment confirmation

**Props:**
```typescript
interface AssignGoalProps {
  onBack: () => void;
}
```

## Data Structure

### Goal Interface
```typescript
interface Goal {
  id: string;
  title: string;
  description: string;
  employeeId: string;
  employeeName: string;
  department: string;
  kraId: string;
  kraName: string;
  type: 'Individual' | 'Team' | 'Organizational';
  measurementCriteria: string;
  targetValue: string;
  currentValue: string;
  progress: number; // 0-100
  startDate: string;
  endDate: string;
  weight: number; // percentage
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'On Track' | 'At Risk' | 'Completed' | 'Overdue' | 'Cancelled';
  assignedBy: string;
  assignedDate: string;
  lastUpdated: string;
  milestones?: GoalMilestone[];
  updates?: GoalUpdate[];
}
```

### KRA Interface
```typescript
interface KRA {
  id: string;
  name: string;
  description: string;
  department: string;
  weight: number; // percentage
  measurementCriteria: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
  goals: number; // count of goals linked
}
```

### GoalMilestone Interface
```typescript
interface GoalMilestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  completedDate?: string;
}
```

### GoalUpdate Interface
```typescript
interface GoalUpdate {
  id: string;
  date: string;
  updatedBy: string;
  comment: string;
  progress: number;
  attachments?: string[];
}
```

## Usage

### Integration in Performance Management

The Goals module is integrated into the Performance Management component as a tab:

```typescript
import Goals from './performance/Goals';

// In PerformanceManagement.tsx
<TabsContent value="goals">
  <Goals />
</TabsContent>
```

### Standalone Usage

You can also use the Goals module as a standalone component:

```typescript
import { Goals } from './components/performance';

function MyComponent() {
  return <Goals />;
}
```

## Workflow

### Goal Setting Process

1. **Navigate to Goals & KRAs tab** in Performance Management
2. **Click "Create Goal"** button
3. **Fill in goal details:**
   - Title and description
   - Assign to employee
   - Select KRA
   - Choose type (Individual/Team/Organizational)
   - Set priority
   - Define measurement criteria
   - Set target value
   - Assign weight
   - Set timeline
4. **Save goal** - Goal is created and assigned

### Goal Assignment Process

1. **Click "Assign Goal"** button
2. **Select goal** from dropdown
3. **Search/filter employees** by department
4. **Select employees** (single or bulk)
5. **Review assignment summary**
6. **Click "Assign Goals"** - Goals are assigned to selected employees

### KRA Management Process

1. **Click "Manage KRAs"** button
2. **View existing KRAs** with stats
3. **Create new KRA:**
   - Click "Create KRA"
   - Fill in KRA details
   - Save KRA
4. **View KRA details** to see linked goals
5. **Edit or delete KRAs** as needed

### Progress Tracking

1. **Navigate to goal details** by clicking on a goal
2. **View current progress** and milestones
3. **Add progress updates:**
   - Click "Add Update"
   - Enter progress percentage
   - Add comments
   - Attach files (optional)
4. **Track milestones** completion
5. **Monitor status** changes

## Translation Keys

All text in the module is internationalized. Key translation namespaces:

- `performance.goals.*` - Goal-specific translations
- `performance.kra.*` - KRA-specific translations
- `navigation.*` - Breadcrumb navigation
- `common.*` - Common actions (save, cancel, delete, etc.)

### Example Translation Usage

```typescript
const { t } = useLanguage();

// Goal translations
t('performance.goals.title') // "Goals & KRAs"
t('performance.goals.createGoal') // "Create Goal"
t('performance.goals.onTrack') // "On Track"

// KRA translations
t('performance.kra.title') // "Key Result Areas (KRAs)"
t('performance.kra.createKRA') // "Create KRA"
```

## Best Practices

### SMART Goals

Goals should follow the SMART criteria:
- **S**pecific - Clear and well-defined
- **M**easurable - Quantifiable metrics
- **A**chievable - Realistic and attainable
- **R**elevant - Aligned with KRAs and business objectives
- **T**ime-bound - Clear start and end dates

### KRA Design

- Limit to 5-8 KRAs per department/organization
- Ensure total weights sum to 100%
- Use clear measurement criteria
- Align with organizational strategy
- Review and update quarterly

### Goal Tracking

- Update progress regularly (weekly/bi-weekly)
- Document progress with detailed comments
- Use milestones for long-term goals (>3 months)
- Set realistic timelines
- Prioritize critical goals

### Performance Evaluation

- Weight goals based on importance
- Link all goals to KRAs
- Use consistent measurement criteria
- Track both quantitative and qualitative metrics
- Regular check-ins and feedback

## Reusable Components

The module uses standardized reusable components:

- **StatCard** - Displaying key metrics
- **DataTable** - Sortable, exportable tables
- **Pagination** - Page navigation
- **PageHeader** - Consistent page headers
- **FilterBar** - Advanced filtering
- **EmptyState** - No data states
- **ConfirmDialog** - Confirmation dialogs
- **Breadcrumbs** - Navigation breadcrumbs
- **StatusBadge** - Status indicators

## Future Enhancements

Potential improvements for the module:

1. **Goal Templates** - Pre-defined goal templates
2. **Goal Cascading** - Cascade organizational goals to teams and individuals
3. **OKR Support** - Objectives and Key Results framework
4. **Goal Dependencies** - Link dependent goals
5. **Notifications** - Alert on goal due dates and milestones
6. **Analytics Dashboard** - Visual analytics and insights
7. **Goal Alignment Map** - Visual representation of goal alignment
8. **Peer Collaboration** - Collaborative goal setting
9. **AI Suggestions** - AI-powered goal recommendations
10. **Integration** - Sync with project management tools

## Troubleshooting

### Common Issues

**Issue:** Goals not displaying
- Check data source in `goalsData.ts`
- Verify filtering logic
- Check console for errors

**Issue:** Progress not updating
- Ensure progress value is between 0-100
- Check update function implementation
- Verify data persistence

**Issue:** KRA not linking to goals
- Ensure KRA status is 'Active'
- Check KRA ID matching
- Verify KRA exists in data

## Support

For issues or questions about the Goals & KRA module:
1. Check this documentation
2. Review component source code
3. Check translation files for missing keys
4. Consult the development team

---

**Last Updated:** November 27, 2025
**Version:** 1.0.0
**Maintainer:** HR Tech Team
