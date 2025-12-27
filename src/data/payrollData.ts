// UAE Payroll - Amounts in AED
export const payrollSummary = [
  {
    id: 'EMP001',
    name: 'Ahmed Al Hashimi',
    department: 'Engineering',
    basicSalary: 12000,
    allowances: 6000, // Housing + Transport
    deductions: 500,
    netSalary: 17500,
    status: 'Processed',
  },
  {
    id: 'EMP002',
    name: 'Rajesh Kumar',
    department: 'Engineering',
    basicSalary: 14000,
    allowances: 8000, // Housing + Transport
    deductions: 500,
    netSalary: 21500,
    status: 'Processed',
  },
  {
    id: 'EMP003',
    name: 'Sarah Johnson',
    department: 'Marketing',
    basicSalary: 18000,
    allowances: 10000, // Housing + Transport
    deductions: 500,
    netSalary: 27500,
    status: 'Processed',
  },
  {
    id: 'EMP004',
    name: 'Mohammed Al Ali',
    department: 'Sales',
    basicSalary: 10000,
    allowances: 5000, // Housing + Transport
    deductions: 500,
    netSalary: 14500,
    status: 'Pending',
  },
  {
    id: 'EMP005',
    name: 'Fatima Al Zaabi',
    department: 'HR',
    basicSalary: 20000,
    allowances: 12000, // Housing + Transport
    deductions: 500,
    netSalary: 31500,
    status: 'Processed',
  },
];

export const payrollStats = {
  totalPayroll: 22500000, // AED - Total monthly payroll
  processedCount: 245,
  pendingCount: 25,
  avgSalary: 18000, // AED average monthly salary
  totalDeductions: 135000, // AED - Much lower than India (no PF/ESI)
  totalBonuses: 450000, // AED
};

export const salaryDistribution = [
  { range: '0-10K AED', count: 45, color: '#ef4444' },
  { range: '10K-20K AED', count: 120, color: '#f59e0b' },
  { range: '20K-30K AED', count: 75, color: '#10b981' },
  { range: '30K+ AED', count: 30, color: '#3b82f6' },
];

export const monthlyPayrollTrend = [
  { month: 'Jan', amount: 21800000 }, // AED
  { month: 'Feb', amount: 22100000 }, // AED
  { month: 'Mar', amount: 22500000 }, // AED
  { month: 'Apr', amount: 22300000 }, // AED
  { month: 'May', amount: 22700000 }, // AED
  { month: 'Jun', amount: 23000000 }, // AED
];
