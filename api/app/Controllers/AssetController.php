<?php

namespace App\Controllers;

use App\Models\AssetModel;
use CodeIgniter\API\ResponseTrait;

class AssetController extends ApiController
{
    protected $assetModel;

    public function __construct()
    {
        $this->assetModel = new AssetModel();
    }

    public function index()
    {
        $assets = $this->assetModel->findAllWithDetails();
        
        $data = array_map(function($asset) {
            // Map backend fields to frontend expected structure if needed, 
            // or just return enriched data.
            // Frontend expects: assignedToName, category (name)
            $asset['assigned_to_name'] = trim(($asset['assigned_to_first_name'] ?? '') . ' ' . ($asset['assigned_to_last_name'] ?? ''));
            $asset['assigned_to'] = $asset['assigned_to_code'] ?? null;
            $asset['category'] = $asset['category_name'] ?? null;
            return $asset;
        }, $assets);

        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        // if ($user->role !== 'admin') {
        //      return $this->respondError('Unauthorized', 403);
        // }

        $data = $this->request->getJSON(true);
        
        // Handle category: if name is passed, we might need to look it up, 
        // but ideally frontend sends category_id. 
        // For now, let's assume frontend will be updated to send category_id.
        // If frontend sends 'category' as name, we need to handle it.
        
        if (isset($data['category']) && !isset($data['category_id'])) {
             // Try to find category by name
             $categoryModel = new \App\Models\AssetCategoryModel();
             $category = $categoryModel->where('name', $data['category'])->first();
             if ($category) {
                 $data['category_id'] = $category['id'];
             } else {
                 // Create new category? Or error? 
                 // Let's create it for better UX if it doesn't exist
                 $newCategory = [
                     'name' => $data['category']
                 ];
                 $categoryModel->insert($newCategory);
                 $data['category_id'] = $categoryModel->getInsertID();
             }
        }

        if ($this->assetModel->insert($data)) {
            return $this->respondCreated(['id' => $this->assetModel->getInsertID(), ...$data], 'Asset created successfully');
        }

        return $this->respondError('Failed to create asset', 500, $this->assetModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->assetModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Asset not found', 404);
    }
}
