import { AttendancePunch } from '../utils/attendanceCalculations';

// Face recognition device punch data - employees can check in/out multiple times
export interface EmployeeAttendancePunches {
  id: string;
  name: string;
  department: string;
  location: string;
  punches: AttendancePunch[]; // Multiple check-ins and check-outs from face recognition device
  manualOverride?: {
    status: 'On Leave' | 'Absent' | 'Weekend' | 'Holiday';
    notes?: string;
  };
}

// Today's attendance with multiple punches per employee
export const todayAttendancePunches: EmployeeAttendancePunches[] = [
  {
    id: 'EMP001',
    name: 'John Smith',
    department: 'Engineering',
    location: 'New York Office',
    punches: [
      { time: '09:05 AM', type: 'in' },
      { time: '01:00 PM', type: 'out' },
      { time: '02:00 PM', type: 'in' },
      { time: '06:15 PM', type: 'out' },
    ],
  },
  {
    id: 'EMP002',
    name: 'Rahul Sharma',
    department: 'Engineering',
    location: 'Dubai Office',
    punches: [
      { time: '08:55 AM', type: 'in' },
      { time: '12:30 PM', type: 'out' },
      { time: '01:30 PM', type: 'in' },
      { time: '06:15 PM', type: 'out' },
    ],
  },
  {
    id: 'EMP003',
    name: 'Priya Patel',
    department: 'Marketing',
    location: 'Abu Dhabi Office',
    punches: [
      { time: '09:20 AM', type: 'in' },
      { time: '01:00 PM', type: 'out' },
      { time: '02:00 PM', type: 'in' },
      // Still working - no final check-out yet
    ],
  },
  {
    id: 'EMP004',
    name: 'Amit Kumar',
    department: 'Sales',
    location: 'Work from Home',
    punches: [
      { time: '10:30 AM', type: 'in' }, // Late arrival
      { time: '01:00 PM', type: 'out' },
      { time: '02:00 PM', type: 'in' },
      { time: '06:30 PM', type: 'out' },
    ],
  },
  {
    id: 'EMP005',
    name: 'Sneha Reddy',
    department: 'HR',
    location: 'Sharjah Office',
    punches: [
      { time: '09:00 AM', type: 'in' },
      { time: '01:00 PM', type: 'out' },
      { time: '02:00 PM', type: 'in' },
      { time: '06:00 PM', type: 'out' },
    ],
  },
  {
    id: 'EMP006',
    name: 'Vikram Singh',
    department: 'Operations',
    location: '-',
    punches: [],
    manualOverride: {
      status: 'Absent',
    },
  },
  {
    id: 'EMP007',
    name: 'Anjali Desai',
    department: 'Finance',
    location: 'Dubai Office',
    punches: [
      { time: '09:10 AM', type: 'in' },
      { time: '11:00 AM', type: 'out' }, // Short break
      { time: '11:15 AM', type: 'in' },
      { time: '01:00 PM', type: 'out' },
      { time: '02:00 PM', type: 'in' },
      { time: '06:20 PM', type: 'out' },
    ],
  },
  {
    id: 'EMP008',
    name: 'Karan Mehta',
    department: 'Engineering',
    location: 'Dubai Office',
    punches: [
      { time: '08:55 AM', type: 'in' },
      { time: '01:00 PM', type: 'out' },
      { time: '02:00 PM', type: 'in' },
      { time: '05:50 PM', type: 'out' },
    ],
  },
  {
    id: 'EMP009',
    name: 'Neha Gupta',
    department: 'Design',
    location: 'Work from Home',
    punches: [
      { time: '09:15 AM', type: 'in' },
      { time: '01:00 PM', type: 'out' },
      { time: '02:00 PM', type: 'in' },
      // Still working
    ],
  },
  {
    id: 'EMP010',
    name: 'Rohan Kumar',
    department: 'Engineering',
    location: '-',
    punches: [],
    manualOverride: {
      status: 'On Leave',
      notes: 'Approved sick leave',
    },
  },
  {
    id: 'EMP011',
    name: 'Pooja Iyer',
    department: 'Marketing',
    location: 'Abu Dhabi Office',
    punches: [
      { time: '09:30 AM', type: 'in' },
      { time: '02:00 PM', type: 'out' }, // Early exit - half day
    ],
  },
  {
    id: 'EMP012',
    name: 'Arjun Nair',
    department: 'Sales',
    location: 'Ajman Office',
    punches: [
      { time: '09:05 AM', type: 'in' },
      { time: '01:00 PM', type: 'out' },
      { time: '02:00 PM', type: 'in' },
      { time: '06:10 PM', type: 'out' },
    ],
  },
  {
    id: 'EMP013',
    name: 'Divya Menon',
    department: 'HR',
    location: 'Sharjah Office',
    punches: [
      { time: '09:00 AM', type: 'in' },
      { time: '12:30 PM', type: 'out' },
      { time: '01:30 PM', type: 'in' },
      { time: '06:00 PM', type: 'out' },
    ],
  },
];

// Legacy format for backward compatibility (deprecated)
export const todayAttendance = [
  {
    id: 'EMP001',
    name: 'John Smith',
    department: 'Engineering',
    checkIn: '09:05 AM',
    checkOut: '06:15 PM',
    status: 'Present',
    location: 'New York Office',
    workHours: '9h 10m',
  },
  {
    id: 'EMP002',
    name: 'Rahul Sharma',
    department: 'Engineering',
    checkIn: '09:05 AM',
    checkOut: '06:15 PM',
    status: 'Present',
    location: 'Dubai Office',
    workHours: '9h 10m',
  },
  {
    id: 'EMP003',
    name: 'Priya Patel',
    department: 'Marketing',
    checkIn: '09:20 AM',
    checkOut: '-',
    status: 'Present',
    location: 'Abu Dhabi Office',
    workHours: '5h 45m',
  },
  {
    id: 'EMP004',
    name: 'Amit Kumar',
    department: 'Sales',
    checkIn: '10:30 AM',
    checkOut: '06:00 PM',
    status: 'Late',
    location: 'Work from Home',
    workHours: '7h 30m',
  },
  {
    id: 'EMP005',
    name: 'Sneha Reddy',
    department: 'HR',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    status: 'Present',
    location: 'Sharjah Office',
    workHours: '9h 0m',
  },
  {
    id: 'EMP006',
    name: 'Vikram Singh',
    department: 'Operations',
    checkIn: '-',
    checkOut: '-',
    status: 'Absent',
    location: '-',
    workHours: '0h 0m',
  },
  {
    id: 'EMP007',
    name: 'Anjali Desai',
    department: 'Finance',
    checkIn: '09:10 AM',
    checkOut: '06:20 PM',
    status: 'Present',
    location: 'Dubai Office',
    workHours: '9h 10m',
  },
  {
    id: 'EMP008',
    name: 'Karan Mehta',
    department: 'Engineering',
    checkIn: '08:55 AM',
    checkOut: '05:50 PM',
    status: 'Present',
    location: 'Dubai Office',
    workHours: '8h 55m',
  },
  {
    id: 'EMP009',
    name: 'Neha Gupta',
    department: 'Design',
    checkIn: '09:15 AM',
    checkOut: '-',
    status: 'Remote',
    location: 'Work from Home',
    workHours: '6h 30m',
  },
  {
    id: 'EMP010',
    name: 'Rohan Kumar',
    department: 'Engineering',
    checkIn: '-',
    checkOut: '-',
    status: 'On Leave',
    location: '-',
    workHours: '0h 0m',
  },
  {
    id: 'EMP011',
    name: 'Pooja Iyer',
    department: 'Marketing',
    checkIn: '09:30 AM',
    checkOut: '02:00 PM',
    status: 'Early Exit',
    location: 'Abu Dhabi Office',
    workHours: '4h 30m',
  },
  {
    id: 'EMP012',
    name: 'Arjun Nair',
    department: 'Sales',
    checkIn: '09:05 AM',
    checkOut: '06:10 PM',
    status: 'Present',
    location: 'Ajman Office',
    workHours: '9h 5m',
  },
  {
    id: 'EMP013',
    name: 'Divya Menon',
    department: 'HR',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    status: 'Present',
    location: 'Sharjah Office',
    workHours: '9h 0m',
  },
];

export const attendanceTrendData = [
  { date: '12 Nov', present: 245, absent: 8, late: 12 },
  { date: '13 Nov', present: 252, absent: 5, late: 8 },
  { date: '14 Nov', present: 248, absent: 10, late: 7 },
  { date: '15 Nov', present: 255, absent: 3, late: 7 },
  { date: '16 Nov', present: 250, absent: 7, late: 8 },
  { date: '17 Nov', present: 258, absent: 2, late: 5 },
  { date: 'Today', present: 260, absent: 3, late: 2 },
];

export const departmentAttendanceData = [
  { name: 'Engineering', present: 85, total: 90, rate: 94.4, color: '#3b82f6' },
  { name: 'Marketing', present: 28, total: 30, rate: 93.3, color: '#8b5cf6' },
  { name: 'Sales', present: 48, total: 52, rate: 92.3, color: '#10b981' },
  { name: 'HR', present: 14, total: 15, rate: 93.3, color: '#f59e0b' },
  { name: 'Finance', present: 22, total: 24, rate: 91.7, color: '#ef4444' },
  { name: 'Operations', present: 38, total: 42, rate: 90.5, color: '#06b6d4' },
];

export const monthlyTrendData = [
  { month: 'Jun', attendance: 94.2, avgWorkHours: 8.9 },
  { month: 'Jul', attendance: 93.8, avgWorkHours: 9.1 },
  { month: 'Aug', attendance: 94.5, avgWorkHours: 9.0 },
  { month: 'Sep', attendance: 95.1, avgWorkHours: 9.2 },
  { month: 'Oct', attendance: 94.8, avgWorkHours: 9.1 },
  { month: 'Nov', attendance: 95.2, avgWorkHours: 9.0 },
];

export const generateMonthlyAttendance = (month: number, year: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();
  const totalEmployees = 270;
  
  const days = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const isPast = date < today;
    const isToday = date.toDateString() === today.toDateString();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;
    
    if (!isWeekend && (isPast || isToday)) {
      // Generate realistic attendance numbers
      present = Math.floor(totalEmployees * (0.88 + Math.random() * 0.10)); // 88-98%
      late = Math.floor(Math.random() * 8) + 2; // 2-10 late
      halfDay = Math.floor(Math.random() * 3); // 0-2 half days
      absent = totalEmployees - present - late - halfDay;
    }
    
    days.push({
      day,
      date: dateStr,
      present,
      absent,
      late,
      halfDay,
      isPast,
      isToday,
      isWeekend,
    });
  }
  
  return days;
};

export const attendanceStats = {
  todayPresent: 260,
  todayAbsent: 3,
  todayLate: 2,
  todayOnLeave: 5,
  avgAttendanceRate: 95.2,
  totalEmployees: 270,
  weeklyData: [
    { day: 'Mon', present: 245, late: 12, absent: 8 },
    { day: 'Tue', present: 252, late: 8, absent: 5 },
    { day: 'Wed', present: 248, late: 7, absent: 10 },
    { day: 'Thu', present: 255, late: 7, absent: 3 },
    { day: 'Fri', present: 250, late: 8, absent: 7 },
    { day: 'Sat', present: 258, late: 5, absent: 2 },
    { day: 'Sun', present: 260, late: 2, absent: 3 },
  ],
  shiftSchedule: [
    { shift: 'General Shift', timing: '09:00 AM - 06:00 PM', employees: 1050, present: 980, status: 'Active' },
    { shift: 'Early Shift', timing: '07:00 AM - 04:00 PM', employees: 85, present: 79, status: 'Active' },
    { shift: 'Late Shift', timing: '12:00 PM - 09:00 PM', employees: 63, present: 58, status: 'Active' },
    { shift: 'Night Shift', timing: '10:00 PM - 07:00 AM', employees: 50, present: 47, status: 'Active' },
  ],
  overtimeRecords: [
    { name: 'Rahul Sharma', empId: 'EMP001', date: '2025-11-15', hours: 3, amount: 'AED 550', status: 'Approved', department: 'Engineering' },
    { name: 'Priya Patel', empId: 'EMP002', date: '2025-11-14', hours: 2, amount: 'AED 440', status: 'Pending', department: 'Product' },
    { name: 'Karan Mehta', empId: 'EMP007', date: '2025-11-13', hours: 4, amount: 'AED 730', status: 'Approved', department: 'Engineering' },
    { name: 'Anjali Desai', empId: 'EMP006', date: '2025-11-12', hours: 2.5, amount: 'AED 460', status: 'Pending', department: 'Design' },
    { name: 'Vikram Singh', empId: 'EMP003', date: '2025-11-11', hours: 3.5, amount: 'AED 640', status: 'Approved', department: 'Engineering' },
    { name: 'Neha Kapoor', empId: 'EMP004', date: '2025-11-10', hours: 2, amount: 'AED 370', status: 'Rejected', department: 'Marketing' },
    { name: 'Amit Kumar', empId: 'EMP005', date: '2025-11-10', hours: 5, amount: 'AED 920', status: 'Approved', department: 'Engineering' },
    { name: 'Sneha Reddy', empId: 'EMP008', date: '2025-11-09', hours: 1.5, amount: 'AED 275', status: 'Pending', department: 'HR' },
    { name: 'Rohan Joshi', empId: 'EMP009', date: '2025-11-08', hours: 3, amount: 'AED 550', status: 'Approved', department: 'Sales' },
    { name: 'Pooja Gupta', empId: 'EMP010', date: '2025-11-08', hours: 2.5, amount: 'AED 460', status: 'Approved', department: 'Finance' },
    { name: 'Arjun Nair', empId: 'EMP011', date: '2025-11-07', hours: 4, amount: 'AED 730', status: 'Pending', department: 'Engineering' },
    { name: 'Divya Shah', empId: 'EMP012', date: '2025-11-06', hours: 1, amount: 'AED 185', status: 'Rejected', department: 'Product' },
    { name: 'Harsh Verma', empId: 'EMP013', date: '2025-11-06', hours: 3.5, amount: 'AED 640', status: 'Approved', department: 'Engineering' },
    { name: 'Kavya Iyer', empId: 'EMP014', date: '2025-11-05', hours: 2, amount: 'AED 370', status: 'Approved', department: 'Design' },
    { name: 'Manish Dubey', empId: 'EMP015', date: '2025-11-04', hours: 5, amount: 'AED 920', status: 'Pending', department: 'Engineering' },
    { name: 'Sanjana Pillai', empId: 'EMP016', date: '2025-11-03', hours: 2.5, amount: 'AED 460', status: 'Approved', department: 'Marketing' },
    { name: 'Ravi Krishnan', empId: 'EMP017', date: '2025-11-02', hours: 3, amount: 'AED 550', status: 'Approved', department: 'Engineering' },
    { name: 'Meera Chopra', empId: 'EMP018', date: '2025-11-01', hours: 4, amount: 'AED 730', status: 'Pending', department: 'Sales' },
    { name: 'Nikhil Rao', empId: 'EMP019', date: '2025-10-31', hours: 1.5, amount: 'AED 275', status: 'Approved', department: 'Engineering' },
    { name: 'Tanvi Malhotra', empId: 'EMP020', date: '2025-10-30', hours: 2, amount: 'AED 370', status: 'Rejected', department: 'HR' },
  ],
};