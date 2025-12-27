<?php

namespace App\Controllers;

use App\Models\TravelRequestModel;
use CodeIgniter\API\ResponseTrait;

class TravelRequestController extends ApiController
{
    protected $travelModel;

    public function __construct()
    {
        $this->travelModel = new TravelRequestModel();
    }

    public function index()
    {
        $user = $this->getUser();
        
        $builder = $this->travelModel->select('travel_requests.*, employees.first_name, employees.last_name, departments.name as department')
            ->join('employees', 'employees.id = travel_requests.employee_id')
            ->join('departments', 'departments.id = employees.department_id', 'left');

        if ($user->role !== 'admin') {
            $builder->where('travel_requests.employee_id', $user->id);
        }

        $data = $builder->findAll();
        
        // Format names and map fields for frontend
        foreach ($data as &$row) {
            $row['employeeName'] = $row['first_name'] . ' ' . $row['last_name'];
            $row['from'] = $row['origin']; // Map origin to 'from'
            $row['to'] = $row['destination']; // Map destination to 'to'
            $row['startDate'] = $row['start_date'];
            $row['endDate'] = $row['end_date'];
            $row['estimatedCost'] = $row['estimated_cost'];
            $row['actualCost'] = $row['actual_cost'];
            $row['tripType'] = $row['trip_type'];
            $row['travelMode'] = $row['travel_mode'];
        }

        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        $data = $this->request->getJSON(true);
        $data['employee_id'] = $user->id;
        $data['status'] = 'Pending';
        
        // Map frontend fields to DB fields
        if (isset($data['from'])) $data['origin'] = $data['from'];
        if (isset($data['to'])) $data['destination'] = $data['to'];
        if (isset($data['startDate'])) $data['start_date'] = $data['startDate'];
        if (isset($data['endDate'])) $data['end_date'] = $data['endDate'];
        if (isset($data['estimatedCost'])) $data['estimated_cost'] = $data['estimatedCost'];
        if (isset($data['tripType'])) $data['trip_type'] = $data['tripType'];
        if (isset($data['travelMode'])) $data['travel_mode'] = $data['travelMode'];

        if ($this->travelModel->insert($data)) {
            return $this->respondCreated(['id' => $this->travelModel->getInsertID(), ...$data], 'Travel request submitted');
        }

        return $this->respondError('Failed to submit request', 500, $this->travelModel->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        
        // If updating status, add approval details
        if (isset($data['status']) && in_array($data['status'], ['Approved', 'Rejected'])) {
            $user = $this->getUser();
            $data['approver_id'] = $user->id;
        }

        // Map frontend fields to DB fields
        if (isset($data['from'])) $data['origin'] = $data['from'];
        if (isset($data['to'])) $data['destination'] = $data['to'];
        if (isset($data['startDate'])) $data['start_date'] = $data['startDate'];
        if (isset($data['endDate'])) $data['end_date'] = $data['endDate'];
        if (isset($data['estimatedCost'])) $data['estimated_cost'] = $data['estimatedCost'];
        if (isset($data['actualCost'])) $data['actual_cost'] = $data['actualCost'];
        if (isset($data['tripType'])) $data['trip_type'] = $data['tripType'];
        if (isset($data['travelMode'])) $data['travel_mode'] = $data['travelMode'];

        if ($this->travelModel->update($id, $data)) {
            return $this->respondSuccess($data, 'Travel request updated successfully');
        }

        return $this->respondError('Failed to update request', 500, $this->travelModel->errors());
    }

    public function delete($id = null)
    {
        if ($this->travelModel->delete($id)) {
            return $this->respondDeleted(['id' => $id], 'Travel request deleted successfully');
        }
        return $this->respondError('Failed to delete request', 500);
    }

    public function show($id = null)
    {
        $data = $this->travelModel->select('travel_requests.*, employees.first_name, employees.last_name, departments.name as department')
            ->join('employees', 'employees.id = travel_requests.employee_id')
            ->join('departments', 'departments.id = employees.department_id', 'left')
            ->find($id);

        if ($data) {
             $data['employeeName'] = $data['first_name'] . ' ' . $data['last_name'];
             $data['from'] = $data['origin'];
             $data['to'] = $data['destination'];
             $data['startDate'] = $data['start_date'];
             $data['endDate'] = $data['end_date'];
             $data['estimatedCost'] = $data['estimated_cost'];
             $data['actualCost'] = $data['actual_cost'];
             $data['tripType'] = $data['trip_type'];
             $data['travelMode'] = $data['travel_mode'];
             return $this->respondSuccess($data);
        }
        return $this->respondError('Request not found', 404);
    }

    public function stats()
    {
        $user = $this->getUser();
        $builder = $this->travelModel;

        if ($user->role !== 'admin') {
            $builder->where('employee_id', $user->id);
        }

        $totalRequests = $builder->countAllResults(false);
        $pendingRequests = $builder->where('status', 'Pending')->countAllResults(false);
        $completedTrips = $builder->where('status', 'Completed')->countAllResults(false);
        
        // Reset for sums
        $sums = $this->travelModel->selectSum('estimated_cost')->selectSum('actual_cost');
        if ($user->role !== 'admin') {
            $sums->where('employee_id', $user->id);
        }
        $sumResult = $sums->first();
        
        $totalEstimatedCost = $sumResult['estimated_cost'] ?? 0;
        $totalActualCost = $sumResult['actual_cost'] ?? 0;
        $savings = $totalEstimatedCost - $totalActualCost;

        return $this->respondSuccess([
            'totalRequests' => $totalRequests,
            'pendingRequests' => $pendingRequests,
            'completedTrips' => $completedTrips,
            'totalEstimatedCost' => (float)$totalEstimatedCost,
            'totalActualCost' => (float)$totalActualCost,
            'savings' => (float)$savings
        ]);
    }
}
