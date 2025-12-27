<?php

namespace App\Controllers;

use App\Models\AttendanceModel;
use CodeIgniter\API\ResponseTrait;

class AttendanceController extends ApiController
{
    // use ResponseTrait; // Inherited from ApiController

    protected $attendanceModel;

    public function __construct()
    {
        $this->attendanceModel = new AttendanceModel();
    }

    // Admin: View all attendance records
    public function index()
    {
        $data = $this->attendanceModel->findAll();
        return $this->respondSuccess($data);
    }

    // Admin: Get today's attendance for all employees
    public function getTodayAttendance()
    {
        $today = date('Y-m-d');
        
        // Get all employees
        $employeeModel = new \App\Models\EmployeeModel();
        $employees = $employeeModel->select('id, employee_code, first_name, last_name, email, department_id, designation')
                                   ->where('status', 'active')
                                   ->findAll();
        
        $result = [];
        foreach ($employees as $employee) {
            // Get attendance record for today
            $attendance = $this->attendanceModel->where('employee_id', $employee['id'])
                                                ->where('date', $today)
                                                ->first();
            
            $result[] = [
                'employee' => $employee,
                'attendance' => $attendance ?: null
            ];
        }
        
        return $this->respondSuccess($result);
    }

    // Admin: Get attendance for specific date
    public function getAttendanceByDate($date)
    {
        // Validate date format
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return $this->respondError('Invalid date format. Use YYYY-MM-DD', 400);
        }
        
        // Get all employees
        $employeeModel = new \App\Models\EmployeeModel();
        $employees = $employeeModel->select('id, employee_code, first_name, last_name, email, department_id, designation')
                                   ->where('status', 'active')
                                   ->findAll();
        
        $result = [];
        foreach ($employees as $employee) {
            // Get attendance record for the date
            $attendance = $this->attendanceModel->where('employee_id', $employee['id'])
                                                ->where('date', $date)
                                                ->first();
            
            $result[] = [
                'employee' => $employee,
                'attendance' => $attendance ?: null
            ];
        }
        
        return $this->respondSuccess($result);
    }

    // Admin: Update attendance record
    public function update($id)
    {
        $data = $this->getSecureJson();
        
        // Check if record exists
        $existing = $this->attendanceModel->find($id);
        if (!$existing) {
            return $this->respondError('Attendance record not found', 404);
        }
        
        // Update only allowed fields
        $updateData = [];
        if (isset($data['check_in'])) $updateData['check_in'] = $data['check_in'];
        if (isset($data['check_out'])) $updateData['check_out'] = $data['check_out'];
        if (isset($data['status'])) $updateData['status'] = $data['status'];
        if (isset($data['notes'])) $updateData['notes'] = $data['notes'];
        
        if (empty($updateData)) {
            return $this->respondError('No valid fields to update', 400);
        }
        
        if ($this->attendanceModel->update($id, $updateData)) {
            return $this->respondSuccess(null, 'Attendance updated successfully');
        }
        
        return $this->respondError('Failed to update attendance', 500, $this->attendanceModel->errors());
    }

    // Admin: Bulk create/update attendance records
    public function bulkUpsert()
    {
        $data = $this->getSecureJson();
        
        if (!isset($data['records']) || !is_array($data['records'])) {
            return $this->respondError('Invalid data format. Expected {"records": [...]}', 400);
        }
        
        $created = 0;
        $updated = 0;
        $errors = [];
        
        foreach ($data['records'] as $record) {
            if (!isset($record['employee_id']) || !isset($record['date'])) {
                $errors[] = 'Missing employee_id or date in record';
                continue;
            }
            
            // Check if record exists
            $existing = $this->attendanceModel->where('employee_id', $record['employee_id'])
                                              ->where('date', $record['date'])
                                              ->first();
            
            $attendanceData = [
                'employee_id' => $record['employee_id'],
                'date' => $record['date'],
                'check_in' => $record['check_in'] ?? null,
                'check_out' => $record['check_out'] ?? null,
                'status' => $record['status'] ?? 'present',
                'notes' => $record['notes'] ?? null,
            ];
            
            if ($existing) {
                // Update
                if ($this->attendanceModel->update($existing['id'], $attendanceData)) {
                    $updated++;
                } else {
                    $errors[] = "Failed to update record for employee {$record['employee_id']}";
                }
            } else {
                // Create
                if ($this->attendanceModel->insert($attendanceData)) {
                    $created++;
                } else {
                    $errors[] = "Failed to create record for employee {$record['employee_id']}";
                }
            }
        }
        
        return $this->respondSuccess([
            'created' => $created,
            'updated' => $updated,
            'errors' => $errors
        ], 'Bulk operation completed');
    }

    // Employee: Check-in
    public function checkIn()
    {
        $user = $this->getUser(); // Set by AuthFilter
        
        // Check if already checked in for today
        $today = date('Y-m-d');
        $existing = $this->attendanceModel->where('employee_id', $user->id) // Assuming user->id maps to employee_id for now, or we need to fetch employee record
                                          ->where('date', $today)
                                          ->first();

        if ($existing) {
            return $this->respondError('Already checked in for today', 400);
        }

        $data = [
            'employee_id' => $user->id, // In a real app, we'd look up the employee ID from the user ID
            'date'        => $today,
            'check_in'    => date('H:i:s'),
            'status'      => 'present', // Logic to determine late/on-time could go here
        ];

        if ($this->attendanceModel->insert($data)) {
            return $this->respondCreated(['id' => $this->attendanceModel->getInsertID(), ...$data], 'Check-in successful');
        }

        return $this->respondError('Failed to check in', 500, $this->attendanceModel->errors());
    }

    // Employee: Check-out
    public function checkOut()
    {
        $user = $this->getUser();
        $today = date('Y-m-d');

        $attendance = $this->attendanceModel->where('employee_id', $user->id)
                                            ->where('date', $today)
                                            ->first();

        if (! $attendance) {
            return $this->respondError('No check-in record found for today', 404);
        }

        if ($attendance['check_out']) {
            return $this->respondError('Already checked out for today', 400);
        }

        $data = [
            'check_out' => date('H:i:s'),
        ];

        if ($this->attendanceModel->update($attendance['id'], $data)) {
            return $this->respondSuccess(null, 'Check-out successful');
        }

        return $this->respondError('Failed to check out', 500, $this->attendanceModel->errors());
    }

    // Employee: View history
    public function history()
    {
        $user = $this->getUser();
        $data = $this->attendanceModel->where('employee_id', $user->id)
                                      ->orderBy('date', 'DESC')
                                      ->findAll();
        return $this->respondSuccess($data);
    }
    // Admin: View specific employee attendance
    public function getEmployeeAttendance($employeeId)
    {
        $month = $this->request->getGet('month');
        $year = $this->request->getGet('year');

        $query = $this->attendanceModel->where('employee_id', $employeeId);

        if ($month && $year) {
            $startDate = "$year-$month-01";
            $endDate = date('Y-m-t', strtotime($startDate));
            $query->where('date >=', $startDate)
                  ->where('date <=', $endDate);
        }

        $data = $query->orderBy('date', 'ASC')->findAll();
        
        // Calculate summary
        $summary = [
            'present' => 0,
            'absent' => 0,
            'leave' => 0,
            'halfDay' => 0,
            'attendanceRate' => 0
        ];

        foreach ($data as $record) {
            $status = strtolower($record['status']);
            if ($status === 'present') $summary['present']++;
            elseif ($status === 'absent') $summary['absent']++;
            elseif ($status === 'leave') $summary['leave']++;
            elseif ($status === 'half day') $summary['halfDay']++;
        }

        $totalDays = count($data);
        if ($totalDays > 0) {
            $summary['attendanceRate'] = round(($summary['present'] / $totalDays) * 100, 1);
        }

        return $this->respondSuccess([
            'attendance' => $data,
            'summary' => $summary
        ]);
    }
}
