-- Complete Sample Data for HR System
-- This script populates all tables with comprehensive sample data

USE hr_system;

-- Clear existing data (in correct order to respect foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE attendance_records;
TRUNCATE TABLE payroll_records;
TRUNCATE TABLE salary_structures;
TRUNCATE TABLE documents;
TRUNCATE TABLE employees;
TRUNCATE TABLE departments;
TRUNCATE TABLE locations;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- LOCATIONS
-- =====================================================
INSERT INTO locations (id, name, address, city, country, created_at) VALUES
('loc-001', 'Dubai Office', 'Sheikh Zayed Road', 'Dubai', 'UAE', NOW()),
('loc-002', 'Abu Dhabi Office', 'Corniche Road', 'Abu Dhabi', 'UAE', NOW()),
('loc-003', 'Sharjah Office', 'Al Qasimia', 'Sharjah', 'UAE', NOW());

-- =====================================================
-- DEPARTMENTS
-- =====================================================
INSERT INTO departments (id, name, location_id, created_at) VALUES
('dept-001', 'Engineering', 'loc-001', NOW()),
('dept-002', 'Marketing', 'loc-001', NOW()),
('dept-003', 'Human Resources', 'loc-001', NOW()),
('dept-004', 'Finance', 'loc-002', NOW()),
('dept-005', 'Sales', 'loc-001', NOW());

-- =====================================================
-- EMPLOYEES
-- =====================================================
INSERT INTO employees (id, employee_code, first_name, last_name, email, phone, designation, department_id, location_id, date_of_birth, date_of_joining, status, gender, marital_status, address, city, country, emergency_contact_name, emergency_contact_phone, bank_name, account_number, iban, emirates_id, created_at) VALUES
-- Employee 1
('emp-001', 'EMP001', 'Ahmed', 'Al Maktoum', 'ahmed.almaktoum@company.ae', '+971501234567', 'Senior Software Engineer', 'dept-001', 'loc-001', '1990-05-15', '2020-01-15', 'Active', 'Male', 'Married', 'Al Barsha, Dubai', 'Dubai', 'UAE', 'Fatima Al Maktoum', '+971501234568', 'Emirates NBD', '1234567890123456', 'AE070331234567890123456', '784-1990-1234567-1', NOW()),

-- Employee 2
('emp-002', 'EMP002', 'Priya', 'Patel', 'priya.patel@company.ae', '+971502345678', 'Marketing Manager', 'dept-002', 'loc-001', '1988-08-22', '2019-03-10', 'Active', 'Female', 'Single', 'Business Bay, Dubai', 'Dubai', 'UAE', 'Raj Patel', '+971502345679', 'ADCB', '2345678901234567', 'AE070331234567890123457', '784-1988-2345678-2', NOW()),

-- Employee 3
('emp-003', 'EMP003', 'Mohammed', 'Hassan', 'mohammed.hassan@company.ae', '+971503456789', 'HR Specialist', 'dept-003', 'loc-001', '1992-12-10', '2021-06-01', 'Active', 'Male', 'Single', 'Jumeirah, Dubai', 'Dubai', 'UAE', 'Sara Hassan', '+971503456790', 'Mashreq Bank', '3456789012345678', 'AE070331234567890123458', '784-1992-3456789-3', NOW()),

-- Employee 4
('emp-004', 'EMP004', 'Sarah', 'Johnson', 'sarah.johnson@company.ae', '+971504567890', 'Finance Director', 'dept-004', 'loc-002', '1985-03-18', '2018-09-15', 'Active', 'Female', 'Married', 'Al Reem Island, Abu Dhabi', 'Abu Dhabi', 'UAE', 'John Johnson', '+971504567891', 'FAB', '4567890123456789', 'AE070331234567890123459', '784-1985-4567890-4', NOW()),

-- Employee 5
('emp-005', 'EMP005', 'Ali', 'Abdullah', 'ali.abdullah@company.ae', '+971505678901', 'Sales Executive', 'dept-005', 'loc-001', '1995-07-25', '2022-01-20', 'Active', 'Male', 'Single', 'Dubai Marina', 'Dubai', 'UAE', 'Abdullah Ali', '+971505678902', 'Emirates NBD', '5678901234567890', 'AE070331234567890123460', '784-1995-5678901-5', NOW()),

-- Employee 6
('emp-006', 'EMP006', 'Layla', 'Ahmed', 'layla.ahmed@company.ae', '+971506789012', 'Software Developer', 'dept-001', 'loc-001', '1993-11-30', '2021-08-15', 'Active', 'Female', 'Single', 'Downtown Dubai', 'Dubai', 'UAE', 'Noor Ahmed', '+971506789013', 'ADCB', '6789012345678901', 'AE070331234567890123461', '784-1993-6789012-6', NOW()),

-- Employee 7
('emp-007', 'EMP007', 'Omar', 'Khalid', 'omar.khalid@company.ae', '+971507890123', 'Marketing Coordinator', 'dept-002', 'loc-001', '1994-04-12', '2022-03-01', 'On Leave', 'Male', 'Married', 'Al Nahda, Dubai', 'Dubai', 'UAE', 'Aisha Khalid', '+971507890124', 'Mashreq Bank', '7890123456789012', 'AE070331234567890123462', '784-1994-7890123-7', NOW()),

-- Employee 8
('emp-008', 'EMP008', 'Fatima', 'Salem', 'fatima.salem@company.ae', '+971508901234', 'HR Manager', 'dept-003', 'loc-001', '1987-09-05', '2017-11-20', 'Active', 'Female', 'Married', 'Mirdif, Dubai', 'Dubai', 'UAE', 'Salem Ali', '+971508901235', 'FAB', '8901234567890123', 'AE070331234567890123463', '784-1987-8901234-8', NOW());

-- =====================================================
-- SALARY STRUCTURES
-- =====================================================
INSERT INTO salary_structures (id, employee_id, basic_salary, housing_allowance, transport_allowance, other_allowances, effective_from, created_at) VALUES
(UUID(), 'emp-001', 12000.00, 3000.00, 1000.00, 1000.00, '2024-01-01', NOW()),
(UUID(), 'emp-002', 8000.00, 1500.00, 500.00, 500.00, '2024-01-01', NOW()),
(UUID(), 'emp-003', 7000.00, 1400.00, 500.00, 400.00, '2024-01-01', NOW()),
(UUID(), 'emp-004', 15000.00, 4000.00, 1500.00, 1500.00, '2024-01-01', NOW()),
(UUID(), 'emp-005', 6000.00, 1200.00, 400.00, 300.00, '2024-01-01', NOW()),
(UUID(), 'emp-006', 9000.00, 2000.00, 700.00, 600.00, '2024-01-01', NOW()),
(UUID(), 'emp-007', 7500.00, 1500.00, 500.00, 400.00, '2024-01-01', NOW()),
(UUID(), 'emp-008', 10000.00, 2500.00, 800.00, 700.00, '2024-01-01', NOW());

-- =====================================================
-- PAYROLL RECORDS (Last 4 months for all employees)
-- =====================================================
INSERT INTO payroll_records (id, employee_id, month, year, basic_salary, total_allowances, total_deductions, net_salary, status, payment_date, created_at) VALUES
-- emp-002 (Priya Patel)
(UUID(), 'emp-002', 8, 2025, 8000.00, 2500.00, 1200.00, 9300.00, 'Paid', '2025-09-01', NOW()),
(UUID(), 'emp-002', 9, 2025, 8000.00, 2500.00, 1200.00, 9300.00, 'Paid', '2025-10-01', NOW()),
(UUID(), 'emp-002', 10, 2025, 8000.00, 2700.00, 1200.00, 9500.00, 'Paid', '2025-11-01', NOW()),
(UUID(), 'emp-002', 11, 2025, 8000.00, 2500.00, 1200.00, 9300.00, 'Processed', '2025-12-01', NOW()),

-- emp-001 (Ahmed Al Maktoum)
(UUID(), 'emp-001', 8, 2025, 12000.00, 5000.00, 2000.00, 15000.00, 'Paid', '2025-09-01', NOW()),
(UUID(), 'emp-001', 9, 2025, 12000.00, 5000.00, 2000.00, 15000.00, 'Paid', '2025-10-01', NOW()),
(UUID(), 'emp-001', 10, 2025, 12000.00, 5000.00, 2000.00, 15000.00, 'Paid', '2025-11-01', NOW()),
(UUID(), 'emp-001', 11, 2025, 12000.00, 5000.00, 2000.00, 15000.00, 'Processed', '2025-12-01', NOW()),

-- emp-003 (Mohammed Hassan)
(UUID(), 'emp-003', 8, 2025, 7000.00, 2300.00, 1100.00, 8200.00, 'Paid', '2025-09-01', NOW()),
(UUID(), 'emp-003', 9, 2025, 7000.00, 2300.00, 1100.00, 8200.00, 'Paid', '2025-10-01', NOW()),
(UUID(), 'emp-003', 10, 2025, 7000.00, 2300.00, 1100.00, 8200.00, 'Paid', '2025-11-01', NOW()),
(UUID(), 'emp-003', 11, 2025, 7000.00, 2300.00, 1100.00, 8200.00, 'Processed', '2025-12-01', NOW());

-- =====================================================
-- ATTENDANCE RECORDS (November 2025 for multiple employees)
-- =====================================================
-- emp-002 (Priya Patel) - Full month
INSERT INTO attendance_records (id, employee_id, date, status, check_in, check_out, total_hours, late_minutes, overtime_hours, notes, created_at) VALUES
-- Week 1
(UUID(), 'emp-002', '2025-11-01', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Saturday', NOW()),
(UUID(), 'emp-002', '2025-11-02', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Sunday', NOW()),
(UUID(), 'emp-002', '2025-11-03', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'On time', NOW()),
(UUID(), 'emp-002', '2025-11-04', 'Present', '08:55:00', '18:10:00', 9.25, 0, 0.25, 'Early arrival', NOW()),
(UUID(), 'emp-002', '2025-11-05', 'Late', '09:30:00', '18:00:00', 8.50, 30, 0.00, 'Traffic delay', NOW()),
(UUID(), 'emp-002', '2025-11-06', 'Present', '09:00:00', '19:00:00', 10.00, 0, 1.00, 'Project deadline', NOW()),
(UUID(), 'emp-002', '2025-11-07', 'Present', '09:05:00', '18:00:00', 8.92, 5, 0.00, 'Slightly late', NOW()),

-- Week 2
(UUID(), 'emp-002', '2025-11-08', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Saturday', NOW()),
(UUID(), 'emp-002', '2025-11-09', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Sunday', NOW()),
(UUID(), 'emp-002', '2025-11-10', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),
(UUID(), 'emp-002', '2025-11-11', 'Leave', NULL, NULL, NULL, 0, 0.00, 'Sick leave', NOW()),
(UUID(), 'emp-002', '2025-11-12', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Back from leave', NOW()),
(UUID(), 'emp-002', '2025-11-13', 'Present', '08:50:00', '18:30:00', 9.67, 0, 0.67, 'Extra hours', NOW()),
(UUID(), 'emp-002', '2025-11-14', 'Half Day', '09:00:00', '13:00:00', 4.00, 0, 0.00, 'Personal appointment', NOW()),

-- Week 3
(UUID(), 'emp-002', '2025-11-15', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Saturday', NOW()),
(UUID(), 'emp-002', '2025-11-16', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Sunday', NOW()),
(UUID(), 'emp-002', '2025-11-17', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),
(UUID(), 'emp-002', '2025-11-18', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),
(UUID(), 'emp-002', '2025-11-19', 'Present', '09:10:00', '18:00:00', 8.83, 10, 0.00, 'Slightly late', NOW()),
(UUID(), 'emp-002', '2025-11-20', 'Present', '09:00:00', '20:00:00', 11.00, 0, 2.00, 'Client presentation', NOW()),
(UUID(), 'emp-002', '2025-11-21', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),

-- Week 4
(UUID(), 'emp-002', '2025-11-22', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Saturday', NOW()),
(UUID(), 'emp-002', '2025-11-23', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Sunday', NOW()),
(UUID(), 'emp-002', '2025-11-24', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),
(UUID(), 'emp-002', '2025-11-25', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),
(UUID(), 'emp-002', '2025-11-26', 'Absent', NULL, NULL, NULL, 0, 0.00, 'Unplanned absence', NOW()),
(UUID(), 'emp-002', '2025-11-27', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Back to work', NOW()),
(UUID(), 'emp-002', '2025-11-28', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),

-- Week 5
(UUID(), 'emp-002', '2025-11-29', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Saturday', NOW()),
(UUID(), 'emp-002', '2025-11-30', 'Weekend', NULL, NULL, NULL, 0, 0.00, 'Sunday', NOW());

-- Add some attendance for emp-001 (Ahmed)
INSERT INTO attendance_records (id, employee_id, date, status, check_in, check_out, total_hours, late_minutes, overtime_hours, notes, created_at) VALUES
(UUID(), 'emp-001', '2025-11-03', 'Present', '08:45:00', '18:30:00', 9.75, 0, 0.75, 'Early and stayed late', NOW()),
(UUID(), 'emp-001', '2025-11-04', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),
(UUID(), 'emp-001', '2025-11-05', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW()),
(UUID(), 'emp-001', '2025-11-06', 'Present', '09:00:00', '19:30:00', 10.50, 0, 1.50, 'Important meeting', NOW()),
(UUID(), 'emp-001', '2025-11-07', 'Present', '09:00:00', '18:00:00', 9.00, 0, 0.00, 'Regular day', NOW());

-- =====================================================
-- DOCUMENTS
-- =====================================================
INSERT INTO documents (id, employee_id, name, type, file_url, expiry_date, status, is_company_document, created_at) VALUES
-- Employee Documents (emp-002)
(UUID(), 'emp-002', 'Passport Copy', 'Passport', '/documents/emp-002/passport.pdf', '2028-05-15', 'Active', 0, NOW()),
(UUID(), 'emp-002', 'Emirates ID', 'Emirates ID', '/documents/emp-002/emirates-id.pdf', '2026-12-31', 'Active', 0, NOW()),
(UUID(), 'emp-002', 'Employment Contract', 'Contract', '/documents/emp-002/contract.pdf', NULL, 'Active', 0, NOW()),
(UUID(), 'emp-002', 'Visa Copy', 'Visa', '/documents/emp-002/visa.pdf', '2026-03-10', 'Active', 0, NOW()),
(UUID(), 'emp-002', 'Educational Certificate', 'Certificate', '/documents/emp-002/degree.pdf', NULL, 'Active', 0, NOW()),

-- Company Documents
(UUID(), NULL, 'Employee Handbook 2025', 'Policy', '/documents/company/handbook-2025.pdf', NULL, 'Active', 1, NOW()),
(UUID(), NULL, 'Code of Conduct', 'Policy', '/documents/company/code-of-conduct.pdf', NULL, 'Active', 1, NOW()),
(UUID(), NULL, 'Leave Policy', 'Policy', '/documents/company/leave-policy.pdf', NULL, 'Active', 1, NOW());

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
SELECT 'Locations' as TableName, COUNT(*) as RecordCount FROM locations
UNION ALL
SELECT 'Departments', COUNT(*) FROM departments
UNION ALL
SELECT 'Employees', COUNT(*) FROM employees
UNION ALL
SELECT 'Salary Structures', COUNT(*) FROM salary_structures
UNION ALL
SELECT 'Payroll Records', COUNT(*) FROM payroll_records
UNION ALL
SELECT 'Attendance Records', COUNT(*) FROM attendance_records
UNION ALL
SELECT 'Documents', COUNT(*) FROM documents;
