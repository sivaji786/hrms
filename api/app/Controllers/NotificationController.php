<?php

namespace App\Controllers;

use App\Models\NotificationModel;
use CodeIgniter\API\ResponseTrait;

class NotificationController extends ApiController
{
    protected $notificationModel;

    public function __construct()
    {
        $this->notificationModel = new NotificationModel();
    }

    public function index()
    {
        $user = $this->getUser();
        $data = $this->notificationModel->where('user_id', $user->id)->findAll();
        return $this->respondSuccess($data);
    }

    public function markAsRead($id = null)
    {
        $user = $this->getUser();
        $notification = $this->notificationModel->find($id);

        if (!$notification) {
            return $this->respondError('Notification not found', 404);
        }

        if ($notification['user_id'] !== $user->id) {
            return $this->respondError('Unauthorized', 403);
        }

        $this->notificationModel->update($id, ['is_read' => 1]);
        return $this->respondSuccess(null, 'Notification marked as read');
    }
    
    // Internal method to create notification (can be called by other controllers)
    // For API testing, we expose a create endpoint restricted to admin or self (for demo)
    public function create()
    {
        // In a real app, this might be internal only, but for testing:
        $user = $this->getUser();
        $data = $this->request->getJSON(true);
        
        // If user_id not provided, default to self (for testing)
        if (!isset($data['user_id'])) {
            $data['user_id'] = $user->id;
        }

        if ($this->notificationModel->insert($data)) {
             return $this->respondCreated(['id' => $this->notificationModel->getInsertID(), ...$data], 'Notification created');
        }
        return $this->respondError('Failed to create notification', 500, $this->notificationModel->errors());
    }
}
