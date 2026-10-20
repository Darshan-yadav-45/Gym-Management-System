import api from './api';

/**
 * Admin service — all calls require ADMIN role JWT.
 * The server enforces authorization independently of this client.
 */
export const adminService = {

    getDashboardMetrics: async () => {
        const response = await api.get('/admin/dashboard/metrics');
        return response.data;
    },

    // ── Members Management ───────────────────────────────────────────────────

    getMembers: async (page = 0, size = 20, search = '', status = '') => {
        const params = new URLSearchParams({ page, size });
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        const response = await api.get(`/admin/members?${params.toString()}`);
        return response.data;
    },

    getUsers: async (page = 0, size = 20, search = '', status = '') => {
        const params = new URLSearchParams({ page, size });
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        const response = await api.get(`/admin/users?${params.toString()}`);
        return response.data;
    },

    getUser: async (userId) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },

    toggleUserStatus: async (userId) => {
        const response = await api.post(`/admin/users/${userId}/toggle-status`);
        return response.data;
    },

    // ── Trainers & Training Staff ────────────────────────────────────────────

    getStaff: async (search = '', status = '', page = 0, size = 20) => {
        const params = new URLSearchParams({ page, size });
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        const response = await api.get(`/admin/staff?${params.toString()}`);
        return response.data;
    },

    getStaffSummary: async () => {
        const response = await api.get('/admin/staff/summary');
        return response.data;
    },

    getStaffMember: async (id) => {
        const response = await api.get(`/admin/staff/${id}`);
        return response.data;
    },

    createStaff: async (data) => {
        const response = await api.post('/admin/staff', data);
        return response.data;
    },

    updateStaff: async (id, data) => {
        const response = await api.put(`/admin/staff/${id}`, data);
        return response.data;
    },

    updateStaffStatus: async (id, status, resignationDate = null) => {
        const payload = { status };
        if (resignationDate) payload.resignationDate = resignationDate;
        const response = await api.patch(`/admin/staff/${id}/status`, payload);
        return response.data;
    },

    deleteStaff: async (id) => {
        const response = await api.delete(`/admin/staff/${id}`);
        return response.data;
    },

    // ── Staff Schedules ──────────────────────────────────────────────────────

    getSchedules: async (staffId = null) => {
        const url = staffId ? `/admin/staff-schedules?staffId=${staffId}` : '/admin/staff-schedules';
        const response = await api.get(url);
        return response.data;
    },

    createSchedule: async (data) => {
        const response = await api.post('/admin/staff-schedules', data);
        return response.data;
    },

    updateSchedule: async (id, data) => {
        const response = await api.put(`/admin/staff-schedules/${id}`, data);
        return response.data;
    },

    deleteSchedule: async (id) => {
        const response = await api.delete(`/admin/staff-schedules/${id}`);
        return response.data;
    },

    // ── Recruitment & Vacancies ──────────────────────────────────────────────

    getVacancies: async (search = '', status = '', page = 0, size = 20) => {
        const params = new URLSearchParams({ page, size });
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        const response = await api.get(`/admin/vacancies?${params.toString()}`);
        return response.data;
    },

    getRecruitmentSummary: async () => {
        const response = await api.get('/admin/vacancies/summary');
        return response.data;
    },

    getVacancy: async (id) => {
        const response = await api.get(`/admin/vacancies/${id}`);
        return response.data;
    },

    createVacancy: async (data) => {
        const response = await api.post('/admin/vacancies', data);
        return response.data;
    },

    updateVacancy: async (id, data) => {
        const response = await api.put(`/admin/vacancies/${id}`, data);
        return response.data;
    },

    updateVacancyStatus: async (id, status) => {
        const response = await api.patch(`/admin/vacancies/${id}/status`, { status });
        return response.data;
    },

    deleteVacancy: async (id) => {
        const response = await api.delete(`/admin/vacancies/${id}`);
        return response.data;
    },

    // ── Trainer Applications ─────────────────────────────────────────────────

    getApplications: async (vacancyId = null, status = '', search = '', page = 0, size = 20) => {
        const params = new URLSearchParams({ page, size });
        if (vacancyId) params.set('vacancyId', vacancyId);
        if (status) params.set('status', status);
        if (search) params.set('search', search);
        const response = await api.get(`/admin/applications?${params.toString()}`);
        return response.data;
    },

    getApplicationSummary: async () => {
        const response = await api.get('/admin/applications/summary');
        return response.data;
    },

    getApplication: async (id) => {
        const response = await api.get(`/admin/applications/${id}`);
        return response.data;
    },

    updateApplicationStatus: async (id, status, reason = '') => {
        const response = await api.patch(`/admin/applications/${id}/status`, { status, reason });
        return response.data;
    },

    scheduleInterview: async (id, date, time, location = '', notes = '') => {
        const response = await api.post(`/admin/applications/${id}/interviews`, { date, time, location, notes });
        return response.data;
    },

    addApplicationNote: async (id, note) => {
        const response = await api.post(`/admin/applications/${id}/notes`, { note });
        return response.data;
    },

    convertToStaff: async (id, data) => {
        const response = await api.post(`/admin/applications/${id}/convert-to-staff`, data);
        return response.data;
    },

    // ── Subscriptions ────────────────────────────────────────────────────────

    getSubscriptions: async (page = 0, size = 20, status = '') => {
        const params = new URLSearchParams({ page, size });
        if (status) params.set('status', status);
        const response = await api.get(`/admin/subscriptions?${params.toString()}`);
        return response.data;
    },

    getDeadlines: async () => {
        const response = await api.get('/admin/subscriptions/deadlines');
        return response.data;
    },

    // ── Email & SMS Notifications ────────────────────────────────────────────

    getEmailHistory: async (page = 0, size = 20) => {
        const response = await api.get(`/admin/emails?page=${page}&size=${size}`);
        return response.data;
    },

    getRecipients: async () => {
        const response = await api.get('/admin/email/recipients');
        return response.data;
    },

    sendDeadlineReminders: async (subscriptionId = null) => {
        const payload = subscriptionId ? { subscriptionId } : {};
        const response = await api.post('/admin/email/send-deadline-reminders', payload);
        return response.data;
    },

    sendUserReminder: async (userId) => {
        const response = await api.post(`/admin/email/send-user-reminder/${userId}`);
        return response.data;
    },

    sendTestEmail: async () => {
        const response = await api.post('/admin/email/test');
        return response.data;
    },

    getEmailStatus: async () => {
        const response = await api.get('/admin/email/status');
        return response.data;
    },

    getSmsStatus: async () => {
        const response = await api.get('/admin/email/sms-status');
        return response.data;
    },

    sendUserSms: async (userId, message) => {
        const payload = message ? { message } : {};
        const response = await api.post(`/admin/email/send-user-sms/${userId}`, payload);
        return response.data;
    },
};
