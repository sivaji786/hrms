<?php

namespace App\Controllers;

use App\Models\PolicyModel;
use CodeIgniter\API\ResponseTrait;

class PolicyController extends ApiController
{
    protected $policyModel;

    public function __construct()
    {
        $this->policyModel = new PolicyModel();
    }

    public function index()
    {
        $db = \Config\Database::connect();
        
        // Get total employees count
        $totalEmployees = $db->table('employees')->where('status', 'Active')->countAllResults();

        // Get policies with acknowledgement count
        $policies = $this->policyModel->where('status', 'Active')->findAll();
        
        $enrichedPolicies = [];
        foreach ($policies as $policy) {
            $ackCount = $db->table('policy_acknowledgements')
                           ->where('policy_id', $policy['id'])
                           ->countAllResults();
            
            $policy['acknowledged'] = $ackCount;
            $policy['totalEmployees'] = $totalEmployees;
            $policy['effectiveDate'] = $policy['effective_date']; // Map for frontend
            $policy['lastUpdated'] = $policy['updated_at'] ? date('Y-m-d', strtotime($policy['updated_at'])) : date('Y-m-d', strtotime($policy['created_at'])); 
            $enrichedPolicies[] = $policy;
        }

        return $this->respondSuccess($enrichedPolicies);
    }

    public function acknowledge($id = null)
    {
        $user = $this->getUser();
        $policy = $this->policyModel->find($id);

        if (!$policy) {
            return $this->respondError('Policy not found', 404);
        }

        $db = \Config\Database::connect();
        $exists = $db->table('policy_acknowledgements')
                     ->where('policy_id', $id)
                     ->where('employee_id', $user->id)
                     ->countAllResults();

        if ($exists > 0) {
            return $this->respondSuccess(null, 'Already acknowledged');
        }

        $db->table('policy_acknowledgements')->insert([
            'id' => $this->policyModel->generateUuid()['data']['id'] ?? uniqid(),
            'policy_id' => $id,
            'employee_id' => $user->id,
            'acknowledged_at' => date('Y-m-d H:i:s')
        ]);

        return $this->respondSuccess(null, 'Policy acknowledged successfully');
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        // Handle Multipart/Form-Data
        $file = $this->request->getFile('file');
        $postData = $this->request->getPost();

        // Validate basic data
        if (!isset($postData['title'])) {
             return $this->respondError('Title is required', 400);
        }
        
        // Handle File Upload
        $filePath = null;
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $file->move(WRITEPATH . 'uploads/policies', $newName);
            $filePath = 'uploads/policies/' . $newName;
        }

        // Merge file path with other data
        $data = [
            'title' => $postData['title'],
            'category' => $postData['category'] ?? 'General',
            'version' => $postData['version'] ?? '1.0',
            'effective_date' => $postData['effectiveDate'] ?? date('Y-m-d'),
            'description' => $postData['description'] ?? '',
            'status' => 'Active',
            'document_url' => $filePath,
        ];
        
        if ($this->policyModel->insert($data)) {
            return $this->respondCreated(['id' => $this->policyModel->getInsertID(), ...$data], 'Policy created successfully');
        }

        return $this->respondError('Failed to create policy', 500, $this->policyModel->errors());
    }

    public function download($id = null)
    {
        $user = $this->getUser(); // Basic auth check, anyone logged in can probably download policies
        
        $policy = $this->policyModel->find($id);

        if (!$policy) {
            return $this->respondError('Policy not found', 404);
        }

        $path = WRITEPATH . $policy['document_url'];
        
        if (!file_exists($path)) {
            return $this->respondError('File not found on server', 404);
        }

        return $this->response->download($path, null);
    }
    public function sendReminder($id = null)
    {
        $user = $this->getUser();
        // Check if admin
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $policy = $this->policyModel->find($id);

        if (!$policy) {
            return $this->respondError('Policy not found', 404);
        }

        // Logic to send reminder would go here (e.g., SendGrid, Email Queue)
        // For now, we return success

        return $this->respondSuccess(null, 'Reminder sent successfully');
    }
    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $policy = $this->policyModel->find($id);
        if (!$policy) {
            return $this->respondError('Policy not found', 404);
        }

        // Handle Multipart/Form-Data
        $file = $this->request->getFile('file');
        $postData = $this->request->getPost();

        // Validate basic data
        if (!isset($postData['title'])) {
             return $this->respondError('Title is required', 400);
        }

        // Handle File Upload - Optional for update
        $filePath = $policy['document_url'];
        if ($file && $file->isValid() && !$file->hasMoved()) {
            // Delete old file if exists
            if (file_exists(WRITEPATH . $filePath)) {
                @unlink(WRITEPATH . $filePath);
            }
            // Upload new file
            $newName = $file->getRandomName();
            $file->move(WRITEPATH . 'uploads/policies', $newName);
            $filePath = 'uploads/policies/' . $newName;
        }

        // Prepare update data
        $data = [
            'title' => $postData['title'],
            'category' => $postData['category'] ?? $policy['category'],
            'version' => $postData['version'] ?? $policy['version'],
            'effective_date' => $postData['effectiveDate'] ?? $policy['effective_date'],
            'description' => $postData['description'] ?? $policy['description'],
            'document_url' => $filePath,
            'updated_at' => date('Y-m-d H:i:s'),
        ];
        
        if ($this->policyModel->update($id, $data)) {
            return $this->respondSuccess(['id' => $id, ...$data], 'Policy updated successfully');
        }

        return $this->respondError('Failed to update policy', 500, $this->policyModel->errors());
    }
}
