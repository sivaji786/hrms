-- HR Management System Schema
-- Version: 2.0
-- Database: MySQL 8.0

SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================
-- 1. Authentication & Access Control
-- ==========================================

CREATE TABLE `roles` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `permissions` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `module` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `role_permissions` (
  `role_id` VARCHAR(36),
  `permission_id` VARCHAR(36),
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` VARCHAR(36),
  `employee_id` VARCHAR(36), -- Link to employee record if applicable
  `status` ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
);

-- ==========================================
-- 2. Organization Structure
-- ==========================================

CREATE TABLE `locations` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `address` TEXT,
  `city` VARCHAR(50),
  `country` VARCHAR(50) DEFAULT 'UAE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `departments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `manager_id` VARCHAR(36), -- Self-reference to employee table (added later)
  `location_id` VARCHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`)
);

-- ==========================================
-- 3. Employee Management
-- ==========================================

CREATE TABLE `employees` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_code` VARCHAR(20) UNIQUE NOT NULL, -- e.g., EMP001
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `phone` VARCHAR(20),
  `department_id` VARCHAR(36),
  `designation` VARCHAR(100),
  `manager_id` VARCHAR(36),
  `date_of_joining` DATE NOT NULL,
  `status` ENUM('Active', 'Inactive', 'Terminated', 'Resigned', 'Notice Period') DEFAULT 'Active',
  `employment_type` ENUM('Full-time', 'Part-time', 'Contract', 'Intern') DEFAULT 'Full-time',
  `work_schedule` VARCHAR(100) DEFAULT 'Sunday - Thursday, 9:00 AM - 6:00 PM',
  
  -- Personal Details
  `date_of_birth` DATE,
  `gender` ENUM('Male', 'Female', 'Other'),
  `marital_status` ENUM('Single', 'Married', 'Divorced', 'Widowed'),
  `nationality` VARCHAR(50),
  `address` TEXT,
  `blood_group` VARCHAR(5),
  
  -- Emergency Contact
  `emergency_contact_name` VARCHAR(100),
  `emergency_contact_phone` VARCHAR(20),
  `emergency_contact_relation` VARCHAR(50),
  
  -- Bank Details
  `bank_name` VARCHAR(100),
  `account_number` VARCHAR(50),
  `iban` VARCHAR(50),
  
  -- UAE Specific Documents (Numbers)
  `emirates_id` VARCHAR(20),
  `passport_number` VARCHAR(20),
  `visa_number` VARCHAR(20),
  `labour_card_number` VARCHAR(20),
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`),
  FOREIGN KEY (`manager_id`) REFERENCES `employees`(`id`),
  INDEX `idx_employees_status` (`status`)
);

-- ==========================================
-- 4. Attendance & Shifts
-- ==========================================

CREATE TABLE `shifts` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `break_duration` INT DEFAULT 60, -- Minutes
  `work_days` VARCHAR(50) DEFAULT 'Mon,Tue,Wed,Thu,Fri', -- Comma separated
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `employee_shifts` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `shift_id` VARCHAR(36) NOT NULL,
  `effective_from` DATE NOT NULL,
  `effective_to` DATE,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`)
);

CREATE TABLE `attendance_records` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late', 'Half Day', 'Leave', 'Holiday', 'Weekend') NOT NULL,
  `check_in` TIME,
  `check_out` TIME,
  `total_hours` DECIMAL(5, 2),
  `late_minutes` INT DEFAULT 0,
  `overtime_hours` DECIMAL(5, 2) DEFAULT 0,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_attendance` (`employee_id`, `date`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`)
);

CREATE TABLE `attendance_punches` (
  `id` VARCHAR(36) PRIMARY KEY,
  `attendance_record_id` VARCHAR(36) NOT NULL,
  `punch_time` TIMESTAMP NOT NULL,
  `punch_type` ENUM('In', 'Out') NOT NULL,
  `device_id` VARCHAR(50),
  `location_coords` VARCHAR(100),
  FOREIGN KEY (`attendance_record_id`) REFERENCES `attendance_records`(`id`) ON DELETE CASCADE
);

-- ==========================================
-- 5. Leave Management
-- ==========================================

CREATE TABLE `leave_types` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL, -- Annual, Sick, Casual, Maternity, etc.
  `days_allowed` INT NOT NULL,
  `carry_forward` BOOLEAN DEFAULT FALSE,
  `is_paid` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `leave_balances` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `leave_type_id` VARCHAR(36) NOT NULL,
  `year` INT NOT NULL,
  `total_days` DECIMAL(5, 1) NOT NULL,
  `used_days` DECIMAL(5, 1) DEFAULT 0,
  `pending_days` DECIMAL(5, 1) DEFAULT 0,
  `remaining_days` DECIMAL(5, 1) GENERATED ALWAYS AS (total_days - used_days) STORED,
  UNIQUE KEY `unique_balance` (`employee_id`, `leave_type_id`, `year`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types`(`id`)
);

CREATE TABLE `leave_requests` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `leave_type_id` VARCHAR(36) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `days_count` DECIMAL(5, 1) NOT NULL,
  `reason` TEXT,
  `status` ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
  `approver_id` VARCHAR(36),
  `approval_date` TIMESTAMP NULL,
  `rejection_reason` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types`(`id`),
  FOREIGN KEY (`approver_id`) REFERENCES `employees`(`id`)
);

-- ==========================================
-- 6. Payroll Management
-- ==========================================

CREATE TABLE `salary_structures` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `basic_salary` DECIMAL(10, 2) NOT NULL,
  `housing_allowance` DECIMAL(10, 2) DEFAULT 0,
  `transport_allowance` DECIMAL(10, 2) DEFAULT 0,
  `other_allowances` DECIMAL(10, 2) DEFAULT 0,
  `effective_from` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`)
);

CREATE TABLE `payroll_records` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `month` INT NOT NULL,
  `year` INT NOT NULL,
  `basic_salary` DECIMAL(10, 2) NOT NULL,
  `total_allowances` DECIMAL(10, 2) NOT NULL,
  `total_deductions` DECIMAL(10, 2) NOT NULL,
  `net_salary` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('Draft', 'Processed', 'Paid') DEFAULT 'Draft',
  `payment_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_payroll` (`employee_id`, `month`, `year`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`)
);

CREATE TABLE `payslip_items` (
  `id` VARCHAR(36) PRIMARY KEY,
  `payroll_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL, -- e.g., Housing Allowance, Tax Deduction
  `amount` DECIMAL(10, 2) NOT NULL,
  `type` ENUM('Earning', 'Deduction') NOT NULL,
  FOREIGN KEY (`payroll_id`) REFERENCES `payroll_records`(`id`) ON DELETE CASCADE
);

-- ==========================================
-- 7. Recruitment (ATS)
-- ==========================================

CREATE TABLE `job_postings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `department_id` VARCHAR(36) NOT NULL,
  `location_id` VARCHAR(36) NOT NULL,
  `description` TEXT,
  `requirements` TEXT,
  `salary_min` DECIMAL(10, 2),
  `salary_max` DECIMAL(10, 2),
  `openings` INT DEFAULT 1,
  `status` ENUM('Draft', 'Active', 'Closed', 'On Hold') DEFAULT 'Draft',
  `posted_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`),
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`),
  INDEX `idx_job_postings_status` (`status`)
);

CREATE TABLE `candidates` (
  `id` VARCHAR(36) PRIMARY KEY,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20),
  `resume_url` VARCHAR(255),
  `linkedin_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `applications` (
  `id` VARCHAR(36) PRIMARY KEY,
  `job_id` VARCHAR(36) NOT NULL,
  `candidate_id` VARCHAR(36) NOT NULL,
  `status` ENUM('Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected') DEFAULT 'Applied',
  `applied_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `current_stage` VARCHAR(50),
  `rating` DECIMAL(3, 1),
  FOREIGN KEY (`job_id`) REFERENCES `job_postings`(`id`),
  FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`),
  INDEX `idx_applications_status` (`status`)
);

CREATE TABLE `interviews` (
  `id` VARCHAR(36) PRIMARY KEY,
  `application_id` VARCHAR(36) NOT NULL,
  `interviewer_id` VARCHAR(36) NOT NULL,
  `scheduled_at` TIMESTAMP NOT NULL,
  `duration_minutes` INT DEFAULT 60,
  `type` ENUM('Phone', 'Video', 'In-Person'),
  `status` ENUM('Scheduled', 'Completed', 'Cancelled', 'No Show') DEFAULT 'Scheduled',
  `feedback` TEXT,
  `rating` INT, -- 1-5
  FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`),
  FOREIGN KEY (`interviewer_id`) REFERENCES `employees`(`id`)
);

-- ==========================================
-- 8. Performance Management
-- ==========================================

CREATE TABLE `performance_reviews` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `reviewer_id` VARCHAR(36) NOT NULL,
  `cycle_name` VARCHAR(100) NOT NULL, -- e.g., Q4 2024
  `start_date` DATE,
  `end_date` DATE,
  `status` ENUM('Draft', 'Self-Review', 'Manager-Review', 'Completed') DEFAULT 'Draft',
  `final_rating` DECIMAL(3, 1),
  `feedback` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY (`reviewer_id`) REFERENCES `employees`(`id`)
);

CREATE TABLE `goals` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `review_id` VARCHAR(36),
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `due_date` DATE,
  `status` ENUM('Not Started', 'In Progress', 'Completed', 'At Risk') DEFAULT 'Not Started',
  `progress` INT DEFAULT 0, -- 0-100
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY (`review_id`) REFERENCES `performance_reviews`(`id`)
);

-- ==========================================
-- 9. Training & Development
-- ==========================================

CREATE TABLE `training_programs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `trainer` VARCHAR(100),
  `start_date` DATE,
  `end_date` DATE,
  `mode` ENUM('Online', 'Offline', 'Hybrid'),
  `status` ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
  `capacity` INT,
  `cost` DECIMAL(10, 2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `training_enrollments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `program_id` VARCHAR(36) NOT NULL,
  `employee_id` VARCHAR(36) NOT NULL,
  `status` ENUM('Enrolled', 'In Progress', 'Completed', 'Dropped') DEFAULT 'Enrolled',
  `completion_date` DATE,
  `score` DECIMAL(5, 2),
  `certificate_url` VARCHAR(255),
  FOREIGN KEY (`program_id`) REFERENCES `training_programs`(`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`)
);

-- ==========================================
-- 10. Assets Management
-- ==========================================

CREATE TABLE `asset_categories` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE `assets` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `category_id` VARCHAR(36),
  `serial_number` VARCHAR(100) UNIQUE,
  `purchase_date` DATE,
  `warranty_expiry` DATE,
  `value` DECIMAL(10, 2),
  `status` ENUM('Available', 'Assigned', 'Under Maintenance', 'Retired') DEFAULT 'Available',
  `location_id` VARCHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `asset_categories`(`id`),
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`)
);

CREATE TABLE `asset_assignments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `asset_id` VARCHAR(36) NOT NULL,
  `employee_id` VARCHAR(36) NOT NULL,
  `assigned_date` DATE NOT NULL,
  `return_date` DATE,
  `status` ENUM('Active', 'Returned') DEFAULT 'Active',
  `notes` TEXT,
  FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`)
);

-- ==========================================
-- 11. Expense & Travel
-- ==========================================

CREATE TABLE `expenses` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `category` VARCHAR(50) NOT NULL, -- Travel, Food, etc.
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'AED',
  `date` DATE NOT NULL,
  `description` TEXT,
  `receipt_url` VARCHAR(255),
  `status` ENUM('Pending', 'Approved', 'Rejected', 'Reimbursed') DEFAULT 'Pending',
  `approver_id` VARCHAR(36),
  `approval_date` TIMESTAMP NULL,
  `rejection_reason` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY (`approver_id`) REFERENCES `employees`(`id`)
);

CREATE TABLE `travel_requests` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `destination` VARCHAR(100) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `purpose` TEXT,
  `estimated_cost` DECIMAL(10, 2),
  `status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  `approver_id` VARCHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY (`approver_id`) REFERENCES `employees`(`id`)
);

-- ==========================================
-- 12. Documents & Policies
-- ==========================================

CREATE TABLE `documents` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36), -- Nullable for company documents
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL, -- Passport, Visa, Contract, Policy
  `file_url` VARCHAR(255) NOT NULL,
  `expiry_date` DATE,
  `status` ENUM('Valid', 'Expiring Soon', 'Expired', 'Pending Verification') DEFAULT 'Valid',
  `is_company_document` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`)
);

CREATE TABLE `policies` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50),
  `content` TEXT,
  `document_url` VARCHAR(255),
  `version` VARCHAR(20),
  `effective_date` DATE,
  `status` ENUM('Active', 'Archived') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 13. Helpdesk (Ticketing)
-- ==========================================

CREATE TABLE `tickets` (
  `id` VARCHAR(36) PRIMARY KEY,
  `ticket_number` VARCHAR(20) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(50) NOT NULL, -- IT, HR, Payroll
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  `status` ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
  `requester_id` VARCHAR(36) NOT NULL,
  `assignee_id` VARCHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`requester_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY (`assignee_id`) REFERENCES `employees`(`id`),
  INDEX `idx_tickets_status` (`status`)
);

CREATE TABLE `ticket_comments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `ticket_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `comment` TEXT NOT NULL,
  `is_internal` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- ==========================================
-- 14. Notifications
-- ==========================================

CREATE TABLE `notifications` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50), -- Info, Warning, Success, Error
  `is_read` BOOLEAN DEFAULT FALSE,
  `link` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

SET FOREIGN_KEY_CHECKS = 1;
