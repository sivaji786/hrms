import api from './api';

export interface LeaveRequest {
    id: string;
    employee: string;
    empId: string;
    department: string;
    leaveType: string;
    from: string;
    to: string;
    days: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
    created_at: string;
}

export interface LeaveStats {
    pendingRequests: number;
    approvedThisMonth: number;
    rejectedThisMonth: number;
    onLeaveToday: number;
}

export interface LeaveType {
    id: string;
    name: string;
    days_allowed: number;
}

export interface LeaveBalance {
    empId: string;
    employee: string;
    department: string;
    casual: number;
    sick: number;
    privilege: number;
    compensatory: number;
}

export const leaveService = {
    getLeaves: async () => {
        const response = await api.get('/leaves');
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/leaves/stats');
        return response.data;
    },

    getTypes: async () => {
        const response = await api.get('/leaves/types');
        return response.data;
    },

    getBalances: async () => {
        const response = await api.get('/leaves/balances');
        return response.data;
    },

    getEmployees: async () => {
        const response = await api.get('/employees');
        return response.data;
    },

    applyLeave: async (data: any) => {
        const response = await api.post('/leaves', data);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await api.put(`/leaves/${id}`, { status });
        return response.data;
    },

    deleteLeave: async (id: string) => {
        const response = await api.delete(`/leaves/${id}`);
        return response.data;
    }
};
