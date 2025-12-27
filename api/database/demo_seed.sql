-- Delete existing if any (cleanup)
DELETE FROM users WHERE email = 'john.smith@company.com';
DELETE FROM employees WHERE email = 'john.smith@company.com';

-- Insert Employee
INSERT INTO employees (id, employee_code, first_name, last_name, email, department_id, designation, date_of_joining, status, employment_type, location)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'EMP-DEMO-001', 'John', 'Smith', 'john.smith@company.com', 'dept-001', 'Software Engineer', '2023-01-01', 'Active', 'Full-time', 'Dubai HQ');

-- Insert User
INSERT INTO users (id, email, password_hash, role_id, employee_id, status)
VALUES (UUID(), 'john.smith@company.com', '$2y$10$zxrNQS6lTMbAYgsw0vQerezR02whS//SiegKEn5aK34mXqtIIf0l.', 'employee', '123e4567-e89b-12d3-a456-426614174000', 'Active');
