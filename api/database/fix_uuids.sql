-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Define new UUIDs
SET @uuid_admin1 = UUID();
SET @uuid_admin2 = UUID();
SET @uuid_admin3 = UUID();
SET @uuid_emp1 = UUID();
SET @uuid_emp2 = UUID();
SET @uuid_emp3 = UUID();

-- Update admin-emp-001
UPDATE employees SET id = @uuid_admin1 WHERE id = 'admin-emp-001';
UPDATE users SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE asset_assignments SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE attendance_records SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE documents SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE employee_shifts SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE employees SET manager_id = @uuid_admin1 WHERE manager_id = 'admin-emp-001';
UPDATE expenses SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE expenses SET approver_id = @uuid_admin1 WHERE approver_id = 'admin-emp-001';
UPDATE goals SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE interviews SET interviewer_id = @uuid_admin1 WHERE interviewer_id = 'admin-emp-001';
UPDATE leave_balances SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE leave_requests SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE leave_requests SET approver_id = @uuid_admin1 WHERE approver_id = 'admin-emp-001';
UPDATE payroll_records SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE performance_reviews SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE performance_reviews SET reviewer_id = @uuid_admin1 WHERE reviewer_id = 'admin-emp-001';
UPDATE salary_structures SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE tickets SET requester_id = @uuid_admin1 WHERE requester_id = 'admin-emp-001';
UPDATE tickets SET assignee_id = @uuid_admin1 WHERE assignee_id = 'admin-emp-001';
UPDATE training_enrollments SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE travel_requests SET employee_id = @uuid_admin1 WHERE employee_id = 'admin-emp-001';
UPDATE travel_requests SET approver_id = @uuid_admin1 WHERE approver_id = 'admin-emp-001';

-- Update admin-emp-002
UPDATE employees SET id = @uuid_admin2 WHERE id = 'admin-emp-002';
UPDATE users SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE asset_assignments SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE attendance_records SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE documents SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE employee_shifts SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE employees SET manager_id = @uuid_admin2 WHERE manager_id = 'admin-emp-002';
UPDATE expenses SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE expenses SET approver_id = @uuid_admin2 WHERE approver_id = 'admin-emp-002';
UPDATE goals SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE interviews SET interviewer_id = @uuid_admin2 WHERE interviewer_id = 'admin-emp-002';
UPDATE leave_balances SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE leave_requests SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE leave_requests SET approver_id = @uuid_admin2 WHERE approver_id = 'admin-emp-002';
UPDATE payroll_records SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE performance_reviews SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE performance_reviews SET reviewer_id = @uuid_admin2 WHERE reviewer_id = 'admin-emp-002';
UPDATE salary_structures SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE tickets SET requester_id = @uuid_admin2 WHERE requester_id = 'admin-emp-002';
UPDATE tickets SET assignee_id = @uuid_admin2 WHERE assignee_id = 'admin-emp-002';
UPDATE training_enrollments SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE travel_requests SET employee_id = @uuid_admin2 WHERE employee_id = 'admin-emp-002';
UPDATE travel_requests SET approver_id = @uuid_admin2 WHERE approver_id = 'admin-emp-002';

-- Update admin-emp-003
UPDATE employees SET id = @uuid_admin3 WHERE id = 'admin-emp-003';
UPDATE users SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE asset_assignments SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE attendance_records SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE documents SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE employee_shifts SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE employees SET manager_id = @uuid_admin3 WHERE manager_id = 'admin-emp-003';
UPDATE expenses SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE expenses SET approver_id = @uuid_admin3 WHERE approver_id = 'admin-emp-003';
UPDATE goals SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE interviews SET interviewer_id = @uuid_admin3 WHERE interviewer_id = 'admin-emp-003';
UPDATE leave_balances SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE leave_requests SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE leave_requests SET approver_id = @uuid_admin3 WHERE approver_id = 'admin-emp-003';
UPDATE payroll_records SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE performance_reviews SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE performance_reviews SET reviewer_id = @uuid_admin3 WHERE reviewer_id = 'admin-emp-003';
UPDATE salary_structures SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE tickets SET requester_id = @uuid_admin3 WHERE requester_id = 'admin-emp-003';
UPDATE tickets SET assignee_id = @uuid_admin3 WHERE assignee_id = 'admin-emp-003';
UPDATE training_enrollments SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE travel_requests SET employee_id = @uuid_admin3 WHERE employee_id = 'admin-emp-003';
UPDATE travel_requests SET approver_id = @uuid_admin3 WHERE approver_id = 'admin-emp-003';

-- Update emp-001
UPDATE employees SET id = @uuid_emp1 WHERE id = 'emp-001';
UPDATE users SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE asset_assignments SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE attendance_records SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE documents SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE employee_shifts SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE employees SET manager_id = @uuid_emp1 WHERE manager_id = 'emp-001';
UPDATE expenses SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE expenses SET approver_id = @uuid_emp1 WHERE approver_id = 'emp-001';
UPDATE goals SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE interviews SET interviewer_id = @uuid_emp1 WHERE interviewer_id = 'emp-001';
UPDATE leave_balances SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE leave_requests SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE leave_requests SET approver_id = @uuid_emp1 WHERE approver_id = 'emp-001';
UPDATE payroll_records SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE performance_reviews SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE performance_reviews SET reviewer_id = @uuid_emp1 WHERE reviewer_id = 'emp-001';
UPDATE salary_structures SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE tickets SET requester_id = @uuid_emp1 WHERE requester_id = 'emp-001';
UPDATE tickets SET assignee_id = @uuid_emp1 WHERE assignee_id = 'emp-001';
UPDATE training_enrollments SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE travel_requests SET employee_id = @uuid_emp1 WHERE employee_id = 'emp-001';
UPDATE travel_requests SET approver_id = @uuid_emp1 WHERE approver_id = 'emp-001';

-- Update emp-002
UPDATE employees SET id = @uuid_emp2 WHERE id = 'emp-002';
UPDATE users SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE asset_assignments SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE attendance_records SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE documents SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE employee_shifts SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE employees SET manager_id = @uuid_emp2 WHERE manager_id = 'emp-002';
UPDATE expenses SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE expenses SET approver_id = @uuid_emp2 WHERE approver_id = 'emp-002';
UPDATE goals SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE interviews SET interviewer_id = @uuid_emp2 WHERE interviewer_id = 'emp-002';
UPDATE leave_balances SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE leave_requests SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE leave_requests SET approver_id = @uuid_emp2 WHERE approver_id = 'emp-002';
UPDATE payroll_records SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE performance_reviews SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE performance_reviews SET reviewer_id = @uuid_emp2 WHERE reviewer_id = 'emp-002';
UPDATE salary_structures SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE tickets SET requester_id = @uuid_emp2 WHERE requester_id = 'emp-002';
UPDATE tickets SET assignee_id = @uuid_emp2 WHERE assignee_id = 'emp-002';
UPDATE training_enrollments SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE travel_requests SET employee_id = @uuid_emp2 WHERE employee_id = 'emp-002';
UPDATE travel_requests SET approver_id = @uuid_emp2 WHERE approver_id = 'emp-002';

-- Update emp-003
UPDATE employees SET id = @uuid_emp3 WHERE id = 'emp-003';
UPDATE users SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE asset_assignments SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE attendance_records SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE documents SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE employee_shifts SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE employees SET manager_id = @uuid_emp3 WHERE manager_id = 'emp-003';
UPDATE expenses SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE expenses SET approver_id = @uuid_emp3 WHERE approver_id = 'emp-003';
UPDATE goals SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE interviews SET interviewer_id = @uuid_emp3 WHERE interviewer_id = 'emp-003';
UPDATE leave_balances SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE leave_requests SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE leave_requests SET approver_id = @uuid_emp3 WHERE approver_id = 'emp-003';
UPDATE payroll_records SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE performance_reviews SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE performance_reviews SET reviewer_id = @uuid_emp3 WHERE reviewer_id = 'emp-003';
UPDATE salary_structures SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE tickets SET requester_id = @uuid_emp3 WHERE requester_id = 'emp-003';
UPDATE tickets SET assignee_id = @uuid_emp3 WHERE assignee_id = 'emp-003';
UPDATE training_enrollments SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE travel_requests SET employee_id = @uuid_emp3 WHERE employee_id = 'emp-003';
UPDATE travel_requests SET approver_id = @uuid_emp3 WHERE approver_id = 'emp-003';

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
