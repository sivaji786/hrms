-- Create training_programs table
CREATE TABLE IF NOT EXISTS `training_programs` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `trainer` VARCHAR(100) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `mode` ENUM('Online', 'Offline', 'Hybrid') NOT NULL DEFAULT 'Online',
    `status` ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
    `capacity` INT NOT NULL DEFAULT 20,
    `cost` DECIMAL(10, 2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create training_enrollments table
CREATE TABLE IF NOT EXISTS `training_enrollments` (
    `id` VARCHAR(36) NOT NULL,
    `program_id` VARCHAR(36) NOT NULL,
    `employee_id` VARCHAR(36) NOT NULL,
    `status` ENUM('Enrolled', 'In Progress', 'Completed', 'Dropped') NOT NULL DEFAULT 'Enrolled',
    `completion_date` DATE DEFAULT NULL,
    `score` DECIMAL(5, 2) DEFAULT NULL,
    `certificate_url` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    -- Removed foreign key constraints to avoid issues with existing data or UUID format mismatches
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Training Programs
INSERT INTO `training_programs` (`id`, `title`, `description`, `trainer`, `start_date`, `end_date`, `mode`, `status`, `capacity`, `cost`) VALUES
('tp-001', 'Advanced Leadership Workshop', 'Intensive workshop for senior managers to develop leadership skills.', 'Dr. Sarah Johnson', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 12 DAY), 'Offline', 'Upcoming', 15, 1500.00),
('tp-002', 'React & TypeScript Masterclass', 'Deep dive into modern React patterns and TypeScript best practices.', 'Tech Academy', DATE_ADD(CURRENT_DATE, INTERVAL -5 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), 'Online', 'Ongoing', 50, 500.00),
('tp-003', 'Effective Communication Skills', 'Improving workplace communication and collaboration.', 'HR Dept', DATE_ADD(CURRENT_DATE, INTERVAL 20 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 21 DAY), 'Hybrid', 'Upcoming', 30, 200.00),
('tp-004', 'Project Management Fundamentals', 'Core concepts of project management for new project managers.', 'PMI Certified Trainer', DATE_ADD(CURRENT_DATE, INTERVAL -30 DAY), DATE_ADD(CURRENT_DATE, INTERVAL -25 DAY), 'Online', 'Completed', 40, 800.00);

-- Seed Enrollments (assuming some employee IDs exist, using placeholders or known IDs if possible)
-- We'll skip seeding enrollments with hardcoded IDs to avoid FK issues if those IDs don't exist.
-- The application logic handles enrollment creation.
