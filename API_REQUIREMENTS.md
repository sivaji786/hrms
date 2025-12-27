# HR Management System - API Requirements
Version: 1.0
Last Updated: November 29, 2024

This document outlines the required API endpoints for the HR Management System to be implemented using CodeIgniter 4.

## Base URL
`http://localhost:8080/api/v1`

## Authentication & Access Control

| Method | Endpoint | Description | Auth Required |
|:--- |:--- |:--- |:--- |
| POST | `/auth/login` | User login (Admin/Employee) | No |
| POST | `/auth/refresh` | Refresh access token | Yes |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user profile | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |

## Dashboard

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/dashboard/stats` | Get key statistics (employees, attendance, etc.) | Admin/Manager |
| GET | `/dashboard/attendance-trend` | Get attendance trend data | Admin/Manager |
| GET | `/dashboard/department-stats` | Get department-wise statistics | Admin/Manager |
| GET | `/dashboard/recent-activity` | Get recent system activities | Admin/Manager |
| GET | `/dashboard/employee/stats` | Get current employee's stats | Employee |

## Employee Management

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/employees` | List all employees (with filters & pagination) | Admin/HR |
| POST | `/employees` | Create new employee | Admin/HR |
| GET | `/employees/{id}` | Get employee details | Admin/HR/Self |
| PUT | `/employees/{id}` | Update employee details | Admin/HR |
| DELETE | `/employees/{id}` | Deactivate/Delete employee | Admin |
| POST | `/employees/{id}/documents` | Upload employee document | Admin/HR/Self |
| GET | `/employees/{id}/documents` | List employee documents | Admin/HR/Self |
| GET | `/employees/structure/departments` | List all departments | Any |
| GET | `/employees/structure/locations` | List all locations | Any |

## Attendance Management

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| POST | `/attendance/check-in` | Record check-in (Face Rec/Manual) | Employee |
| POST | `/attendance/check-out` | Record check-out | Employee |
| GET | `/attendance/today` | Get today's attendance list | Admin/Manager |
| GET | `/attendance/history` | Get attendance history (filters) | Any |
| GET | `/attendance/summary` | Get monthly attendance summary | Any |
| POST | `/attendance/correction` | Request attendance correction | Employee |
| PUT | `/attendance/correction/{id}` | Approve/Reject correction | Manager/Admin |
| GET | `/shifts` | List all shifts | Admin/HR |
| POST | `/shifts/assign` | Assign shift to employee | Admin/HR |

## Leave Management

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/leaves/types` | Get all leave types | Any |
| POST | `/leaves/request` | Submit leave request | Employee |
| GET | `/leaves/requests` | List leave requests (filters) | Any |
| GET | `/leaves/balance` | Get leave balance | Employee |
| PUT | `/leaves/requests/{id}/status` | Approve/Reject leave request | Manager/Admin |
| GET | `/leaves/calendar` | Get team leave calendar | Any |

## Payroll Management

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/payroll/salary-structure/{empId}` | Get employee salary structure | Admin/HR |
| PUT | `/payroll/salary-structure/{empId}` | Update salary structure | Admin/HR |
| POST | `/payroll/generate` | Generate monthly payroll | Admin/Finance |
| GET | `/payroll/list` | List payroll records (filters) | Admin/Finance |
| GET | `/payroll/payslip/{id}` | Get payslip details | Admin/Finance/Self |
| GET | `/payroll/payslip/{id}/pdf` | Download payslip PDF | Admin/Finance/Self |
| POST | `/payroll/process` | Process payroll (Draft -> Processed) | Admin/Finance |

## Recruitment (ATS)

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/recruitment/jobs` | List job postings | Any |
| POST | `/recruitment/jobs` | Create job posting | Admin/HR |
| PUT | `/recruitment/jobs/{id}` | Update job posting | Admin/HR |
| POST | `/recruitment/apply` | Submit job application | Public |
| GET | `/recruitment/candidates` | List candidates | Admin/HR |
| GET | `/recruitment/applications` | List applications (pipeline view) | Admin/HR |
| PUT | `/recruitment/applications/{id}/status` | Update application status | Admin/HR |
| POST | `/recruitment/interviews` | Schedule interview | Admin/HR |

## Performance Management

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/performance/reviews` | List performance reviews | Admin/Manager |
| POST | `/performance/reviews` | Initiate review cycle | Admin/HR |
| GET | `/performance/reviews/{id}` | Get review details | Admin/Manager/Self |
| PUT | `/performance/reviews/{id}` | Submit review/feedback | Manager/Self |
| GET | `/performance/goals` | List goals | Any |
| POST | `/performance/goals` | Create goal | Manager/Self |
| PUT | `/performance/goals/{id}` | Update goal progress | Manager/Self |

## Training & Development

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/training/programs` | List training programs | Any |
| POST | `/training/programs` | Create training program | Admin/HR |
| POST | `/training/enroll` | Enroll in program | Employee |
| PUT | `/training/enrollments/{id}` | Update enrollment status | Admin/HR |
| GET | `/training/my-trainings` | Get my trainings | Employee |

## Asset Management

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/assets` | List all assets | Admin/IT |
| POST | `/assets` | Add new asset | Admin/IT |
| POST | `/assets/assign` | Assign asset to employee | Admin/IT |
| PUT | `/assets/{id}/return` | Return asset | Admin/IT |
| GET | `/assets/my-assets` | Get assigned assets | Employee |

## Expense & Travel

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| POST | `/expenses/claim` | Submit expense claim | Employee |
| GET | `/expenses/list` | List expenses (filters) | Any |
| PUT | `/expenses/{id}/status` | Approve/Reject expense | Manager/Finance |
| POST | `/travel/request` | Submit travel request | Employee |
| PUT | `/travel/{id}/status` | Approve/Reject travel request | Manager/Admin |

## Helpdesk (Ticketing)

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| POST | `/tickets` | Create support ticket | Any |
| GET | `/tickets` | List tickets (filters) | Any |
| GET | `/tickets/{id}` | Get ticket details | Any |
| POST | `/tickets/{id}/comments` | Add comment to ticket | Any |
| PUT | `/tickets/{id}/status` | Update ticket status | Admin/Support |

## Settings & Administration

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| GET | `/settings/company` | Get company details | Any |
| PUT | `/settings/company` | Update company details | Admin |
| GET | `/settings/roles` | List roles & permissions | Admin |
| POST | `/settings/roles` | Create/Update role | Admin |
| GET | `/settings/audit-logs` | View system audit logs | Admin |

## Common/Utility

| Method | Endpoint | Description | Role |
|:--- |:--- |:--- |:--- |
| POST | `/upload` | Upload file (generic) | Any |
| GET | `/notifications` | Get user notifications | Any |
| PUT | `/notifications/read` | Mark notifications as read | Any |

---
**Notes:**
- All list endpoints should support pagination (`page`, `limit`) and sorting (`sort_by`, `order`).
- All responses should follow a standard JSON structure:
  ```json
  {
    "status": "success" | "error",
    "message": "...",
    "data": { ... },
    "errors": { ... } // Validation errors if any
  }
  ```
- Date formats should be ISO 8601 (`YYYY-MM-DD`).
- Time formats should be 24-hour (`HH:mm:ss`).
