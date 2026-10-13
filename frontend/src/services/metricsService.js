import api from './api';

export const metricsService = {
    // Get today's metrics for authenticated user
    getTodayMetrics: async () => {
        try {
            const response = await api.get('/v1/metrics/today');
            return response.data;
        } catch (err) {
            // Fallback to /metrics/today if v1 not matched
            const response = await api.get('/metrics/today');
            return response.data;
        }
    },

    // Log or update today's metrics
    logMetrics: async (data) => {
        try {
            const response = await api.post('/v1/metrics/log', data);
            return response.data;
        } catch (err) {
            // Fallback
            const response = await api.post('/metrics/log', data);
            return response.data;
        }
    },

    // Get metric history
    getHistory: async () => {
        try {
            const response = await api.get('/v1/metrics/history');
            return response.data;
        } catch (err) {
            const response = await api.get('/metrics/history');
            return response.data;
        }
    }
};

export default metricsService;
