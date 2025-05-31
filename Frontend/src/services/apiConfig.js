import axios from 'axios';

const crearInstanciaApi = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
        console.error('VITE_API_URL no está configurado');
        return null;
    }

    const api = axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
    api.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
    return api;
};

export default crearInstanciaApi;