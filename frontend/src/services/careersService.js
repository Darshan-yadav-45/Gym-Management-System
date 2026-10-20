import api from './api';

/**
 * Public Careers API service for prospective trainers and staff candidates.
 * No authentication required.
 */
export const careersService = {

    /**
     * Fetch all currently open published vacancies.
     */
    getOpenVacancies: async () => {
        const response = await api.get('/careers/vacancies');
        return response.data;
    },

    /**
     * Fetch detailed requirements for a single open vacancy.
     */
    getVacancyDetails: async (id) => {
        const response = await api.get(`/careers/vacancies/${id}`);
        return response.data;
    },

    /**
     * Submit candidate application with optional resume file.
     * Uses multipart/form-data.
     */
    submitApplication: async (vacancyId, formData) => {
        const response = await api.post(`/careers/vacancies/${vacancyId}/applications`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
