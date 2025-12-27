export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: 'Technical' | 'HR' | 'Payroll' | 'Leave' | 'IT Support' | 'Access Request' | 'Training' | 'Asset' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Waiting on Customer' | 'Resolved' | 'Closed' | 'Reopened';
  submittedBy: string;
  submittedByName: string;
  submittedByRole: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  dueDate: string;
  department: string;
  attachments: number;
  tags: string[];
  slaStatus: 'On Time' | 'Due Soon' | 'Overdue';
  responseTime?: string;
  resolutionTime?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: string;
  comment: string;
  isInternal: boolean;
  createdAt: string;
  attachments?: string[];
}

export const tickets: Ticket[] = [
  {
    id: 'TKT001',
    ticketNumber: '#TKT-2024-001',
    title: 'Unable to access payroll portal',
    description: 'I am unable to login to the payroll portal. Getting error message "Invalid credentials" even though I am using the correct password.',
    category: 'Payroll',
    priority: 'High',
    status: 'In Progress',
    submittedBy: 'EMP001',
    submittedByName: 'John Doe',
    submittedByRole: 'Software Engineer',
    assignedTo: 'ADM001',
    assignedToName: 'Sarah Johnson',
    createdAt: '2024-01-22T09:30:00',
    updatedAt: '2024-01-22T14:20:00',
    dueDate: '2024-01-24T18:00:00',
    department: 'Engineering',
    attachments: 2,
    tags: ['login-issue', 'payroll', 'urgent'],
    slaStatus: 'On Time',
    responseTime: '2 hours',
  },
  {
    id: 'TKT002',
    ticketNumber: '#TKT-2024-002',
    title: 'Leave request not approved after 5 days',
    description: 'I submitted a leave request for February 15-20, 2024 but it has not been approved yet. It has been 5 days since submission.',
    category: 'Leave',
    priority: 'Medium',
    status: 'Waiting on Customer',
    submittedBy: 'EMP002',
    submittedByName: 'Jane Smith',
    submittedByRole: 'Product Manager',
    assignedTo: 'ADM002',
    assignedToName: 'Michael Chen',
    createdAt: '2024-01-18T11:15:00',
    updatedAt: '2024-01-21T16:30:00',
    dueDate: '2024-01-25T18:00:00',
    department: 'Product',
    attachments: 0,
    tags: ['leave', 'approval-pending'],
    slaStatus: 'On Time',
    responseTime: '1 hour',
  },
  {
    id: 'TKT003',
    ticketNumber: '#TKT-2024-003',
    title: 'Laptop performance issues - very slow',
    description: 'My MacBook Pro has become extremely slow over the past week. Applications take forever to load and system freezes frequently.',
    category: 'IT Support',
    priority: 'High',
    status: 'Open',
    submittedBy: 'EMP003',
    submittedByName: 'Mike Johnson',
    submittedByRole: 'Marketing Manager',
    createdAt: '2024-01-23T08:45:00',
    updatedAt: '2024-01-23T08:45:00',
    dueDate: '2024-01-24T18:00:00',
    department: 'Marketing',
    attachments: 1,
    tags: ['laptop', 'performance', 'hardware'],
    slaStatus: 'Due Soon',
  },
  {
    id: 'TKT004',
    ticketNumber: '#TKT-2024-004',
    title: 'Request for training on new CRM system',
    description: 'Our team needs training on the new CRM system that was recently deployed. We need to understand the features and best practices.',
    category: 'Training',
    priority: 'Low',
    status: 'Open',
    submittedBy: 'EMP004',
    submittedByName: 'Emily Brown',
    submittedByRole: 'Sales Executive',
    createdAt: '2024-01-21T14:20:00',
    updatedAt: '2024-01-21T14:20:00',
    dueDate: '2024-01-28T18:00:00',
    department: 'Sales',
    attachments: 0,
    tags: ['training', 'crm', 'sales-team'],
    slaStatus: 'On Time',
  },
  {
    id: 'TKT005',
    ticketNumber: '#TKT-2024-005',
    title: 'VPN connection not working from home',
    description: 'Cannot connect to company VPN from home. Getting timeout error. Tried reinstalling the VPN client but issue persists.',
    category: 'IT Support',
    priority: 'Critical',
    status: 'In Progress',
    submittedBy: 'EMP005',
    submittedByName: 'Sarah Davis',
    submittedByRole: 'DevOps Engineer',
    assignedTo: 'ADM001',
    assignedToName: 'Sarah Johnson',
    createdAt: '2024-01-23T07:00:00',
    updatedAt: '2024-01-23T10:30:00',
    dueDate: '2024-01-23T12:00:00',
    department: 'Engineering',
    attachments: 3,
    tags: ['vpn', 'remote-access', 'critical'],
    slaStatus: 'Overdue',
    responseTime: '30 minutes',
  },
  {
    id: 'TKT006',
    ticketNumber: '#TKT-2024-006',
    title: 'Incorrect salary credited last month',
    description: 'My December salary was credited with an incorrect amount. Expected ₹85,000 but received ₹82,000. Please investigate.',
    category: 'Payroll',
    priority: 'Critical',
    status: 'Resolved',
    submittedBy: 'EMP006',
    submittedByName: 'Robert Wilson',
    submittedByRole: 'Senior Designer',
    assignedTo: 'ADM003',
    assignedToName: 'Priya Sharma',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-20T15:45:00',
    resolvedAt: '2024-01-20T15:45:00',
    dueDate: '2024-01-17T18:00:00',
    department: 'Design',
    attachments: 2,
    tags: ['payroll', 'salary', 'urgent'],
    slaStatus: 'On Time',
    responseTime: '1 hour',
    resolutionTime: '5 days',
  },
  {
    id: 'TKT007',
    ticketNumber: '#TKT-2024-007',
    title: 'Access to project repository needed',
    description: 'I need access to the "Project Phoenix" repository on GitHub. I have joined the project team but do not have repository access yet.',
    category: 'Access Request',
    priority: 'Medium',
    status: 'Resolved',
    submittedBy: 'EMP007',
    submittedByName: 'Lisa Anderson',
    submittedByRole: 'Software Engineer',
    assignedTo: 'ADM001',
    assignedToName: 'Sarah Johnson',
    createdAt: '2024-01-19T09:30:00',
    updatedAt: '2024-01-19T11:00:00',
    resolvedAt: '2024-01-19T11:00:00',
    dueDate: '2024-01-22T18:00:00',
    department: 'Engineering',
    attachments: 0,
    tags: ['access', 'github', 'repository'],
    slaStatus: 'On Time',
    responseTime: '30 minutes',
    resolutionTime: '1.5 hours',
  },
  {
    id: 'TKT008',
    ticketNumber: '#TKT-2024-008',
    title: 'Need additional monitor for workstation',
    description: 'Request for an additional 27" monitor for my workstation to improve productivity. Currently using a single monitor.',
    category: 'Asset',
    priority: 'Low',
    status: 'Open',
    submittedBy: 'EMP008',
    submittedByName: 'David Miller',
    submittedByRole: 'Data Analyst',
    createdAt: '2024-01-22T13:00:00',
    updatedAt: '2024-01-22T13:00:00',
    dueDate: '2024-01-29T18:00:00',
    department: 'Data Science',
    attachments: 0,
    tags: ['asset', 'monitor', 'equipment'],
    slaStatus: 'On Time',
  },
  {
    id: 'TKT009',
    ticketNumber: '#TKT-2024-009',
    title: 'Office AC not working properly',
    description: 'The air conditioning in Conference Room B is not working. Temperature is very high making meetings uncomfortable.',
    category: 'Other',
    priority: 'Medium',
    status: 'In Progress',
    submittedBy: 'EMP009',
    submittedByName: 'Amanda Taylor',
    submittedByRole: 'HR Manager',
    assignedTo: 'ADM004',
    assignedToName: 'Facilities Team',
    createdAt: '2024-01-23T11:30:00',
    updatedAt: '2024-01-23T12:15:00',
    dueDate: '2024-01-24T18:00:00',
    department: 'HR',
    attachments: 1,
    tags: ['facilities', 'ac', 'maintenance'],
    slaStatus: 'On Time',
    responseTime: '45 minutes',
  },
  {
    id: 'TKT010',
    ticketNumber: '#TKT-2024-010',
    title: 'Update my emergency contact information',
    description: 'Need to update my emergency contact details in HR records. Changed phone number and added alternate contact.',
    category: 'HR',
    priority: 'Low',
    status: 'Closed',
    submittedBy: 'EMP010',
    submittedByName: 'Chris Martin',
    submittedByRole: 'QA Engineer',
    assignedTo: 'ADM002',
    assignedToName: 'Michael Chen',
    createdAt: '2024-01-17T10:00:00',
    updatedAt: '2024-01-18T14:30:00',
    resolvedAt: '2024-01-18T14:00:00',
    closedAt: '2024-01-18T14:30:00',
    dueDate: '2024-01-24T18:00:00',
    department: 'Engineering',
    attachments: 0,
    tags: ['hr', 'contact-update', 'personal-info'],
    slaStatus: 'On Time',
    responseTime: '2 hours',
    resolutionTime: '1 day',
  },
];

export const ticketComments: TicketComment[] = [
  {
    id: 'CMT001',
    ticketId: 'TKT001',
    userId: 'ADM001',
    userName: 'Sarah Johnson',
    userRole: 'IT Admin',
    comment: 'I have received your ticket. Let me check your account status and reset your password.',
    isInternal: false,
    createdAt: '2024-01-22T11:30:00',
  },
  {
    id: 'CMT002',
    ticketId: 'TKT001',
    userId: 'EMP001',
    userName: 'John Doe',
    userRole: 'Software Engineer',
    comment: 'Thank you! I tried resetting it myself but it did not work.',
    isInternal: false,
    createdAt: '2024-01-22T12:00:00',
  },
  {
    id: 'CMT003',
    ticketId: 'TKT001',
    userId: 'ADM001',
    userName: 'Sarah Johnson',
    userRole: 'IT Admin',
    comment: 'Your account was locked due to multiple failed login attempts. I have unlocked it and sent you a password reset link to your email.',
    isInternal: false,
    createdAt: '2024-01-22T14:20:00',
  },
  {
    id: 'CMT004',
    ticketId: 'TKT002',
    userId: 'ADM002',
    userName: 'Michael Chen',
    userRole: 'HR Manager',
    comment: 'I checked with your manager and your leave has been approved. However, there was a system glitch that prevented the notification. Updating now.',
    isInternal: false,
    createdAt: '2024-01-21T16:30:00',
  },
  {
    id: 'CMT005',
    ticketId: 'TKT005',
    userId: 'ADM001',
    userName: 'Sarah Johnson',
    userRole: 'IT Admin',
    comment: 'Internal note: This seems to be related to the recent firewall update. Need to whitelist user IP.',
    isInternal: true,
    createdAt: '2024-01-23T09:00:00',
  },
  {
    id: 'CMT006',
    ticketId: 'TKT005',
    userId: 'ADM001',
    userName: 'Sarah Johnson',
    userRole: 'IT Admin',
    comment: 'I have whitelisted your IP address. Please try connecting to VPN again and let me know if it works.',
    isInternal: false,
    createdAt: '2024-01-23T10:30:00',
  },
  {
    id: 'CMT007',
    ticketId: 'TKT006',
    userId: 'ADM003',
    userName: 'Priya Sharma',
    userRole: 'Payroll Manager',
    comment: 'I have investigated the issue. The difference was due to a tax adjustment that was not communicated properly. I will process the correction and credit the remaining amount.',
    isInternal: false,
    createdAt: '2024-01-20T15:45:00',
  },
];

export const ticketStats = {
  totalTickets: 248,
  openTickets: 45,
  inProgressTickets: 32,
  resolvedTickets: 128,
  closedTickets: 38,
  overdueTickets: 8,
  avgResponseTime: '1.5 hours',
  avgResolutionTime: '2.3 days',
  satisfactionRate: 94,
};

export const ticketCategoryData = [
  { name: 'IT Support', value: 85, color: '#3b82f6' },
  { name: 'HR', value: 42, color: '#10b981' },
  { name: 'Payroll', value: 35, color: '#f59e0b' },
  { name: 'Leave', value: 28, color: '#8b5cf6' },
  { name: 'Access Request', value: 22, color: '#ec4899' },
  { name: 'Training', value: 18, color: '#06b6d4' },
  { name: 'Asset', value: 12, color: '#ef4444' },
  { name: 'Other', value: 6, color: '#6b7280' },
];

export const ticketPriorityData = [
  { name: 'Critical', value: 15, color: '#ef4444' },
  { name: 'High', value: 52, color: '#f59e0b' },
  { name: 'Medium', value: 98, color: '#3b82f6' },
  { name: 'Low', value: 83, color: '#10b981' },
];

export const ticketTrendData = [
  { month: 'Aug', created: 38, resolved: 35 },
  { month: 'Sep', created: 42, resolved: 40 },
  { month: 'Oct', created: 45, resolved: 43 },
  { month: 'Nov', created: 40, resolved: 42 },
  { month: 'Dec', created: 35, resolved: 38 },
  { month: 'Jan', created: 48, resolved: 30 },
];

export const assignees = [
  { id: 'ADM001', name: 'Sarah Johnson', role: 'IT Admin', activeTickets: 12 },
  { id: 'ADM002', name: 'Michael Chen', role: 'HR Manager', activeTickets: 8 },
  { id: 'ADM003', name: 'Priya Sharma', role: 'Payroll Manager', activeTickets: 6 },
  { id: 'ADM004', name: 'Facilities Team', role: 'Facilities', activeTickets: 4 },
  { id: 'ADM005', name: 'Rajesh Kumar', role: 'IT Support', activeTickets: 10 },
];
