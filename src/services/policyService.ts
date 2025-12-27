import api from './api';

export interface Policy {
    id: string;
    title: string;
    category: string;
    description?: string;
    version: string;
    effectiveDate: string;
    lastUpdated: string;
    status: string;
    acknowledged: number;
    totalEmployees: number;
    document_url?: string;
}

export const policyService = {
    getAll: async () => {
        const response = await api.get('/policies');
        return response.data.data || response.data;
    },

    acknowledge: async (id: string) => {
        const response = await api.post(`/policies/${id}/acknowledge`);
        return response.data.data || response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/policies', data, {
            headers: {
                // If data is FormData, let browser/axios set Content-Type
                ...(data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
            }
        });
        return response.data.data || response.data;
    },

    // The existing update method is replaced/modified here
    update: async (id: string, data: FormData): Promise<Policy> => {
        const response = await api.post<any>(`/policies/${id}/update`, data, { // Using 'any' for ApiResponse<Policy> if not defined
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data.data;
    },

    download: async (id: string, filename: string) => {
        const response = await api.get(`/policies/download/${id}`, {
            responseType: 'blob',
        });

        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },



    archive: async (id: string) => {
        // Assuming archive is a soft delete or specific status update
        const response = await api.put(`/policies/${id}`, { status: 'Archived' });
        return response.data.data || response.data;
    },

    sendReminder: async (id: string) => {
        const response = await api.post(`/policies/${id}/remind`);
        return response.data.data || response.data;
    }
};
