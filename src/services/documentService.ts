import api from './api';

export interface Document {
    id: string;
    name: string;
    type: string;
    file_url: string;
    expiry_date: string | null;
    status: string;
    created_at: string;
    size?: number; // Optional as it might not be in DB yet
}

export const documentService = {
    getMyDocuments: async () => {
        const response = await api.get('/documents');
        return response.data.data || response.data;
    },

    getEmployeeDocuments: async (employeeId: string) => {
        const response = await api.get(`/documents/employee/${employeeId}`);
        return response.data.data || response.data;
    },

    upload: async (data: FormData) => {
        const response = await api.post('/documents', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data || response.data;
    },

    download: async (id: string, filename: string) => {
        const response = await api.get(`/documents/download/${id}`, {
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
    }
};
