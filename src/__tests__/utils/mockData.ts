/**
 * Mock data for testing
 */

export const mockEmployee = {
  id: '1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@company.com',
  phone: '+91 9876543210',
  department: 'Engineering',
  position: 'Senior Developer',
  joiningDate: '2023-01-15',
  salary: 75000,
  status: 'Active',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
};

export const mockEmployees = [
  mockEmployee,
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    phone: '+91 9876543211',
    department: 'Human Resources',
    position: 'HR Manager',
    joiningDate: '2022-06-10',
    salary: 65000,
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@company.com',
    phone: '+91 9876543212',
    department: 'Sales',
    position: 'Sales Executive',
    joiningDate: '2023-03-20',
    salary: 55000,
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
  },
];

export const mockAttendance = {
  id: '1',
  employeeId: '1',
  employeeName: 'Rajesh Kumar',
  date: '2024-11-27',
  checkIn: '09:00 AM',
  checkOut: '06:00 PM',
  status: 'Present',
  hours: '9h',
};

export const mockLeaveRequest = {
  id: '1',
  employeeId: '1',
  employeeName: 'Rajesh Kumar',
  leaveType: 'Casual Leave',
  startDate: '2024-12-01',
  endDate: '2024-12-03',
  days: 3,
  reason: 'Personal work',
  status: 'Pending',
  appliedDate: '2024-11-20',
};

export const mockPayroll = {
  id: '1',
  employeeId: '1',
  employeeName: 'Rajesh Kumar',
  month: 'November 2024',
  basicSalary: 75000,
  allowances: 10000,
  deductions: 5000,
  netSalary: 80000,
  status: 'Processed',
};

export const mockExpense = {
  id: '1',
  employeeId: '1',
  employeeName: 'Rajesh Kumar',
  category: 'Travel',
  amount: 5000,
  date: '2024-11-25',
  description: 'Client meeting travel',
  status: 'Pending',
  receipts: ['receipt1.pdf'],
};

export const mockCandidate = {
  id: '1',
  name: 'Sneha Reddy',
  email: 'sneha.reddy@email.com',
  phone: '+91 9876543213',
  position: 'Software Engineer',
  experience: '3 years',
  status: 'Interview Scheduled',
  appliedDate: '2024-11-15',
  resume: 'sneha_resume.pdf',
};

export const mockJobOpening = {
  id: '1',
  title: 'Senior Software Engineer',
  department: 'Engineering',
  location: 'Bangalore',
  type: 'Full-time',
  status: 'Active',
  applicants: 25,
  postedDate: '2024-11-01',
  description: 'Looking for an experienced software engineer...',
};

export const mockAsset = {
  id: '1',
  name: 'MacBook Pro',
  type: 'Laptop',
  serialNumber: 'MBP2023001',
  status: 'Assigned',
  assignedTo: 'Rajesh Kumar',
  assignedDate: '2023-01-15',
  purchaseDate: '2023-01-10',
  value: 150000,
};

export const mockTraining = {
  id: '1',
  title: 'Advanced React Development',
  trainer: 'John Doe',
  startDate: '2024-12-05',
  endDate: '2024-12-07',
  duration: '3 days',
  status: 'Scheduled',
  participants: 15,
  department: 'Engineering',
};

export const mockNotification = {
  id: '1',
  title: 'Leave Request Approved',
  message: 'Your leave request for Dec 1-3 has been approved',
  type: 'success',
  date: '2024-11-27 10:00 AM',
  read: false,
  category: 'Leave',
};

export const mockDocument = {
  id: '1',
  title: 'Employee Handbook 2024',
  type: 'Policy',
  category: 'HR',
  uploadDate: '2024-01-01',
  size: '2.5 MB',
  uploadedBy: 'HR Admin',
  department: 'All',
};
