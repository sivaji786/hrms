<?php

namespace App\Controllers;

use App\Models\TicketCommentModel;
use CodeIgniter\API\ResponseTrait;

class TicketCommentController extends ApiController
{
    protected $commentModel;

    public function __construct()
    {
        $this->commentModel = new TicketCommentModel();
    }

    public function index($ticketId = null)
    {
        $data = $this->commentModel->where('ticket_id', $ticketId)->findAll();
        return $this->respondSuccess($data);
    }

    public function create($ticketId = null)
    {
        $user = $this->getUser();
        $data = $this->request->getJSON(true);
        $data['ticket_id'] = $ticketId;
        $data['user_id'] = $user->id; // Using user_id here as per schema
        
        if ($this->commentModel->insert($data)) {
            return $this->respondCreated(['id' => $this->commentModel->getInsertID(), ...$data], 'Comment added successfully');
        }

        return $this->respondError('Failed to add comment', 500, $this->commentModel->errors());
    }
}
