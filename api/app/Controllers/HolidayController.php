<?php

namespace App\Controllers;

use App\Models\HolidayModel;
use CodeIgniter\API\ResponseTrait;

class HolidayController extends ApiController
{
    protected $holidayModel;

    public function __construct()
    {
        $this->holidayModel = new HolidayModel();
    }

    // Get all holidays
    public function index()
    {
        $data = $this->holidayModel->orderBy('date', 'ASC')->findAll();
        return $this->respondSuccess($data);
    }

    // Create holiday
    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $rules = [
            'name'     => 'required',
            'date'     => 'required|valid_date',
            'type'     => 'required',
            'location' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->respondError('Validation failed', 400, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        
        // Generate UUID if not provided
        if (empty($data['id'])) {
            $data['id'] = $this->generateUuid();
        }
        
        // Calculate day name
        $data['day'] = date('l', strtotime($data['date']));

        if ($this->holidayModel->insert($data)) {
            return $this->respondCreated($data, 'Holiday created successfully');
        }

        return $this->respondError('Failed to create holiday', 500, $this->holidayModel->errors());
    }

    // Update holiday
    public function update($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $exist = $this->holidayModel->find($id);
        if (!$exist) {
            return $this->respondError('Holiday not found', 404);
        }

        $data = $this->request->getRawInput();
        
        // Update day if date changed
        if (isset($data['date'])) {
            $data['day'] = date('l', strtotime($data['date']));
        }

        if ($this->holidayModel->update($id, $data)) {
            return $this->respondSuccess(null, 'Holiday updated successfully');
        }

        return $this->respondError('Failed to update holiday', 500, $this->holidayModel->errors());
    }

    // Delete holiday
    public function delete($id = null)
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized', 403);
        }

        $exist = $this->holidayModel->find($id);
        if (!$exist) {
            return $this->respondError('Holiday not found', 404);
        }

        if ($this->holidayModel->delete($id)) {
            return $this->respondSuccess(null, 'Holiday deleted successfully');
        }

        return $this->respondError('Failed to delete holiday', 500);
    }
    
    private function generateUuid()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
