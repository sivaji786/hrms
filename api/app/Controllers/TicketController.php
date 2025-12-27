<?php

namespace App\Controllers;

use App\Models\TicketModel;
use CodeIgniter\API\ResponseTrait;

class TicketController extends ApiController
{
    protected $ticketModel;

    public function __construct()
    {
        $this->ticketModel = new TicketModel();
    }

    public function index()
    {
        $user = $this->getUser();
        if ($user->role === 'admin') {
            $data = $this->ticketModel->findAll();
        } else {
            $data = $this->ticketModel->where('requester_id', $user->id)->findAll();
        }
        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        $data = $this->request->getJSON(true);
        
        // Allow admin to set requester_id, otherwise default to current user
        if ($user->role !== 'admin' || !isset($data['requester_id'])) {
            $data['requester_id'] = $user->id;
        } 
        
        // If ticket_number is not provided, generate one
        if (!isset($data['ticket_number'])) {
            $data['ticket_number'] = 'TKT-' . strtoupper(substr(uniqid(), -6));
        }

        if (empty($data['status'])) {
            $data['status'] = 'Open';
        }
        
        if ($this->ticketModel->insert($data)) {
             $newTicketId = $this->ticketModel->getInsertID();
             $newTicket = $this->ticketModel->find($newTicketId);
             // Ensure the ID is returned if it's a UUID and getInsertID() doesn't return it correctly for UUIDs in some CI4 configs
             if (!$newTicket) {
                 // Fallback if find fails immediately (unlikely but possible with replication lag etc, but here just local)
                 // Or if insertID isn't working for UUIDs. user provided ID? Model generates it.
                 // The model `generateId` uses UUID. `getInsertID` might return 0.
                 // We should probably rely on the data we sent if we generated the ID, but the model does it.
                 // Let's assume the model generates it in `beforeInsert`.
                 // Ideally we should return the full object.
                 // Let's try to find it by ticket_number as it is unique
                 $newTicket = $this->ticketModel->where('ticket_number', $data['ticket_number'])->first();
             }
            return $this->respondCreated($newTicket, 'Ticket created successfully');
        }

        return $this->respondError('Failed to create ticket', 500, $this->ticketModel->errors());
    }

    public function show($id = null)
    {
        $data = $this->ticketModel->find($id);
        if ($data) {
             return $this->respondSuccess($data);
        }
        return $this->respondError('Ticket not found', 404);
    }

    public function update($id = null)
    {
        $user = $this->getUser();
        $ticket = $this->ticketModel->find($id);

        if (!$ticket) {
            return $this->respondError('Ticket not found', 404);
        }

        // Access control: Admin or the requester can update? 
        // Usually users can only update their own tickets (e.g. close them, or add comments - separate controller).
        // Admins/Agents can update status, priority, assignee.
        
        // For simplicity, allowing update if admin or owner.
        if ($user->role !== 'admin' && $ticket['requester_id'] !== $user->id) {
             return $this->respondError('Unauthorized access', 403);
        }

        $data = $this->request->getJSON(true);

        if ($this->ticketModel->update($id, $data)) {
            $updatedTicket = $this->ticketModel->find($id);
            return $this->respondSuccess($updatedTicket, 'Ticket updated successfully');
        }

        return $this->respondError('Failed to update ticket', 500, $this->ticketModel->errors());
    }

    public function delete($id = null)
    {
        $user = $this->getUser();
        $ticket = $this->ticketModel->find($id);

        if (!$ticket) {
            return $this->respondError('Ticket not found', 404);
        }

        if ($user->role !== 'admin') {
            return $this->respondError('Unauthorized access', 403);
        }

        if ($this->ticketModel->delete($id)) {
            return $this->respondDeleted(null, 'Ticket deleted successfully');
        }

        return $this->respondError('Failed to delete ticket', 500);
    }
}
