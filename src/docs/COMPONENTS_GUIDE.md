# Components Guide

## Overview

This guide covers all the reusable components available in the HR Management System.

## Table of Contents

1. [Common Components](#common-components)
2. [shadcn/ui Components](#shadcnui-components)
3. [Module Components](#module-components)
4. [Creating Custom Components](#creating-custom-components)

## Common Components

### StatCard

A standardized card component for displaying statistics.

**Location:** `/components/common/index.tsx`

**Usage:**
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

**Props:**
- `title` (string): Card title
- `value` (string): Main statistic value
- `icon` (LucideIcon): Icon component from lucide-react
- `iconColor` (string): Tailwind color class for icon
- `trend` (object, optional): 
  - `value`: Percentage change
  - `isPositive`: Whether trend is positive
- `variant` ('default' | 'gradient'): Card style variant

**Variants:**
- `default`: Clean white card with subtle border
- `gradient`: Gradient background (legacy, use default)

### Pagination

Page navigation component for lists.

**Location:** `/components/Pagination.tsx`

**Usage:**
```tsx
import Pagination from './Pagination';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

**Props:**
- `currentPage` (number): Current active page
- `totalPages` (number): Total number of pages
- `onPageChange` (function): Callback when page changes

**Features:**
- Shows page numbers with ellipsis for large ranges
- Previous/Next buttons
- Highlights current page
- Disabled state for first/last pages

### LanguageSelector

Dropdown for language selection.

**Location:** `/components/LanguageSelector.tsx`

**Usage:**
```tsx
import LanguageSelector from './LanguageSelector';

<LanguageSelector />
```

**Features:**
- Displays current language with flag emoji
- Dropdown with all available languages
- Check mark for current selection
- Automatically saves preference

## shadcn/ui Components

All UI components are in `/components/ui/` directory.

### Button

```tsx
import { Button } from './ui/button';

<Button variant="default">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon className="h-4 w-4" />
</Button>
```

**Variants:**
- `default`: Primary blue button
- `outline`: Border only
- `ghost`: Transparent hover effect
- `destructive`: Red for delete actions
- `secondary`: Gray background
- `link`: Text button

### Input

```tsx
import { Input } from './ui/input';

<Input 
  type="text"
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

<Input type="email" />
<Input type="password" />
<Input type="number" />
<Input type="date" />
```

### Card

```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    {/* Tab 1 content */}
  </TabsContent>
  <TabsContent value="tab2">
    {/* Tab 2 content */}
  </TabsContent>
</Tabs>
```

### Dialog

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

**Note:** Project prefers page navigation over dialogs. Use Sheets for slide-in panels instead.

### Sheet

```tsx
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Sheet description</SheetDescription>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

**Sides:** `left`, `right`, `top`, `bottom`

### Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.value}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Badge

```tsx
import { Badge } from './ui/badge';

<Badge>Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>

{/* Custom colors */}
<Badge className="bg-green-100 text-green-700">Success</Badge>
```

### Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    This is an alert message.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  {/* Error alert */}
</Alert>
```

### Dropdown Menu

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleAction1}>
      Action 1
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleAction2}>
      Action 2
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Action 3</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Toast (Sonner)

```tsx
import toast from '@/utils/toast';

// Success
toast.success('Employee added successfully!');

// Error
toast.error('Failed to save changes');

// Info
toast.info('New notification received');

// Custom
toast('Custom message', {
  description: 'Additional details',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
});
```

### Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

<Avatar>
  <AvatarImage src="/path/to/image.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Calendar

```tsx
import { Calendar } from './ui/calendar';

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>
```

### Progress

```tsx
import { Progress } from './ui/progress';

<Progress value={75} />
```

### Checkbox

```tsx
import { Checkbox } from './ui/checkbox';

<Checkbox 
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>
```

### Switch

```tsx
import { Switch } from './ui/switch';

<Switch 
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

### Radio Group

```tsx
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

<RadioGroup value={value} onValueChange={setValue}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <label htmlFor="option1">Option 1</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <label htmlFor="option2">Option 2</label>
  </div>
</RadioGroup>
```

## Module Components

### Dashboard Components

**DashboardHome**
- Main dashboard overview
- Location-based filtering
- Stats cards with trends
- Charts and quick actions

**DashboardStats**
- Individual stat cards
- Trend indicators
- Icon support

### Employee Components

**EmployeeManagement**
- Main employee module
- Multi-tab interface
- Sub-view navigation

**EmployeeList**
- Paginated employee table
- Search and filters
- Action buttons

**EmployeeProfile**
- Detailed employee view
- Multi-section layout
- Quick actions

**AddEmployee**
- Employee creation form
- Validation
- Save/cancel actions

**EditEmployee**
- Employee editing form
- Pre-filled with existing data

### Attendance Components

**AttendanceTracking**
- Attendance overview
- Calendar view
- Analytics tab

**EmployeeAttendance**
- Individual employee attendance
- Monthly view
- Status tracking

### Leave Components

**LeaveManagement**
- Leave requests list
- Approval workflow
- Leave balance display

### Payroll Components

**PayrollManagement**
- Payroll processing
- Salary breakdown
- Payslip generation

## Creating Custom Components

### Component Template

```tsx
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface MyComponentProps {
  title: string;
  data: any[];
  onAction: (id: string) => void;
}

export default function MyComponent({ 
  title, 
  data, 
  onAction 
}: MyComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((item) => (
          <div key={item.id}>
            {item.name}
            <Button onClick={() => onAction(item.id)}>
              Action
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

### Best Practices

1. **Props Interface**
   - Always define TypeScript interface
   - Document complex props
   - Use descriptive names

2. **Reusability**
   - Make components flexible
   - Use props for customization
   - Avoid hardcoding values

3. **Composition**
   - Build with smaller components
   - Use children prop when appropriate
   - Follow single responsibility

4. **Styling**
   - Use Tailwind classes
   - Follow project conventions
   - Support responsive design

5. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels
   - Ensure keyboard navigation

## Component Patterns

### List with Actions

```tsx
<Table>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleView(item.id)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Search and Filter Bar

```tsx
<div className="flex items-center gap-4">
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <Input
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10"
    />
  </div>
  <Select value={filter} onValueChange={setFilter}>
    <SelectTrigger className="w-[200px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {/* Filter options */}
    </SelectContent>
  </Select>
  <Button variant="outline">
    <Download className="w-4 h-4 mr-2" />
    Export
  </Button>
</div>
```

### Empty State

```tsx
{data.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FileQuestion className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg mb-2">No data found</h3>
    <p className="text-sm text-gray-500 mb-4">
      Get started by adding your first item
    </p>
    <Button onClick={handleAdd}>
      <Plus className="w-4 h-4 mr-2" />
      Add Item
    </Button>
  </div>
) : (
  {/* Data display */}
)}
```

### Loading State

```tsx
{isLoading ? (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
) : (
  {/* Content */}
)}
```

## Icons

Using Lucide React icons:

```tsx
import { 
  Users, 
  Calendar, 
  Settings, 
  Bell,
  ChevronRight,
  // ... more icons
} from 'lucide-react';

<Users className="w-4 h-4" />
<Calendar className="w-5 h-5 text-blue-600" />
```

**Common Sizes:**
- `w-4 h-4`: Small (16px)
- `w-5 h-5`: Medium (20px)
- `w-6 h-6`: Large (24px)
- `w-8 h-8`: Extra Large (32px)

## Charts

Using Recharts library:

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

Available charts:
- BarChart
- LineChart
- PieChart
- AreaChart

## Summary

This component library provides:
- ✅ Consistent UI across the application
- ✅ Accessible components
- ✅ Responsive design
- ✅ Type-safe with TypeScript
- ✅ Easy to customize
- ✅ Well-documented

For more details on shadcn/ui components, visit [ui.shadcn.com](https://ui.shadcn.com)
