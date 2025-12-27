import api, { handleApiError } from './api';

export interface Ticket {
    id: string;
    ticket_number: string;
    title: string;
    description: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    requester_id: string;
    assignee_id?: string;
    created_at: string;
    updated_at: string;
    due_date?: string;

    // UI Fields (mapped)
    ticketNumber?: string;
    submittedByName?: string;
    submittedByRole?: string;
    assignedToName?: string;
    submittedBy?: string; // requester_id
    assignedTo?: string; // assignee_id
    createdAt?: string;
    updatedAt?: string;
    dueDate?: string;
    slaStatus?: string;
    tags?: string[];
    attachments?: number;
    responseTime?: string;
    resolutionTime?: string;
    department?: string;
}

export interface TicketComment {
    id: string;
    ticket_id: string;
    user_id: string;
    comment: string;
    is_internal: boolean;
    created_at: string;
    // Extended
    userName?: string;
    userRole?: string;
}

const ticketService = {
    getAll: async () => {
        try {
            const response = await api.get('/tickets');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getById: async (id: string) => {
        try {
            const response = await api.get(`/tickets/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    create: async (data: any) => {
        try {
            const response = await api.post('/tickets', data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    update: async (id: string, data: any) => {
        try {
            const response = await api.put(`/tickets/${id}`, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    delete: async (id: string) => {
        try {
            await api.delete(`/tickets/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getComments: async (ticketId: string) => {
        try {
            const response = await api.get(`/tickets/${ticketId}/comments`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    addComment: async (ticketId: string, data: any) => {
        try {
            const response = await api.post(`/tickets/${ticketId}/comments`, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default ticketService;
