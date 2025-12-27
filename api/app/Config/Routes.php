<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api/v1', ['filter' => 'cors'], function ($routes) {
    // Handle preflight OPTIONS requests for all routes
    $routes->options('(:any)', function() {
        $response = service('response');
        $response->setHeader('Access-Control-Allow-Origin', '*');
        $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
        $response->setHeader('Access-Control-Max-Age', '86400');
        $response->setStatusCode(200);
        return $response;
    });
    
    // Public Auth Routes
    $routes->post('auth/login', 'AuthController::login');
    $routes->post('auth/register', 'AuthController::register');
    $routes->post('auth/register', 'AuthController::register');
    
    // Protected Routes
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('auth/me', 'AuthController::me');
        
        // Employees
        $routes->resource('employees', ['controller' => 'EmployeeController']);
        
        // Attendance
        $routes->get('attendance/today', 'AttendanceController::getTodayAttendance');
        $routes->get('attendance/date/(:any)', 'AttendanceController::getAttendanceByDate/$1');
        $routes->put('attendance/(:segment)', 'AttendanceController::update/$1');
        $routes->post('attendance/bulk', 'AttendanceController::bulkUpsert');
        $routes->get('attendance/history/(:segment)', 'AttendanceController::getEmployeeAttendance/$1');
        $routes->get('attendance/history', 'AttendanceController::history');
        $routes->post('attendance/check-in', 'AttendanceController::checkIn');
        $routes->post('attendance/check-out', 'AttendanceController::checkOut');
        
        // Leaves
        $routes->get('leaves/balances', 'LeaveController::balances');
        $routes->get('leaves/stats', 'LeaveController::stats');
        $routes->get('leaves/types', 'LeaveController::types');
        $routes->resource('leaves', ['controller' => 'LeaveController']);
        
        // Payroll
        $routes->get('payroll/employee/(:segment)', 'PayrollController::getEmployeePayroll/$1');
        $routes->get('payroll/settlement/(:segment)', 'PayrollController::getSettlement/$1');
        $routes->get('payroll/stats', 'PayrollController::getStats');
        $routes->get('payroll/pending-settlements', 'PayrollController::getPendingSettlements');
        $routes->get('payroll', 'PayrollController::index');
        $routes->post('payroll/generate', 'PayrollController::generate');
        $routes->get('dashboard/stats', 'DashboardController::getStats');
        $routes->get('salary-structures', 'SalaryStructureController::index');
        $routes->post('salary-structures', 'SalaryStructureController::create');
        
        // Recruitment
        $routes->resource('jobs', ['controller' => 'JobController']);
        
        // Recruitment
        $routes->resource('jobs', ['controller' => 'JobController']);
        
        // Training
        $routes->resource('training-programs', ['controller' => 'TrainingProgramController']);
        
        // Performance Module - Comprehensive Routes
        // Performance Reviews
        $routes->get('performance-reviews/stats/overview', 'PerformanceReviewController::getStats');
        $routes->get('performance-reviews/stats/departments', 'PerformanceReviewController::getDepartmentStats');
        $routes->get('performance-reviews/employee/(:segment)', 'PerformanceReviewController::getByEmployee/$1');
        
        // Manual CRUD routes for Performance Reviews to avoid resource conflict
        $routes->get('performance-reviews', 'PerformanceReviewController::index');
        $routes->get('performance-reviews/(:segment)', 'PerformanceReviewController::show/$1');
        $routes->post('performance-reviews', 'PerformanceReviewController::create');
        $routes->put('performance-reviews/(:segment)', 'PerformanceReviewController::update/$1');
        $routes->delete('performance-reviews/(:segment)', 'PerformanceReviewController::delete/$1');
        
        // Goals
        $routes->put('goals/(:segment)/progress', 'GoalController::updateProgress/$1');
        $routes->get('goals/employee/(:segment)', 'GoalController::getByEmployee/$1');
        $routes->resource('goals', ['controller' => 'GoalController']);
        
        // KRAs (Key Result Areas)
        $routes->get('kras/employee/(:segment)', 'KRAController::getByEmployee/$1');
        $routes->resource('kras', ['controller' => 'KRAController']);
        
        // 360° Feedback
        $routes->get('feedback/employee/(:segment)', 'FeedbackController::getByEmployee/$1');
        $routes->get('feedback/review/(:segment)', 'FeedbackController::getByReview/$1');
        $routes->resource('feedback', ['controller' => 'FeedbackController']);
        
        // Appraisal Cycles
        $routes->get('appraisal-cycles/active/list', 'AppraisalCycleController::getActive');
        $routes->get('appraisal-cycles/stats/overview', 'AppraisalCycleController::getStats');
        $routes->resource('appraisal-cycles', ['controller' => 'AppraisalCycleController']);
        
        // Training
        $routes->get('training/programs/stats', 'TrainingProgramController::getStats');
        $routes->resource('training/programs', ['controller' => 'TrainingProgramController']);
        
        $routes->get('training/enrollments/program/(:segment)', 'TrainingEnrollmentController::getByProgram/$1');
        $routes->resource('training/enrollments', ['controller' => 'TrainingEnrollmentController']);
        
        // Assets
        $routes->resource('assets', ['controller' => 'AssetController']);
        
        // Expenses
        $routes->get('expenses/stats', 'ExpenseController::stats');
        $routes->resource('expenses', ['controller' => 'ExpenseController']);
        
        // Tickets
        $routes->resource('tickets', ['controller' => 'TicketController']);
        
        // Notifications
        $routes->get('notifications', 'NotificationController::index');
        $routes->post('notifications', 'NotificationController::create');
        $routes->post('notifications/(:segment)/read', 'NotificationController::markAsRead/$1');
        
        // Documents
        $routes->get('documents/download/(:segment)', 'DocumentController::download/$1');
        $routes->get('documents/employee/(:segment)', 'DocumentController::getEmployeeDocuments/$1');
        $routes->resource('documents', ['controller' => 'DocumentController']);
        
        // Policies
        $routes->get('policies/download/(:segment)', 'PolicyController::download/$1');
        $routes->post('policies/(:segment)/acknowledge', 'PolicyController::acknowledge/$1');
        $routes->post('policies/(:segment)/remind', 'PolicyController::sendReminder/$1');
        $routes->post('policies/(:segment)/update', 'PolicyController::update/$1');
        $routes->resource('policies', ['controller' => 'PolicyController']);
        
        // Travel Requests
        $routes->get('travel-requests/stats', 'TravelRequestController::stats');
        $routes->resource('travel-requests', ['controller' => 'TravelRequestController']);
        
        // Ticket Comments
        $routes->get('tickets/(:segment)/comments', 'TicketCommentController::index/$1');
        $routes->post('tickets/(:segment)/comments', 'TicketCommentController::create/$1');
        
        // Organization
        $routes->resource('locations', ['controller' => 'LocationController']);
        // Company Settings - Custom routes to handle POST for update (frontend compatibility)
        $routes->get('company-settings', 'CompanySettingsController::index');
        $routes->post('company-settings', 'CompanySettingsController::update');
        $routes->put('company-settings', 'CompanySettingsController::update');
        $routes->resource('roles', ['controller' => 'RoleController']);
        $routes->resource('departments', ['controller' => 'DepartmentController']);
        
        // Shifts
        $routes->resource('shifts', ['controller' => 'ShiftController']);
        $routes->resource('employee-shifts', ['controller' => 'EmployeeShiftController']);
        
        // Recruitment Details
        $routes->resource('candidates', ['controller' => 'CandidateController']);
        $routes->resource('applications', ['controller' => 'ApplicationController']);
        $routes->resource('interviews', ['controller' => 'InterviewController']);
        
        // Performance Goals
        $routes->resource('goals', ['controller' => 'GoalController']);
        
        // Training Enrollments
        $routes->resource('training-enrollments', ['controller' => 'TrainingEnrollmentController']);
        
        // Asset Management
        $routes->resource('assets', ['controller' => 'AssetController']);
        $routes->resource('asset-categories', ['controller' => 'AssetCategoryController']);
        $routes->resource('asset-assignments', ['controller' => 'AssetAssignmentController']);
        
        // Payroll Structures
        $routes->resource('salary-structures', ['controller' => 'SalaryStructureController']);

        // Holidays
        $routes->resource('holidays', ['controller' => 'HolidayController']);
    });
});
