<?php

namespace App\Controllers;

use App\Models\DocumentModel;
use CodeIgniter\API\ResponseTrait;

class DocumentController extends ApiController
{
    protected $documentModel;

    public function __construct()
    {
        $this->documentModel = new DocumentModel();
    }

    public function index()
    {
        $user = $this->getUser();
        // Employees see their own documents + company documents
        // Admin sees all
        if ($user->role === 'admin') {
            $data = $this->documentModel->findAll();
        } else {
            $data = $this->documentModel
                ->groupStart()
                    ->where('employee_id', $user->id)
                    ->orWhere('is_company_document', 1)
                ->groupEnd()
                ->findAll();
        }
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        
        // Handle Multipart/Form-Data
        $file = $this->request->getFile('file');
        $postData = $this->request->getPost();

        // Validate basic data
        if (!isset($postData['name']) || !isset($postData['type'])) {
             return $this->respondError('Name and Type are required', 400);
        }

        // Only admin can create company documents
        $isCompanyDoc = isset($postData['is_company_document']) && ($postData['is_company_document'] == '1' || $postData['is_company_document'] == 'true');
        if ($isCompanyDoc && $user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }
        
        // Determine Employee ID
        $employeeId = $postData['employee_id'] ?? $user->id;
        if (!$isCompanyDoc && $employeeId != $user->id && $user->role !== 'admin') {
             // Non-admins can only upload for themselves
             return $this->respondError('Unauthorized', 403);
        }

        // Handle File Upload
        $filePath = null;
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $file->move(WRITEPATH . 'uploads/documents', $newName);
            $filePath = 'uploads/documents/' . $newName;
        } else {
             // If file is mandatory, return error. For now, let's assume it's optional but recommended.
             // return $this->respondError('File is invalid or not uploaded', 400);
        }

        $data = [
            'employee_id' => $employeeId,
            'name' => $postData['name'],
            'type' => $postData['type'],
            'file_url' => $filePath, // May be null
            'expiry_date' => $postData['expiry_date'] ?? null,
            'status' => $postData['status'] ?? 'Pending',
            'is_company_document' => $isCompanyDoc ? 1 : 0
        ];

        if ($this->documentModel->insert($data)) {
            return $this->respondCreated(['id' => $this->documentModel->getInsertID(), ...$data], 'Document uploaded successfully');
        }

        return $this->respondError('Failed to upload document', 500, $this->documentModel->errors());
    }

    public function download($id = null)
    {
        $user = $this->getUser();
        $document = $this->documentModel->find($id);

        if (!$document) {
            return $this->respondError('Document not found', 404);
        }

        // Check permissions
        if ($user->role !== 'admin' && $document['employee_id'] != $user->id && !$document['is_company_document']) {
            return $this->respondError('Unauthorized', 403);
        }

        $path = WRITEPATH . $document['file_url'];
        
        if (!file_exists($path)) {
            return $this->respondError('File not found on server', 404);
        }

        return $this->response->download($path, null);
    }

    public function show($id = null)
    {
        $user = $this->getUser();
        $document = $this->documentModel->find($id);

        if (!$document) {
            return $this->respondError('Document not found', 404);
        }

        // Check permissions
        if ($user->role !== 'admin' && $document['employee_id'] != $user->id && !$document['is_company_document']) {
            return $this->respondError('Unauthorized', 403);
        }

        return $this->respondSuccess($document);
    }

    public function update($id = null)
    {
        $user = $this->getUser();
        $document = $this->documentModel->find($id);

        if (!$document) {
            return $this->respondError('Document not found', 404);
        }

        // Only admin can update documents
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);

        // TODO: Handle file replacement on update if needed

        if ($this->documentModel->update($id, $data)) {
            return $this->respondSuccess(null, 'Document updated successfully');
        }

        return $this->respondError('Failed to update document', 500, $this->documentModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        $document = $this->documentModel->find($id);

        if (!$document) {
            return $this->respondError('Document not found', 404);
        }

        // Only admin can delete documents
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }
        
        // Try to delete file from disk
        if ($document['file_url']) {
            $path = WRITEPATH . $document['file_url'];
            if (file_exists($path)) {
                unlink($path);
            }
        }

        if ($this->documentModel->delete($id)) {
            return $this->respondSuccess(null, 'Document deleted successfully');
        }

        return $this->respondError('Failed to delete document', 500);
    }

    public function getEmployeeDocuments($employeeId)
    {
        $user = $this->getUser();
        // Only admin or the employee themselves can view
        if ($user->role !== 'admin' && $user->id != $employeeId) {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->documentModel->where('employee_id', $employeeId)->findAll();
        return $this->respondSuccess($data);
    }
}
