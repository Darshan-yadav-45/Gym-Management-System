import api from './api';

export const profileService = {
    saveProfile: async (data) => {
        const response = await api.post('/profile', data);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await api.put('/profile', data);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }
};
