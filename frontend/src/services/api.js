import axios from 'axios';

// Read API URL from Vite environment variable (set in Vercel) or fallback to local backend
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');

const api = axios.create({
    baseURL: cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
