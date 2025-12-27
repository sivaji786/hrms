// Role types interface
export interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  color: string;
}

// User types interface
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
}

// Department types interface
export interface Department {
  id: string;
  name: string;
  employeeCount: number;
  manager: string;
}

// Roles data - translations will be applied in component using t()
export const roles: Omit<Role, 'name' | 'description'>[] = [
  {
    id: '1',
    name: 'admin.admin', // translation key
    description: 'admin.fullSystemAccess', // translation key
    usersCount: 3,
    permissions: ['all'],
    color: 'bg-red-100 text-red-700',
  },
  {
    id: '2',
    name: 'admin.hrManager', // translation key
    description: 'admin.manageEmployeesHR', // translation key
    usersCount: 5,
    permissions: ['employees', 'payroll', 'leave', 'attendance'],
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: '3',
    name: 'admin.manager', // translation key
    description: 'admin.manageTeam', // translation key
    usersCount: 12,
    permissions: ['team', 'attendance', 'leave'],
    color: 'bg-green-100 text-green-700',
  },
  {
    id: '4',
    name: 'admin.employee', // translation key
    description: 'admin.basicAccess', // translation key
    usersCount: 145,
    permissions: ['profile', 'attendance', 'leave'],
    color: 'bg-gray-100 text-gray-700',
  },
];

// Admin users data - role and status will be translated in component
export const adminUsers: Omit<AdminUser, 'role' | 'status'>[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    role: 'admin.admin', // translation key
    department: 'IT',
    status: 'admin.active', // translation key
    lastLogin: '2025-11-17 10:30 AM',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    role: 'admin.hrManager', // translation key
    department: 'HR',
    status: 'admin.active', // translation key
    lastLogin: '2025-11-17 09:15 AM',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit.kumar@company.com',
    role: 'admin.manager', // translation key
    department: 'Sales',
    status: 'admin.active', // translation key
    lastLogin: '2025-11-17 08:45 AM',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@company.com',
    role: 'admin.manager', // translation key
    department: 'Marketing',
    status: 'admin.active', // translation key
    lastLogin: '2025-11-17 09:00 AM',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@company.com',
    role: 'admin.employee', // translation key
    department: 'IT',
    status: 'admin.active', // translation key
    lastLogin: '2025-11-17 07:45 AM',
  },
  {
    id: '6',
    name: 'Emily Wilson',
    email: 'emily.wilson@company.com',
    role: 'admin.employee', // translation key
    department: 'Sales',
    status: 'admin.active', // translation key
    lastLogin: '2025-11-17 08:30 AM',
  },
  {
    id: '7',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    role: 'admin.manager', // translation key
    department: 'Engineering',
    status: 'admin.active', // translation key
    lastLogin: '2025-11-17 09:30 AM',
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    role: 'admin.hrManager', // translation key
    department: 'HR',
    status: 'admin.active', // translation key
    lastLogin: '2025-11-17 08:15 AM',
  },
];

// Departments data
export const departments: Department[] = [
  { id: '1', name: 'Engineering', employeeCount: 45, manager: 'Rahul Sharma' },
  { id: '2', name: 'Sales', employeeCount: 32, manager: 'Priya Patel' },
  { id: '3', name: 'Marketing', employeeCount: 18, manager: 'Amit Kumar' },
  { id: '4', name: 'HR', employeeCount: 8, manager: 'Sneha Reddy' },
  { id: '5', name: 'Operations', employeeCount: 25, manager: 'Vikram Singh' },
  { id: '6', name: 'Finance', employeeCount: 12, manager: 'Meera Iyer' },
  { id: '7', name: 'IT', employeeCount: 15, manager: 'David Brown' },
  { id: '8', name: 'Design', employeeCount: 10, manager: 'Anita Desai' },
];

// Department names only (for filters)
export const departmentNames = [
  'All Departments',
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Design',
  'IT',
];

// Employees for appraisal (subset of employee data)
export const appraisalEmployees = [
  { id: 'EMP001', name: 'Rahul Sharma', department: 'Engineering' },
  { id: 'EMP002', name: 'Priya Patel', department: 'Marketing' },
  { id: 'EMP003', name: 'Amit Kumar', department: 'Sales' },
  { id: 'EMP004', name: 'Sneha Reddy', department: 'HR' },
  { id: 'EMP005', name: 'Vikram Singh', department: 'Operations' },
  { id: 'EMP006', name: 'Anita Desai', department: 'Engineering' },
  { id: 'EMP007', name: 'Rajesh Khanna', department: 'Sales' },
  { id: 'EMP008', name: 'Meera Iyer', department: 'Finance' },
  { id: 'EMP009', name: 'Arjun Nair', department: 'Design' },
  { id: 'EMP010', name: 'Kavita Joshi', department: 'Marketing' },
  { id: 'EMP011', name: 'Suresh Babu', department: 'Engineering' },
  { id: 'EMP012', name: 'Neha Kapoor', department: 'HR' },
  { id: 'EMP013', name: 'Kiran Rao', department: 'Finance' },
  { id: 'EMP014', name: 'Sanjay Mehta', department: 'Sales' },
  { id: 'EMP015', name: 'Anjali Verma', department: 'Operations' },
];
