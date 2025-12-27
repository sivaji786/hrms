<?php

namespace App\Controllers;

use App\Models\AssetCategoryModel;
use CodeIgniter\API\ResponseTrait;

class AssetCategoryController extends ApiController
{
    protected $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new AssetCategoryModel();
    }

    public function index()
    {
        $data = $this->categoryModel->findAll();
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        if ($user->role !== 'admin') {
             return $this->respondError('Unauthorized', 403);
        }

        $data = $this->request->getJSON(true);
        
        if ($this->categoryModel->insert($data)) {
            return $this->respondCreated(['id' => $this->categoryModel->getInsertID(), ...$data], 'Category created successfully');
        }

        return $this->respondError('Failed to create category', 500, $this->categoryModel->errors());
    }
}
