-- Performance Module - Additional Tables
-- Creates tables for KRAs, 360° Feedback, and Appraisal Cycles

USE hr_system;

-- =====================================================
-- KEY RESULT AREAS (KRAs)
-- =====================================================
CREATE TABLE IF NOT EXISTS kras (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    weightage INT DEFAULT 0 COMMENT 'Percentage weightage in performance (0-100)',
    target_value VARCHAR(100),
    achieved_value VARCHAR(100),
    status ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
    fiscal_year VARCHAR(10) COMMENT 'e.g., 2024-25',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employee (employee_id),
    INDEX idx_status (status),
    INDEX idx_fiscal_year (fiscal_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 360° FEEDBACK
-- =====================================================
CREATE TABLE IF NOT EXISTS feedback_360 (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL COMMENT 'Employee being reviewed',
    reviewer_id VARCHAR(36) NOT NULL COMMENT 'Person giving feedback',
    review_id VARCHAR(36) COMMENT 'Associated performance review',
    feedback_type ENUM('Manager', 'Peer', 'Self', 'Subordinate') NOT NULL,
    rating DECIMAL(3,1) COMMENT 'Overall rating (1.0 - 5.0)',
    technical_skills INT COMMENT 'Rating 0-100',
    communication INT COMMENT 'Rating 0-100',
    leadership INT COMMENT 'Rating 0-100',
    teamwork INT COMMENT 'Rating 0-100',
    initiative INT COMMENT 'Rating 0-100',
    comments TEXT,
    strengths TEXT,
    areas_of_improvement TEXT,
    status ENUM('Draft', 'Submitted', 'Reviewed') DEFAULT 'Draft',
    submitted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_employee (employee_id),
    INDEX idx_reviewer (reviewer_id),
    INDEX idx_review (review_id),
    INDEX idx_type (feedback_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- APPRAISAL CYCLES
-- =====================================================
CREATE TABLE IF NOT EXISTS appraisal_cycles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'e.g., Q1 2025, Annual 2024',
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    self_review_deadline DATE,
    manager_review_deadline DATE,
    status ENUM('Draft', 'Active', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Draft',
    total_employees INT DEFAULT 0,
    completed_reviews INT DEFAULT 0,
    pending_reviews INT DEFAULT 0,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SEED SAMPLE DATA
-- =====================================================

-- Seed KRAs
INSERT INTO kras (id, employee_id, title, description, weightage, target_value, achieved_value, status, fiscal_year, created_at)
SELECT UUID(), e.id, 'Project Delivery', 'Complete assigned projects on time and within budget', 30, '100%', '95%', 'Active', '2024-25', NOW()
FROM employees e LIMIT 1;

INSERT INTO kras (id, employee_id, title, description, weightage, target_value, achieved_value, status, fiscal_year, created_at)
SELECT UUID(), e.id, 'Team Development', 'Mentor junior team members', 20, '2 members', '2 members', 'Completed', '2024-25', NOW()
FROM employees e LIMIT 1;

INSERT INTO kras (id, employee_id, title, description, weightage, target_value, achieved_value, status, fiscal_year, created_at)
SELECT UUID(), e.id, 'Innovation', 'Propose and implement process improvements', 25, '3 improvements', '2 improvements', 'Active', '2024-25', NOW()
FROM employees e LIMIT 1;

INSERT INTO kras (id, employee_id, title, description, weightage, target_value, achieved_value, status, fiscal_year, created_at)
SELECT UUID(), e.id, 'Campaign Management', 'Launch successful marketing campaigns', 35, '3 campaigns', '2 campaigns', 'Active', '2024-25', NOW()
FROM employees e LIMIT 1 OFFSET 1;

INSERT INTO kras (id, employee_id, title, description, weightage, target_value, achieved_value, status, fiscal_year, created_at)
SELECT UUID(), e.id, 'Social Media Growth', 'Increase social media engagement', 25, '25% growth', '20% growth', 'Active', '2024-25', NOW()
FROM employees e LIMIT 1 OFFSET 1;

INSERT INTO kras (id, employee_id, title, description, weightage, target_value, achieved_value, status, fiscal_year, created_at)
SELECT UUID(), e.id, 'Recruitment Efficiency', 'Reduce time-to-hire', 30, '30 days', '28 days', 'Active', '2024-25', NOW()
FROM employees e LIMIT 1 OFFSET 2;

-- Seed 360° Feedback
INSERT INTO feedback_360 (id, employee_id, reviewer_id, feedback_type, rating, technical_skills, communication, leadership, teamwork, initiative, comments, strengths, areas_of_improvement, status, submitted_at, created_at)
SELECT UUID(), e1.id, e1.id, 'Self', 4.2, 92, 85, 78, 88, 90, 'Met most goals, room for improvement in delegation', 'Strong technical skills, good initiative', 'Need to improve delegation and time management', 'Submitted', NOW(), NOW()
FROM employees e1 LIMIT 1;

INSERT INTO feedback_360 (id, employee_id, reviewer_id, feedback_type, rating, technical_skills, communication, leadership, teamwork, initiative, comments, strengths, areas_of_improvement, status, submitted_at, created_at)
SELECT UUID(), e1.id, e2.id, 'Manager', 4.5, 95, 88, 82, 90, 92, 'Excellent technical skills and leadership qualities.', 'Technical expertise, mentoring ability', 'Cross-team collaboration', 'Submitted', NOW(), NOW()
FROM employees e1, employees e2 WHERE e1.id != e2.id LIMIT 1;

INSERT INTO feedback_360 (id, employee_id, reviewer_id, feedback_type, rating, technical_skills, communication, leadership, teamwork, initiative, comments, strengths, areas_of_improvement, status, submitted_at, created_at)
SELECT UUID(), e1.id, e2.id, 'Peer', 4.3, 90, 90, 80, 92, 88, 'Great team player, always willing to help.', 'Teamwork, code quality', 'Leadership visibility', 'Submitted', NOW(), NOW()
FROM (SELECT id FROM employees LIMIT 1) e1, (SELECT id FROM employees LIMIT 1 OFFSET 2) e2;

INSERT INTO feedback_360 (id, employee_id, reviewer_id, feedback_type, rating, technical_skills, communication, leadership, teamwork, initiative, comments, strengths, areas_of_improvement, status, submitted_at, created_at)
SELECT UUID(), e.id, e.id, 'Self', 4.5, 88, 95, 92, 90, 87, 'Exceeded campaign targets, strong communication skills', 'Communication, creativity', 'Technical skills, data analysis', 'Submitted', NOW(), NOW()
FROM employees e LIMIT 1 OFFSET 1;

INSERT INTO feedback_360 (id, employee_id, reviewer_id, feedback_type, rating, technical_skills, communication, leadership, teamwork, initiative, comments, strengths, areas_of_improvement, status, submitted_at, created_at)
SELECT UUID(), e2.id, e1.id, 'Manager', 4.6, 90, 95, 94, 92, 90, 'Outstanding performance in marketing campaigns.', 'Campaign execution, stakeholder management', 'Budget management', 'Submitted', NOW(), NOW()
FROM (SELECT id FROM employees LIMIT 1 OFFSET 1) e2, (SELECT id FROM employees LIMIT 1) e1;

-- Seed Appraisal Cycles
INSERT INTO appraisal_cycles (id, name, description, start_date, end_date, self_review_deadline, manager_review_deadline, status, total_employees, completed_reviews, pending_reviews, created_by, created_at)
SELECT UUID(), 'Q4 2024', 'Fourth Quarter Performance Review 2024', '2024-10-01', '2024-12-31', '2025-01-10', '2025-01-20', 'Completed', 8, 5, 0, e.id, '2024-10-01'
FROM employees e LIMIT 1;

INSERT INTO appraisal_cycles (id, name, description, start_date, end_date, self_review_deadline, manager_review_deadline, status, total_employees, completed_reviews, pending_reviews, created_by, created_at)
SELECT UUID(), 'Q1 2025', 'First Quarter Performance Review 2025', '2025-01-01', '2025-03-31', '2025-04-10', '2025-04-20', 'In Progress', 8, 3, 5, e.id, '2025-01-01'
FROM employees e LIMIT 1;

INSERT INTO appraisal_cycles (id, name, description, start_date, end_date, self_review_deadline, manager_review_deadline, status, total_employees, completed_reviews, pending_reviews, created_by, created_at)
SELECT UUID(), 'Annual 2024', 'Annual Performance Review 2024', '2024-01-01', '2024-12-31', '2025-01-15', '2025-01-31', 'Completed', 8, 8, 0, e.id, '2024-01-01'
FROM employees e LIMIT 1;

-- Verification
SELECT 'KRAs' as TableName, COUNT(*) as RecordCount FROM kras
UNION ALL
SELECT '360° Feedback', COUNT(*) FROM feedback_360
UNION ALL
SELECT 'Appraisal Cycles', COUNT(*) FROM appraisal_cycles;
