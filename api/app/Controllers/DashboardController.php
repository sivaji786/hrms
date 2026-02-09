<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\EmployeeModel;
use App\Models\AttendanceModel;
use App\Models\LeaveModel;
use App\Models\PayrollModel;

class DashboardController extends ApiController
{
    public function getStats()
    {
        $employeeModel = new EmployeeModel();
        $attendanceModel = new AttendanceModel();
        $leaveModel = new LeaveModel();
        $payrollModel = new PayrollModel();
        $locationModel = new \App\Models\LocationModel();

        $location = $this->request->getGet('location');

        // Base query for employees
        $allEmployees = $employeeModel->findAll();
        
        $employees = $allEmployees;
        if ($location && $location !== 'All Locations') {
            $employees = array_filter($allEmployees, function($e) use ($location) {
                return isset($e['location']) && $e['location'] === $location;
            });
        }
        
        $totalEmployees = count($employees);
        $employeeIds = array_column($employees, 'id');
        
        // Present Today
        $today = date('Y-m-d');
        if (!empty($employeeIds)) {
            $attendanceCount = $attendanceModel->where('date', $today)
                                              ->whereIn('employee_id', $employeeIds)
                                              ->whereIn('status', ['Present', 'Late', 'Half Day'])
                                              ->countAllResults();
            $presentToday = $attendanceCount;
        } else {
            $presentToday = 0;
        }
        
        // On Leave Today
        if (!empty($employeeIds)) {
            $onLeave = $leaveModel->where('start_date <=', $today)
                                 ->where('end_date >=', $today)
                                 ->where('status', 'Approved')
                                 ->whereIn('employee_id', $employeeIds)
                                 ->countAllResults();
        } else {
            $onLeave = 0;
        }

        // Monthly Payroll
        $currentMonth = date('n');
        $currentYear = date('Y');
        
        $payrollQuery = $payrollModel->where('month', $currentMonth)
                                     ->where('year', $currentYear);
        
        if (!empty($employeeIds)) {
            $payrollQuery->whereIn('employee_id', $employeeIds);
        } else if ($location && $location !== 'All Locations') {
            // No employees in this location
            $payrollQuery->where('employee_id', 'none');
        }
        
        $payrollRecords = $payrollQuery->findAll();
        
        $monthlyPayroll = 0;
        foreach ($payrollRecords as $record) {
            $monthlyPayroll += $record['net_salary'] ?? 0;
        }

        // Location Counts
        $allLocations = $locationModel->findAll();
        $locationCounts = [];
        foreach ($allLocations as $loc) {
            $locationCounts[$loc['name']] = 0;
        }
        foreach ($allEmployees as $emp) {
            $loc = $emp['location'] ?? 'Unknown';
            if (isset($locationCounts[$loc])) {
                $locationCounts[$loc]++;
            }
        }
        $locationCounts['All Locations'] = count($allEmployees);

        // Department Distribution
        $departmentCounts = [];
        foreach ($employees as $emp) {
            $dept = $emp['department'] ?? 'Unknown';
            if (!isset($departmentCounts[$dept])) $departmentCounts[$dept] = 0;
            $departmentCounts[$dept]++;
        }
        
        $departmentData = [];
        $colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];
        $i = 0;
        foreach ($departmentCounts as $name => $value) {
            $departmentData[] = [
                'name' => $name,
                'value' => $value,
                'color' => $colors[$i % count($colors)]
            ];
            $i++;
        }

        return $this->respondSuccess([
            'stats' => [
                'totalEmployees' => $totalEmployees,
                'presentToday' => $presentToday,
                'onLeave' => $onLeave,
                'monthlyPayroll' => $monthlyPayroll,
                'presentPercentage' => $totalEmployees > 0 ? number_format(($presentToday / $totalEmployees) * 100, 1) : 0,
                'leavePercentage' => $totalEmployees > 0 ? number_format(($onLeave / $totalEmployees) * 100, 1) : 0,
            ],
            'locationCounts' => $locationCounts,
            'departmentData' => $departmentData,
            'attendanceData' => $this->getAttendanceData($totalEmployees, $employeeIds),
            'leaveData' => $this->getLeaveData($employeeIds),
            'recentActivities' => $this->getRecentActivities($employeeIds),
            'upcomingEvents' => $this->getUpcomingEvents($employeeIds)
        ]);
    }

    private function getAttendanceData($totalEmployees, $employeeIds = [])
    {
        $attendanceModel = new AttendanceModel();
        $weeklyData = [];
        
        // Get last 5 working days (excluding weekends)
        $daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        $today = new \DateTime();
        
        // Find the most recent Monday
        $dayOfWeek = $today->format('N'); // 1 (Monday) to 7 (Sunday)
        if ($dayOfWeek > 5) {
            // If today is Saturday or Sunday, go back to last Friday
            $today->modify('-' . ($dayOfWeek - 5) . ' days');
        }
        
        // Start from Monday of current week
        $monday = clone $today;
        $monday->modify('-' . ($dayOfWeek - 1) . ' days');
        
        foreach ($daysOfWeek as $index => $day) {
            $date = clone $monday;
            $date->modify('+' . $index . ' days');
            $dateStr = $date->format('Y-m-d');
            
            // Get attendance for this day
            $query = $attendanceModel->where('date', $dateStr);
            if (!empty($employeeIds)) {
                $query->whereIn('employee_id', $employeeIds);
            }
            $attendance = $query->findAll();
            
            $present = 0;
            $absent = 0;
            
            foreach ($attendance as $record) {
                if (in_array($record['status'], ['Present', 'Late', 'Half Day'])) {
                    $present++;
                } else if ($record['status'] === 'Absent') {
                    $absent++;
                }
            }
            
            $weeklyData[] = [
                'name' => $day,
                'present' => $present,
                'absent' => $absent
            ];
        }
        
        return $weeklyData;
    }

    private function getLeaveData($employeeIds = [])
    {
        $leaveModel = new LeaveModel();
        $leaveData = [];
        
        // Get last 6 months
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $currentMonth = (int)date('n'); // 1-12
        $currentYear = (int)date('Y');
        
        for ($i = 5; $i >= 0; $i--) {
            $monthNum = $currentMonth - $i;
            $year = $currentYear;
            
            if ($monthNum <= 0) {
                $monthNum += 12;
                $year--;
            }
            
            $monthName = $months[$monthNum - 1];
            
            // Get leave counts for this month
            $query = $leaveModel->where('MONTH(start_date)', $monthNum)
                                 ->where('YEAR(start_date)', $year)
                                 ->where('status', 'Approved');
            
            if (!empty($employeeIds)) {
                $query->whereIn('employee_id', $employeeIds);
            }
            
            $leaves = $query->findAll();
            
            $casual = 0;
            $sick = 0;
            $privilege = 0;
            
            foreach ($leaves as $leave) {
                $type = $leave['leave_type'] ?? '';
                if (stripos($type, 'casual') !== false) {
                    $casual++;
                } else if (stripos($type, 'sick') !== false) {
                    $sick++;
                } else if (stripos($type, 'privilege') !== false || stripos($type, 'earned') !== false) {
                    $privilege++;
                }
            }
            
            $leaveData[] = [
                'month' => $monthName,
                'casual' => $casual,
                'sick' => $sick,
                'privilege' => $privilege
            ];
        }
        
        return $leaveData;
    }

    private function getRecentActivities($employeeIds = [])
    {
        $activities = [];
        $employeeModel = new EmployeeModel();
        $leaveModel = new LeaveModel();
        $attendanceModel = new AttendanceModel();

        // New Hires
        $hireQuery = $employeeModel->select('employees.*, departments.name as department_name')
            ->join('departments', 'departments.id = employees.department_id', 'left');
        
        if (!empty($employeeIds)) {
            $hireQuery->whereIn('employees.id', $employeeIds);
        }
        
        $newHires = $hireQuery->orderBy('created_at', 'DESC')->limit(5)->find();

        foreach ($newHires as $hire) {
            $activities[] = [
                'type' => 'New Hire',
                'employee' => $hire['first_name'] . ' ' . $hire['last_name'],
                'department' => $hire['department_name'] ?? 'Unknown',
                'time' => $this->timeAgo($hire['created_at']),
                'timestamp' => strtotime($hire['created_at']),
                'icon' => 'Users',
                'color' => 'bg-green-100 text-green-600'
            ];
        }

        // Approved Leaves
        $leaveQuery = $leaveModel->select('leave_requests.*, employees.first_name, employees.last_name, departments.name as department_name')
            ->join('employees', 'employees.id = leave_requests.employee_id')
            ->join('departments', 'departments.id = employees.department_id', 'left')
            ->where('leave_requests.status', 'Approved');
        
        if (!empty($employeeIds)) {
            $leaveQuery->whereIn('leave_requests.employee_id', $employeeIds);
        }
        
        $leaves = $leaveQuery->orderBy('approval_date', 'DESC')->limit(5)->find();

        foreach ($leaves as $leave) {
            $activities[] = [
                'type' => 'Leave Approved',
                'employee' => $leave['first_name'] . ' ' . $leave['last_name'],
                'department' => $leave['department_name'] ?? 'Unknown',
                'time' => $this->timeAgo($leave['approval_date']),
                'timestamp' => strtotime($leave['approval_date']),
                'icon' => 'Calendar',
                'color' => 'bg-blue-100 text-blue-600'
            ];
        }

        // Late Arrivals
        $attQuery = $attendanceModel->select('attendance_records.*, employees.first_name, employees.last_name, departments.name as department_name')
            ->join('employees', 'employees.id = attendance_records.employee_id')
            ->join('departments', 'departments.id = employees.department_id', 'left')
            ->where('attendance_records.status', 'Late');
        
        if (!empty($employeeIds)) {
            $attQuery->whereIn('attendance_records.employee_id', $employeeIds);
        }
        
        $attendance = $attQuery->orderBy('created_at', 'DESC')->limit(5)->find();

        foreach ($attendance as $att) {
            $activities[] = [
                'type' => 'Late Arrival',
                'employee' => $att['first_name'] . ' ' . $att['last_name'],
                'department' => $att['department_name'] ?? 'Unknown',
                'time' => $this->timeAgo($att['created_at']),
                'timestamp' => strtotime($att['created_at']),
                'icon' => 'AlertCircle',
                'color' => 'bg-orange-100 text-orange-600'
            ];
        }
        
        // Exits (Resigned)
        $exitQuery = $employeeModel->select('employees.*, departments.name as department_name')
            ->join('departments', 'departments.id = employees.department_id', 'left')
            ->where('status', 'Resigned');
        
        if (!empty($employeeIds)) {
            $exitQuery->whereIn('employees.id', $employeeIds);
        }
            
        $exits = $exitQuery->orderBy('updated_at', 'DESC')->limit(5)->find();
            
        foreach ($exits as $exit) {
             $activities[] = [
                'type' => 'Exit Process',
                'employee' => $exit['first_name'] . ' ' . $exit['last_name'],
                'department' => $exit['department_name'] ?? 'Unknown',
                'time' => $this->timeAgo($exit['updated_at']),
                'timestamp' => strtotime($exit['updated_at']),
                'icon' => 'UserX',
                'color' => 'bg-red-100 text-red-600'
            ];
        }

        // Sort by timestamp desc
        usort($activities, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });

        return array_slice($activities, 0, 5);
    }

    private function getUpcomingEvents($employeeIds = [])
    {
        $events = [];
        $trainingModel = new \App\Models\TrainingProgramModel();
        $reviewModel = new \App\Models\PerformanceReviewModel();
        $employeeModel = new EmployeeModel();

        // Training
        $programs = $trainingModel->where('start_date >=', date('Y-m-d'))
            ->orderBy('start_date', 'ASC')
            ->limit(5)
            ->find();

        foreach ($programs as $prog) {
            $type = 'Training';
            if (strpos($prog['title'], 'Meeting') !== false) $type = 'Meeting';
            
            $events[] = [
                'title' => $prog['title'],
                'date' => date('M j, Y', strtotime($prog['start_date'])),
                'timestamp' => strtotime($prog['start_date']),
                'type' => $type
            ];
        }

        // Performance Cycles
        $reviews = $reviewModel->where('start_date >=', date('Y-m-d'))
            ->orderBy('start_date', 'ASC')
            ->limit(5)
            ->find();

        foreach ($reviews as $rev) {
            $events[] = [
                'title' => 'Appraisal Cycle ' . $rev['cycle_name'],
                'date' => date('M j', strtotime($rev['start_date'])) . ' - ' . date('j, Y', strtotime($rev['end_date'])),
                'timestamp' => strtotime($rev['start_date']),
                'type' => 'Performance'
            ];
        }
        
        // Onboarding
        $onboardQuery = $employeeModel->where('date_of_joining >=', date('Y-m-d'));
        if (!empty($employeeIds)) {
            $onboardQuery->whereIn('id', $employeeIds);
        }
            
        $newJoiners = $onboardQuery->orderBy('date_of_joining', 'ASC')->limit(5)->find();
            
        foreach ($newJoiners as $joiner) {
            $events[] = [
                'title' => 'New Joiner Onboarding',
                'date' => date('M j, Y', strtotime($joiner['date_of_joining'])),
                'timestamp' => strtotime($joiner['date_of_joining']),
                'type' => 'Onboarding'
            ];
        }

        // Sort by timestamp asc
        usort($events, function($a, $b) {
            return $a['timestamp'] - $b['timestamp'];
        });

        return array_slice($events, 0, 5);
    }

    public function getEmployeeStats()
    {
        $user = self::$currentUser;
        if (!$user) {
            return $this->failUnauthorized();
        }

        $employeeId = $user->employee_id ?? null;
        if (!$employeeId) {
            // Check if user has an employee record
            $userModel = new \App\Models\UserModel();
            $userData = $userModel->find($user->id);
            $employeeId = $userData['employee_id'] ?? null;
        }

        if (!$employeeId) {
            return $this->respond([
                'employee' => [
                    'firstName' => $user->username ?? 'User',
                    'lastName' => '',
                    'code' => ''
                ],
                'leave' => ['total' => 0, 'pending' => 0],
                'attendance' => ['rate' => 0],
                'payroll' => ['net' => 0],
                'recentActivities' => [],
                'upcomingEvents' => []
            ]);
        }
        
        $leaveModel = new \App\Models\LeaveModel();
        $attendanceModel = new \App\Models\AttendanceModel();
        $payrollModel = new \App\Models\PayrollModel();
        $employeeModel = new \App\Models\EmployeeModel();

        $employee = $employeeModel->find($employeeId);

        // Leave Balance
        $leaveBalance = $leaveModel->where('employee_id', $employeeId)
                                  ->where('status', 'Approved')
                                  ->countAllResults();
        
        $totalEntitlement = 24; 
        $remainingLeave = $totalEntitlement - $leaveBalance;

        // Attendance Rate for current month
        $month = date('n');
        $year = date('Y');
        
        $presentDays = $attendanceModel->where('employee_id', $employeeId)
                                      ->where('MONTH(date)', $month)
                                      ->where('YEAR(date)', $year)
                                      ->whereIn('status', ['Present', 'Late', 'Half Day'])
                                      ->countAllResults();
        
        $daysInMonth = date('t');
        $attendanceRate = $daysInMonth > 0 ? round(($presentDays / $daysInMonth) * 100) : 0;

        // Last Salary
        $lastPayroll = $payrollModel->where('employee_id', $employeeId)
                                    ->orderBy('year', 'DESC')
                                    ->orderBy('month', 'DESC')
                                    ->first();
        $netSalary = $lastPayroll['net_salary'] ?? 0;

        // Recent Activities for this employee
        $activities = [];
        
        // Recent Leaves
        $recentLeaves = $leaveModel->where('employee_id', $employeeId)
                                  ->orderBy('created_at', 'DESC')
                                  ->limit(3)
                                  ->findAll();
        foreach ($recentLeaves as $leave) {
            $activities[] = [
                'id' => 'leave_' . $leave['id'],
                'action' => 'Leave Request ' . $leave['status'],
                'description' => 'Your leave request for ' . date('M j', strtotime($leave['start_date'])) . ' has been ' . strtolower($leave['status']),
                'time' => $this->timeAgo($leave['updated_at'] ?? $leave['created_at']),
                'icon' => 'Calendar',
                'timestamp' => strtotime($leave['updated_at'] ?? $leave['created_at'])
            ];
        }

        // Recent Payslips
        if ($lastPayroll) {
            $activities[] = [
                'id' => 'payroll_' . $lastPayroll['id'],
                'action' => 'Payslip Generated',
                'description' => date('F Y', mktime(0, 0, 0, $lastPayroll['month'], 10)) . ' payslip is now available',
                'time' => $this->timeAgo($lastPayroll['created_at']),
                'icon' => 'DollarSign',
                'timestamp' => strtotime($lastPayroll['created_at'])
            ];
        }

        // Sort activities
        usort($activities, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });

        $employee = $employeeModel->find($employeeId);

        return $this->respondSuccess([
            'employee' => [
                'firstName' => $employee['first_name'] ?? '',
                'lastName' => $employee['last_name'] ?? '',
                'code' => $employee['employee_code'] ?? ''
            ],
            'leave' => [
                'total' => $remainingLeave,
                'pending' => $leaveModel->where('employee_id', $employeeId)->where('status', 'Pending')->countAllResults()
            ],
            'attendance' => [
                'rate' => $attendanceRate
            ],
            'payroll' => [
                'net' => $netSalary
            ],
            'recentActivities' => array_slice($activities, 0, 5),
            'upcomingEvents' => $this->getUpcomingEvents()
        ]);
    }

    private function timeAgo($datetime)
    {
        $time = strtotime($datetime);
        $diff = time() - $time;

        if ($diff < 60) return 'Just now';
        if ($diff < 3600) return floor($diff / 60) . ' mins ago';
        if ($diff < 86400) return floor($diff / 3600) . ' hours ago';
        return floor($diff / 86400) . ' days ago';
    }
}
