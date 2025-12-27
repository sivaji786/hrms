<?php

namespace App\Controllers;

use App\Models\LocationModel;
use CodeIgniter\API\ResponseTrait;

class LocationController extends ApiController
{
    protected $locationModel;

    public function __construct()
    {
        $this->locationModel = new LocationModel();
    }

    public function index()
    {
        $data = $this->locationModel->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->locationModel->insert($data)) {
            return $this->respondCreated(['id' => $this->locationModel->getInsertID(), ...$data], 'Location created successfully');
        }

        return $this->respondError('Failed to create location', 500, $this->locationModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->locationModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Location not found', 404);
    }
}
