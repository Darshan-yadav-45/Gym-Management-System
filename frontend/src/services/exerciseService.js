import api from './api';

export const exerciseService = {
    getAllExercises: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.muscle) params.append('muscle', filters.muscle);
        if (filters.equipment) params.append('equipment', filters.equipment);
        
        const response = await api.get(`/exercises?${params.toString()}`);
        return response.data;
    },

    createCustomExercise: async (data) => {
        const response = await api.post('/exercises/custom', data);
        return response.data;
    }
};

export default exerciseService;
