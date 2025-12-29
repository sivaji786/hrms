import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_URL,
    // Don't set Content-Type here - let axios auto-detect based on data type
    // For JSON: axios will set 'application/json'
    // For FormData: axios will set 'multipart/form-data' with boundary
});

// Add a request interceptor to add the auth token and handle Content-Type
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Only set Content-Type to JSON if data is not FormData
        if (config.data && !(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        // If data is FormData, axios will automatically set the correct Content-Type with boundary

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if needed
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const handleApiError = (error: any) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const message = error.response.data.message || error.response.data.error || 'Something went wrong';
        return new Error(message);
    } else if (error.request) {
        // The request was made but no response was received
        return new Error('No response from server');
    } else {
        // Something happened in setting up the request that triggered an Error
        return new Error(error.message);
    }
};

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        return response.data.data || response.data;
    },
    register: async (data: any) => {
        const response = await api.post('/auth/register', data);
        return response.data.data || response.data;
    },
    me: async () => {
        const response = await api.get('/auth/me');
        return response.data.data || response.data;
    },
};

export const employeeService = {
    getAll: async (params?: any) => {
        const response = await api.get('/employees', { params });
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/employees/${id}`);
        return response.data.data || response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/employees', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/employees/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    },
};

export const attendanceService = {
    checkIn: async (data: any) => {
        const response = await api.post('/attendance/check-in', data);
        return response.data.data || response.data;
    },
    checkOut: async (data: any) => {
        const response = await api.post('/attendance/check-out', data);
        return response.data.data || response.data;
    },
    getHistory: async (userId: string) => {
        const response = await api.get(`/attendance/history/${userId}`);
        return response.data.data || response.data;
    },
    getEmployeeAttendance: async (employeeId: string, month?: number, year?: number) => {
        const response = await api.get(`/attendance/history/${employeeId}`, { params: { month, year } });
        return response.data.data || response.data;
    },
    getTodayAttendance: async () => {
        const response = await api.get('/attendance/today');
        return response.data.data || response.data;
    },
    getAttendanceByDate: async (date: string) => {
        const response = await api.get(`/attendance/date/${date}`);
        return response.data.data || response.data;
    },
    updateAttendance: async (id: string, data: any) => {
        const response = await api.put(`/attendance/${id}`, data);
        return response.data.data || response.data;
    },
    bulkUpsertAttendance: async (records: any[]) => {
        const response = await api.post('/attendance/bulk', { records });
        return response.data.data || response.data;
    },
};

export const leaveService = {
    getAll: async () => {
        const response = await api.get('/leaves');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/leaves', data);
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await api.put(`/leaves/${id}/status`, { status });
        return response.data;
    },
};

export const payrollService = {
    getAll: async () => {
        const response = await api.get('/payroll');
        return response.data.data || response.data;
    },
    getEmployeePayroll: async (employeeId: string) => {
        const response = await api.get(`/payroll/employee/${employeeId}`);
        return response.data.data || response.data;
    },
    generate: async (data: any) => {
        const response = await api.post('/payroll/generate', data);
        return response.data.data || response.data;
    },
    getStructures: async () => {
        const response = await api.get('/salary-structures');
        return response.data.data || response.data;
    },
    createStructure: async (data: any) => {
        const response = await api.post('/salary-structures', data);
        return response.data.data || response.data;
    },
    getStats: async (location?: string) => {
        const response = await api.get('/payroll/stats', { params: { location } });
        return response.data.data || response.data;
    },
    getPendingSettlements: async () => {
        const response = await api.get('/payroll/pending-settlements');
        return response.data.data || response.data;
    },
};

export const recruitmentService = {
    getJobs: async () => {
        const response = await api.get('/jobs');
        return response.data;
    },
    createJob: async (data: any) => {
        const response = await api.post('/jobs', data);
        return response.data;
    },
    getCandidates: async () => {
        const response = await api.get('/candidates');
        return response.data;
    },
    createCandidate: async (data: any) => {
        const response = await api.post('/candidates', data);
        return response.data;
    },
    getApplications: async () => {
        const response = await api.get('/applications');
        return response.data;
    },
    createApplication: async (data: any) => {
        const response = await api.post('/applications', data);
        return response.data;
    },
    getInterviews: async () => {
        const response = await api.get('/interviews');
        return response.data;
    },
    createInterview: async (data: any) => {
        const response = await api.post('/interviews', data);
        return response.data;
    },
};

export const trainingService = {
    // Programs
    getPrograms: async () => {
        const response = await api.get('/training/programs');
        return response.data.data;
    },
    getProgram: async (id: string) => {
        const response = await api.get(`/training/programs/${id}`);
        return response.data.data;
    },
    createProgram: async (data: any) => {
        const response = await api.post('/training/programs', data);
        return response.data.data;
    },
    updateProgram: async (id: string, data: any) => {
        const response = await api.put(`/training/programs/${id}`, data);
        return response.data.data;
    },
    deleteProgram: async (id: string) => {
        const response = await api.delete(`/training/programs/${id}`);
        return response.data.data;
    },
    getStats: async () => {
        const response = await api.get('/training/programs/stats');
        return response.data.data;
    },

    // Enrollments
    getEnrollments: async () => {
        const response = await api.get('/training/enrollments');
        return response.data.data;
    },
    enroll: async (data: any) => {
        const response = await api.post('/training/enrollments', data);
        return response.data.data;
    },
    updateEnrollment: async (id: string, data: any) => {
        const response = await api.put(`/training/enrollments/${id}`, data);
        return response.data.data;
    },
    deleteEnrollment: async (id: string) => {
        const response = await api.delete(`/training/enrollments/${id}`);
        return response.data.data;
    },
    getProgramEnrollments: async (programId: string) => {
        const response = await api.get(`/training/enrollments/program/${programId}`);
        return response.data.data;
    }
};

export const performanceService = {
    // Performance Reviews
    getReviews: async () => {
        const response = await api.get('/performance-reviews');
        return response.data.data || response.data;
    },
    getReview: async (id: string) => {
        const response = await api.get(`/performance-reviews/${id}`);
        return response.data.data || response.data;
    },
    createReview: async (data: any) => {
        const response = await api.post('/performance-reviews', data);
        return response.data.data || response.data;
    },
    updateReview: async (id: string, data: any) => {
        const response = await api.put(`/performance-reviews/${id}`, data);
        return response.data.data || response.data;
    },
    deleteReview: async (id: string) => {
        const response = await api.delete(`/performance-reviews/${id}`);
        return response.data.data || response.data;
    },
    getEmployeeReviews: async (employeeId: string) => {
        const response = await api.get(`/performance-reviews/employee/${employeeId}`);
        return response.data.data || response.data;
    },
    getStats: async () => {
        const response = await api.get('/performance-reviews/stats/overview');
        return response.data.data || response.data;
    },
    getDepartmentStats: async () => {
        const response = await api.get('/performance-reviews/stats/departments');
        return response.data.data || response.data;
    },

    // Goals
    getGoals: async () => {
        const response = await api.get('/goals');
        return response.data.data || response.data;
    },
    getGoal: async (id: string) => {
        const response = await api.get(`/goals/${id}`);
        return response.data.data || response.data;
    },
    createGoal: async (data: any) => {
        const response = await api.post('/goals', data);
        return response.data.data || response.data;
    },
    updateGoal: async (id: string, data: any) => {
        const response = await api.put(`/goals/${id}`, data);
        return response.data.data || response.data;
    },
    deleteGoal: async (id: string) => {
        const response = await api.delete(`/goals/${id}`);
        return response.data.data || response.data;
    },
    updateGoalProgress: async (id: string, progress: number) => {
        const response = await api.put(`/goals/${id}/progress`, { progress });
        return response.data.data || response.data;
    },
    getEmployeeGoals: async (employeeId: string) => {
        const response = await api.get(`/goals/employee/${employeeId}`);
        return response.data.data || response.data;
    },

    // KRAs (Key Result Areas)
    getKRAs: async () => {
        const response = await api.get('/kras');
        return response.data.data || response.data;
    },
    getKRA: async (id: string) => {
        const response = await api.get(`/kras/${id}`);
        return response.data.data || response.data;
    },
    createKRA: async (data: any) => {
        const response = await api.post('/kras', data);
        return response.data.data || response.data;
    },
    updateKRA: async (id: string, data: any) => {
        const response = await api.put(`/kras/${id}`, data);
        return response.data.data || response.data;
    },
    deleteKRA: async (id: string) => {
        const response = await api.delete(`/kras/${id}`);
        return response.data.data || response.data;
    },
    getEmployeeKRAs: async (employeeId: string) => {
        const response = await api.get(`/kras/employee/${employeeId}`);
        return response.data.data || response.data;
    },

    // 360° Feedback
    getFeedback: async () => {
        const response = await api.get('/feedback');
        return response.data.data || response.data;
    },
    getFeedbackById: async (id: string) => {
        const response = await api.get(`/feedback/${id}`);
        return response.data.data || response.data;
    },
    submitFeedback: async (data: any) => {
        const response = await api.post('/feedback', data);
        return response.data.data || response.data;
    },
    getEmployeeFeedback: async (employeeId: string) => {
        const response = await api.get(`/feedback/employee/${employeeId}`);
        return response.data.data || response.data;
    },
    getReviewFeedback: async (reviewId: string) => {
        const response = await api.get(`/feedback/review/${reviewId}`);
        return response.data.data || response.data;
    },

    // Appraisal Cycles
    getCycles: async () => {
        const response = await api.get('/appraisal-cycles');
        return response.data.data || response.data;
    },
    getCycle: async (id: string) => {
        const response = await api.get(`/appraisal-cycles/${id}`);
        return response.data.data || response.data;
    },
    createCycle: async (data: any) => {
        const response = await api.post('/appraisal-cycles', data);
        return response.data.data || response.data;
    },
    updateCycle: async (id: string, data: any) => {
        const response = await api.put(`/appraisal-cycles/${id}`, data);
        return response.data.data || response.data;
    },
    deleteCycle: async (id: string) => {
        const response = await api.delete(`/appraisal-cycles/${id}`);
        return response.data.data || response.data;
    },
    getActiveCycles: async () => {
        const response = await api.get('/appraisal-cycles/active/list');
        return response.data.data || response.data;
    },
    getCycleStats: async () => {
        const response = await api.get('/appraisal-cycles/stats/overview');
        return response.data.data || response.data;
    },
};



export const assetService = {
    getAssets: async () => {
        const response = await api.get('/assets');
        return response.data;
    },
    createAsset: async (data: any) => {
        const response = await api.post('/assets', data);
        return response.data;
    },
    getCategories: async () => {
        const response = await api.get('/asset-categories');
        return response.data;
    },
    createCategory: async (data: any) => {
        const response = await api.post('/asset-categories', data);
        return response.data;
    },
    getAssignments: async () => {
        const response = await api.get('/asset-assignments');
        return response.data;
    },
    assignAsset: async (data: any) => {
        const response = await api.post('/asset-assignments', data);
        return response.data;
    },
};

export const expenseService = {
    getAll: async () => {
        const response = await api.get('/expenses');
        return response.data.data || response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/expenses', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/expenses/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/expenses/${id}`);
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/expenses/stats');
        return response.data.data || response.data;
    },
};

export const helpdeskService = {
    getTickets: async () => {
        const response = await api.get('/tickets');
        return response.data;
    },
    createTicket: async (data: any) => {
        const response = await api.post('/tickets', data);
        return response.data;
    },
    getComments: async (ticketId: string) => {
        const response = await api.get(`/tickets/${ticketId}/comments`);
        return response.data;
    },
    addComment: async (ticketId: string, data: any) => {
        const response = await api.post(`/tickets/${ticketId}/comments`, data);
        return response.data;
    },
};

export const companySettingsService = {
    getSettings: () => api.get('/company-settings'),
    updateSettings: (data: any) => api.post('/company-settings', data),
};

export const organizationService = {
    getLocations: async () => {
        const response = await api.get('/locations');
        return response.data.data || response.data;
    },
    createLocation: async (data: any) => {
        const response = await api.post('/locations', data);
        return response.data;
    },
    getDepartments: async () => {
        const response = await api.get('/departments');
        return response.data.data || response.data;
    },
    createDepartment: async (data: any) => {
        const response = await api.post('/departments', data);
        return response.data;
    },
    updateDepartment: async (id: string, data: any) => {
        const response = await api.put(`/departments/${id}`, data);
        return response.data;
    },
    deleteDepartment: async (id: string) => {
        const response = await api.delete(`/departments/${id}`);
        return response.data;
    },
    getRoles: async () => {
        const response = await api.get('/roles');
        return response.data.data || response.data;
    },
    createRole: async (data: any) => {
        const response = await api.post('/roles', data);
        return response.data;
    },
    updateRole: async (id: string, data: any) => {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    },
    deleteRole: async (id: string) => {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    },
};

export const shiftService = {
    getShifts: async () => {
        const response = await api.get('/shifts');
        return response.data.data || response.data;
    },
    createShift: async (data: any) => {
        const response = await api.post('/shifts', data);
        return response.data;
    },
    updateShift: async (id: string, data: any) => {
        const response = await api.put(`/shifts/${id}`, data);
        return response.data;
    },
    deleteShift: async (id: string) => {
        const response = await api.delete(`/shifts/${id}`);
        return response.data;
    },
    getEmployeeShifts: async () => {
        const response = await api.get('/employee-shifts');
        return response.data;
    },
    assignShift: async (data: any) => {
        const response = await api.post('/employee-shifts', data);
        return response.data;
    },
};

export const documentService = {
    getAll: async () => {
        const response = await api.get('/documents');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/documents', data);
        return response.data;
    },
    getEmployeeDocuments: async (employeeId: string) => {
        const response = await api.get(`/documents/employee/${employeeId}`);
        return response.data.data || response.data;
    },
    getPolicies: async () => {
        const response = await api.get('/policies');
        return response.data;
    },
    createPolicy: async (data: any) => {
        const response = await api.post('/policies', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/documents/${id}`, data);
        return response.data;
    },
};

export const travelService = {
    getAll: async () => {
        const response = await api.get('/travel-requests');
        return response.data.data || response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/travel-requests', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/travel-requests/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/travel-requests/${id}`);
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/travel-requests/stats');
        return response.data.data || response.data;
    },
};

export const dashboardService = {
    getStats: async (location?: string) => {
        const response = await api.get('/dashboard/stats', { params: { location } });
        return response.data;
    },
};

export default api;
