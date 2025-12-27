import { employees, generateAttendanceData, generatePayrollData } from './employeeData';
import { leaveRequests, leaveBalance } from './leaveData';
import { performanceReviews } from './performanceData';
import { trainingPrograms, trainingEnrollments } from './trainingData';
import { expenses } from './expenseData';
import { tickets } from './ticketData';

/**
 * Get employee data by email (for login)
 */
export const getEmployeeByEmail = (email: string) => {
  return employees.find(emp => emp.email === email);
};

/**
 * Get employee data by ID
 */
export const getEmployeeById = (empId: string) => {
  return employees.find(emp => emp.id === empId);
};

/**
 * Get employee personal info for profile
 */
export const getEmployeePersonalInfo = (empId: string) => {
  const employee = getEmployeeById(empId);
  if (!employee) return null;

  return {
    fullName: employee.name,
    employeeId: empId,
    email: employee.email,
    phone: employee.phone,
    dateOfBirth: employee.dateOfBirth,
    gender: employee.gender,
    address: employee.address,
    nationality: employee.nationality,
    maritalStatus: employee.maritalStatus,
  };
};

/**
 * Get employee employment info for profile
 */
export const getEmployeeEmploymentInfo = (empId: string) => {
  const employee = getEmployeeById(empId);
  if (!employee) return null;

  return {
    department: employee.department,
    position: employee.role,
    employmentType: employee.employmentType,
    joinDate: employee.joinDate,
    reportingTo: employee.manager,
    location: `${employee.location} Office`,
    workSchedule: employee.workSchedule,
  };
};

/**
 * Get employee emergency contact info
 */
export const getEmployeeEmergencyContact = (empId: string) => {
  const employee = getEmployeeById(empId);
  if (!employee) return null;

  return {
    name: employee.emergencyContactName || 'Not Set',
    relationship: employee.emergencyContactRelation || 'Not Set',
    phone: employee.emergencyContact,
    email: employee.email.replace(employee.name.toLowerCase().replace(' ', '.'), employee.emergencyContactName?.toLowerCase().replace(' ', '.') || 'emergency'),
  };
};

/**
 * Get employee attendance data
 */
export const getEmployeeAttendanceData = (empId: string, month: number, year: number) => {
  return generateAttendanceData(empId, month, year);
};

/**
 * Get employee leave requests
 */
export const getEmployeeLeaveRequests = (empId: string) => {
  return leaveRequests.filter(req => req.empId === empId);
};

/**
 * Get employee leave balance
 */
export const getEmployeeLeaveBalance = (empId: string) => {
  const balance = leaveBalance.find(bal => bal.empId === empId);
  if (!balance) {
    return {
      casual: 12,
      sick: 12,
      privilege: 20,
      compensatory: 0,
    };
  }
  return {
    casual: balance.casual,
    sick: balance.sick,
    privilege: balance.privilege,
    compensatory: balance.compensatory,
  };
};

/**
 * Get employee payslips
 */
export const getEmployeePayslips = (empId: string) => {
  return generatePayrollData(empId);
};

/**
 * Get employee performance data
 */
export const getEmployeePerformance = (empId: string) => {
  const employee = getEmployeeById(empId);
  if (!employee) return null;

  // Filter performance data for this employee
  const employeePerformance = performanceReviews.filter(
    perf => perf.employeeId === empId || perf.employeeName === employee.name
  );

  return employeePerformance.length > 0 ? employeePerformance : null;
};

/**
 * Get employee training data
 */
export const getEmployeeTraining = (empId: string) => {
  const employee = getEmployeeById(empId);
  if (!employee) return [];

  // Filter training data for this employee
  // Filter training data for this employee
  const enrolledProgramIds = trainingEnrollments
    .filter(enrollment => enrollment.employeeId === empId || enrollment.employeeName === employee.name)
    .map(enrollment => enrollment.programId);

  return trainingPrograms.filter(program => enrolledProgramIds.includes(program.id));
};

/**
 * Get employee expense data
 */
export const getEmployeeExpenses = (empId: string) => {
  const employee = getEmployeeById(empId);
  if (!employee) return [];

  // Filter expense data for this employee
  return expenses.filter(
    expense => expense.employeeId === empId || expense.employeeName === employee.name
  );
};

/**
 * Get employee tickets
 */
export const getEmployeeTickets = (empId: string) => {
  const employee = getEmployeeById(empId);
  if (!employee) return [];

  // Filter tickets for this employee
  return tickets.filter(
    ticket => ticket.submittedBy === empId || ticket.submittedByName === employee.name
  );
};

/**
 * Get employee dashboard stats
 */
export const getEmployeeDashboardStats = (empId: string) => {
  const employee = getEmployeeById(empId);
  if (!employee) return null;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Get attendance for current month
  const attendanceData = generateAttendanceData(empId, currentMonth, currentYear);

  // Get leave balance
  const balance = getEmployeeLeaveBalance(empId);
  const totalLeaveBalance = balance.casual + balance.sick + balance.privilege + balance.compensatory;

  // Get leave requests
  const leaves = getEmployeeLeaveRequests(empId);
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  // Get payroll data
  const payroll = generatePayrollData(empId);

  return {
    attendance: {
      present: attendanceData.summary.present,
      absent: attendanceData.summary.absent,
      late: 0, // Could be calculated from attendance data
      onTime: attendanceData.summary.present,
      rate: attendanceData.summary.attendanceRate,
    },
    leave: {
      total: totalLeaveBalance,
      used: 25 - totalLeaveBalance, // Assuming 25 is the annual quota
      pending: pendingLeaves,
      approved: leaves.filter(l => l.status === 'Approved').length,
    },
    payroll: {
      gross: payroll.currentSalary.grossSalary,
      net: payroll.currentSalary.netSalary,
      deductions: payroll.currentSalary.totalDeductions,
      ytd: payroll.currentSalary.netSalary * (new Date().getMonth() + 1),
    },
  };
};

/**
 * Get current logged-in employee ID
 * In a real app, this would come from authentication context
 */
export const CURRENT_EMPLOYEE_ID = 'EMP001'; // John Smith
export const CURRENT_EMPLOYEE_EMAIL = 'john.smith@company.com';