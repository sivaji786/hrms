import api from './api';

export interface Holiday {
    id: string;
    name: string;
    date: string;
    day: string;
    type: string;
    location: string;
    description: string;
    is_optional: boolean | number; // Backend might send 0/1, frontend might use boolean
}

export const holidayService = {
    getHolidays: async () => {
        const response = await api.get('/holidays');
        return response.data.data;
    },

    createHoliday: async (data: Omit<Holiday, 'id' | 'day'>) => {
        const response = await api.post('/holidays', data);
        return response.data;
    },

    updateHoliday: async (id: string, data: Partial<Holiday>) => {
        const response = await api.put(`/holidays/${id}`, data);
        return response.data;
    },

    deleteHoliday: async (id: string) => {
        const response = await api.delete(`/holidays/${id}`);
        return response.data;
    },
};
