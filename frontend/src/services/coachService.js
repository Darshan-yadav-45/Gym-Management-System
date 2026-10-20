import api from './api';

/**
 * Service for AI coach directory, selection, and preference management.
 * All mutating operations (select) require authentication.
 * Browsing the coach directory is allowed without auth.
 */
export const coachService = {

    /**
     * Returns all active coaches with optional filters.
     * @param {Object} filters - { tier, category, gender }
     */
    getAllCoaches: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.tier) params.set('tier', filters.tier);
        if (filters.category) params.set('category', filters.category);
        if (filters.gender) params.set('gender', filters.gender);
        const response = await api.get(`/coaches?${params.toString()}`);
        return response.data;
    },

    /**
     * Returns a specific coach by ID.
     */
    getCoachById: async (coachId) => {
        const response = await api.get(`/coaches/${coachId}`);
        return response.data;
    },

    /**
     * Returns the authenticated user's selected coach.
     * Returns null if no coach selected (HTTP 204).
     */
    getMyCoach: async () => {
        try {
            const response = await api.get('/coaches/my-coach');
            if (response.status === 204) return null;
            return response.data;
        } catch (err) {
            if (err.response?.status === 204) return null;
            throw err;
        }
    },

    /**
     * Selects a coach for the authenticated user.
     * FREE coaches: always allowed.
     * PREMIUM coaches: server-side subscription check enforced.
     * @param {number} coachId
     */
    selectCoach: async (coachId) => {
        const response = await api.post(`/coaches/${coachId}/select`);
        return response.data;
    },

    /**
     * Returns the authenticated user's subscription status.
     */
    getMySubscription: async () => {
        const response = await api.get('/coaches/my-subscription');
        return response.data;
    },
};
