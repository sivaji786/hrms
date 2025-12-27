export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: 'Travel' | 'Accommodation' | 'Food' | 'Transport' | 'Office Supplies' | 'Training' | 'Client Entertainment' | 'Other';
  amount: number;
  currency: string;
  date: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed';
  receipts: number;
  approver?: string;
  approvalDate?: string;
  reimbursementDate?: string;
  projectCode?: string;
  notes?: string;
}

export interface TravelRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  tripType: 'Domestic' | 'International';
  purpose: string;
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  estimatedCost: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  travelMode: 'Flight' | 'Train' | 'Bus' | 'Car';
  accommodationRequired: boolean;
  approver?: string;
  approvalDate?: string;
  actualCost?: number;
  notes?: string;
}

export const expenses: Expense[] = [
  {
    id: 'EXP001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    category: 'Travel',
    amount: 312,
    currency: 'AED',
    date: '2024-01-15',
    description: 'Flight tickets - Dubai to Abu Dhabi',
    status: 'Approved',
    receipts: 1,
    approver: 'Sarah Johnson',
    approvalDate: '2024-01-16',
    projectCode: 'PROJ-001',
  },
  {
    id: 'EXP002',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    department: 'Sales',
    category: 'Client Entertainment',
    amount: 154,
    currency: 'AED',
    date: '2024-01-18',
    description: 'Client dinner meeting',
    status: 'Pending',
    receipts: 2,
    projectCode: 'PROJ-002',
  },
  {
    id: 'EXP003',
    employeeId: 'EMP003',
    employeeName: 'Mike Johnson',
    department: 'Marketing',
    category: 'Accommodation',
    amount: 250,
    currency: 'AED',
    date: '2024-01-12',
    description: 'Hotel stay - 2 nights in Sharjah',
    status: 'Reimbursed',
    receipts: 1,
    approver: 'Michael Chen',
    approvalDate: '2024-01-14',
    reimbursementDate: '2024-01-20',
    projectCode: 'PROJ-003',
  },
  {
    id: 'EXP004',
    employeeId: 'EMP004',
    employeeName: 'Emily Brown',
    department: 'HR',
    category: 'Office Supplies',
    amount: 88,
    currency: 'AED',
    date: '2024-01-20',
    description: 'Stationery and office supplies',
    status: 'Approved',
    receipts: 3,
    approver: 'Sarah Johnson',
    approvalDate: '2024-01-21',
  },
  {
    id: 'EXP005',
    employeeId: 'EMP005',
    employeeName: 'Sarah Davis',
    department: 'Engineering',
    category: 'Training',
    amount: 551,
    currency: 'AED',
    date: '2024-01-10',
    description: 'AWS Certification exam fee',
    status: 'Reimbursed',
    receipts: 1,
    approver: 'Rajesh Kumar',
    approvalDate: '2024-01-11',
    reimbursementDate: '2024-01-18',
  },
  {
    id: 'EXP006',
    employeeId: 'EMP006',
    employeeName: 'Robert Wilson',
    department: 'Sales',
    category: 'Transport',
    amount: 66,
    currency: 'AED',
    date: '2024-01-22',
    description: 'Taxi for client meetings',
    status: 'Pending',
    receipts: 5,
    notes: 'Multiple client visits in a week',
  },
  {
    id: 'EXP007',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    category: 'Food',
    amount: 44,
    currency: 'AED',
    date: '2024-01-16',
    description: 'Team lunch during offsite',
    status: 'Approved',
    receipts: 1,
    approver: 'Sarah Johnson',
    approvalDate: '2024-01-17',
  },
  {
    id: 'EXP008',
    employeeId: 'EMP007',
    employeeName: 'Lisa Anderson',
    department: 'Design',
    category: 'Other',
    amount: 129,
    currency: 'AED',
    date: '2024-01-08',
    description: 'Design software subscription',
    status: 'Rejected',
    receipts: 1,
    approver: 'Michael Chen',
    approvalDate: '2024-01-09',
    notes: 'Rejected - Please use company account',
  },
];

export const travelRequests: TravelRequest[] = [
  {
    id: 'TRV001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    tripType: 'Domestic',
    purpose: 'Client meeting and product demo',
    from: 'Dubai',
    to: 'Abu Dhabi',
    startDate: '2024-02-05',
    endDate: '2024-02-07',
    estimatedCost: 918,
    status: 'Approved',
    travelMode: 'Flight',
    accommodationRequired: true,
    approver: 'Sarah Johnson',
    approvalDate: '2024-01-25',
  },
  {
    id: 'TRV002',
    employeeId: 'EMP003',
    employeeName: 'Mike Johnson',
    department: 'Marketing',
    tripType: 'Domestic',
    purpose: 'Marketing campaign planning',
    from: 'Sharjah',
    to: 'Fujairah',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    estimatedCost: 661,
    status: 'Pending',
    travelMode: 'Flight',
    accommodationRequired: true,
  },
  {
    id: 'TRV003',
    employeeId: 'EMP005',
    employeeName: 'Sarah Davis',
    department: 'Engineering',
    tripType: 'International',
    purpose: 'AWS Summit conference',
    from: 'Dubai',
    to: 'Singapore',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    estimatedCost: 4404,
    status: 'Pending',
    travelMode: 'Flight',
    accommodationRequired: true,
    notes: 'Conference pass already purchased',
  },
  {
    id: 'TRV004',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    department: 'Sales',
    tripType: 'Domestic',
    purpose: 'Sales training workshop',
    from: 'Abu Dhabi',
    to: 'Ajman',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    estimatedCost: 294,
    status: 'Completed',
    travelMode: 'Car',
    accommodationRequired: false,
    approver: 'Michael Chen',
    approvalDate: '2024-01-05',
    actualCost: 275,
  },
  {
    id: 'TRV005',
    employeeId: 'EMP006',
    employeeName: 'Robert Wilson',
    department: 'Sales',
    tripType: 'Domestic',
    purpose: 'Client presentation',
    from: 'Dubai',
    to: 'Ras Al Khaimah',
    startDate: '2024-02-01',
    endDate: '2024-02-02',
    estimatedCost: 441,
    status: 'Approved',
    travelMode: 'Flight',
    accommodationRequired: true,
    approver: 'Michael Chen',
    approvalDate: '2024-01-28',
  },
  {
    id: 'TRV006',
    employeeId: 'EMP004',
    employeeName: 'Emily Brown',
    department: 'HR',
    tripType: 'Domestic',
    purpose: 'Campus recruitment drive',
    from: 'Dubai',
    to: 'Sharjah',
    startDate: '2024-02-15',
    endDate: '2024-02-16',
    estimatedCost: 551,
    status: 'Rejected',
    travelMode: 'Car',
    accommodationRequired: true,
    approver: 'Sarah Johnson',
    approvalDate: '2024-01-30',
    notes: 'Rejected - Virtual interviews recommended',
  },
];

export const expenseStats = {
  totalExpenses: 248,
  pendingApproval: 32,
  approvedExpenses: 165,
  rejectedExpenses: 18,
  reimbursedExpenses: 142,
  totalAmount: 45705,
  pendingAmount: 6795,
  averageExpense: 184,
};

export const travelStats = {
  totalRequests: 86,
  pendingRequests: 12,
  approvedRequests: 48,
  completedTrips: 22,
  rejectedRequests: 4,
  totalEstimatedCost: 104670,
  totalActualCost: 96194,
  savings: 8442,
};

export const expenseCategoryData = [
  { name: 'Travel', value: 16515, color: '#3b82f6' },
  { name: 'Accommodation', value: 10280, color: '#10b981' },
  { name: 'Food', value: 4404, color: '#f59e0b' },
  { name: 'Transport', value: 3488, color: '#8b5cf6' },
  { name: 'Training', value: 6606, color: '#ef4444' },
  { name: 'Other', value: 4404, color: '#6b7280' },
];

export const monthlyExpenseData = [
  { month: 'Aug', amount: 6795 },
  { month: 'Sep', amount: 7710 },
  { month: 'Oct', amount: 7161 },
  { month: 'Nov', amount: 8258 },
  { month: 'Dec', amount: 8808 },
  { month: 'Jan', amount: 6975 },
];
