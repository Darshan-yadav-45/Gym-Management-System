import api from './api';

export const trainerService = {
    getAllTrainers: async () => {
        const response = await api.get('/trainers');
        return response.data;
    },

    getTrainerById: async (id) => {
        const response = await api.get(`/trainers/${id}`);
        return response.data;
    },

    bookSession: async (data) => {
        const response = await api.post('/appointments', data);
        return response.data;
    }
};
