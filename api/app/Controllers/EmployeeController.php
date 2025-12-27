<?php

namespace App\Controllers;

use App\Models\EmployeeModel;
use CodeIgniter\API\ResponseTrait;

class EmployeeController extends ApiController
{
    use ResponseTrait;

    public function index()
    {
        $model = new EmployeeModel();
        
        // Pagination
        $page = $this->request->getVar('page') ?? 1;
        $perPage = $this->request->getVar('limit') ?? 10;
        
        // Select fields with joins
        $model->select('employees.*, departments.name as department_name, locations.name as location_name');
        $model->join('departments', 'departments.id = employees.department_id', 'left');
        $model->join('locations', 'locations.id = departments.location_id', 'left');

        // Search
        $search = $this->request->getVar('search');
        if ($search) {
            $model->groupStart()
                ->like('employees.first_name', $search)
                ->orLike('employees.last_name', $search)
                ->orLike('employees.email', $search)
                ->orLike('employees.employee_code', $search)
                ->orLike('departments.name', $search)
                ->groupEnd();
        }

        $employees = $model->paginate($perPage, 'default', $page);
        $pager = $model->pager;

        return $this->respondSuccess([
            'employees' => $employees,
            'pager' => [
                'currentPage' => $pager->getCurrentPage(),
                'totalPages' => $pager->getPageCount(),
                'totalItems' => $pager->getTotal()
            ]
        ]);
    }

    public function show($id = null)
    {
        $model = new EmployeeModel();
        $employee = $model->select('employees.*, departments.name as department_name')
                          ->join('departments', 'departments.id = employees.department_id', 'left')
                          ->find($id);

        if (!$employee) {
            return $this->respondError('Employee not found', 404);
        }

        return $this->respondSuccess($employee);
    }

    public function create()
    {
        // Only admin can create employees
        if ($this->getUser()->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $model = new EmployeeModel();
        
        // Handle multipart/form-data for file uploads
        $data = $this->request->getPost();
        
        if (empty($data)) {
            // Fallback to JSON if no file is uploaded
            $data = $this->getSecureJson(true);
        } else {
            // Sanitize POST data
            $security = new \App\Libraries\InputSecurity();
            $data = $security->sanitize($data);
        }

        // Handle profile image upload
        $profileImage = $this->request->getFile('profile_image');
        if ($profileImage && $profileImage->isValid() && !$profileImage->hasMoved()) {
            $fileService = new \App\Services\FileUploadService();
            $result = $fileService->store($profileImage, 'employees', ['max_size' => 2048]);

            if (is_array($result)) {
                return $this->respondError('File validation failed', 400, $result);
            }

            $data['profile_image'] = $result;
        }

        if ($model->insert($data)) {
            $employeeId = $model->getInsertID();
            
            // Create User Account with Default Password
            $userModel = new \App\Models\UserModel();
            $userData = [
                'email' => $data['email'],
                'username' => $data['email'], // Use email as username by default
                'password_hash' => password_hash('Employee@123', PASSWORD_DEFAULT),
                'role_id' => 'employee',
                'employee_id' => $employeeId,
                'status' => 'Active'
            ];
            $userModel->insert($userData);
            
            // Handle Document Uploads
            $documents = $this->request->getFiles();
            if (isset($documents['documents'])) {
                $documentModel = new \App\Models\DocumentModel();
                $fileService = new \App\Services\FileUploadService();
                $expiryDates = $this->request->getPost('document_expiry') ?? [];

                foreach ($documents['documents'] as $docType => $file) {
                    if ($file->isValid() && !$file->hasMoved()) {
                        $path = $fileService->store($file, 'documents');
                        
                        if (!is_array($path)) {
                            $docData = [
                                'employee_id' => $employeeId,
                                'name' => $docType,
                                'type' => $file->getClientMimeType(),
                                'file_url' => $path,
                                'status' => 'Pending Verification',
                                'expiry_date' => $expiryDates[$docType] ?? null,
                                'is_company_document' => 0
                            ];
                            $documentModel->insert($docData);
                        }
                    }
                }
            }

            return $this->respondCreated(['id' => $employeeId], 'Employee created successfully');
        } else {
            return $this->respondError('Failed to create employee', 400, $model->errors());
        }
    }

    public function update($id = null)
    {
        // Only admin can update employees
        if ($this->getUser()->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $model = new EmployeeModel();
        
        // Handle multipart/form-data for file uploads
        $data = $this->request->getPost();
        
        if (empty($data)) {
            // Fallback to JSON if no file is uploaded
            $data = $this->getSecureJson(true);
        } else {
            // Sanitize POST data
            $security = new \App\Libraries\InputSecurity();
            $data = $security->sanitize($data);
        }

        // Handle profile image upload
        $profileImage = $this->request->getFile('profile_image');
        if ($profileImage && $profileImage->isValid() && !$profileImage->hasMoved()) {
            // Get old profile image before uploading new one
            $oldEmployee = $model->find($id);
            $oldImage = $oldEmployee['profile_image'] ?? null;

            $fileService = new \App\Services\FileUploadService();
            $result = $fileService->store($profileImage, 'employees', ['max_size' => 2048]);

            if (is_array($result)) {
                return $this->respondError('File validation failed', 400, $result);
            }

            // Delete old profile image if it exists
            if ($oldImage) {
                $fileService->deleteOldFile($oldImage);
            }

            $data['profile_image'] = $result;
        }

        if ($model->update($id, $data)) {
            return $this->respondSuccess(null, 'Employee updated successfully');
        } else {
            return $this->respondError('Failed to update employee', 400, $model->errors());
        }
    }

    public function delete($id = null)
    {
        // Only admin can delete employees
        if ($this->getUser()->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $model = new EmployeeModel();
        
        // Get employee data before deletion to access profile image
        $employee = $model->find($id);
        
        if (!$employee) {
            return $this->respondError('Employee not found', 404);
        }
        
        // Delete employee record
        if ($model->delete($id)) {
            // Delete profile image file if it exists
            if (!empty($employee['profile_image'])) {
                $fileService = new \App\Services\FileUploadService();
                $fileService->deleteOldFile($employee['profile_image']);
            }
            
            return $this->respondSuccess(null, 'Employee deleted successfully');
        } else {
            return $this->respondError('Failed to delete employee', 400);
        }
    }
}
