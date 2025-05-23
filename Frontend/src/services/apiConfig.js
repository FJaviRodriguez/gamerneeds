import axios from 'axios';

const crearInstanciaApi = () => {
    if (!import.meta.env.VITE_API_URL) {
        console.error('VITE_API_URL is not defined in environment variables');
        throw new Error('API URL not configured');
    }
    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}`,
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 5000
    });
    api.interceptors.request.use(
        config => {
            return config;
        },
        error => {
            if (error.code === 'ERR_NETWORK') {
                }
            return Promise.reject(error);
        }
    );
    api.interceptors.response.use(
        response => response,
        error => {
            if (error.code === 'ERR_NETWORK') {
                throw new Error('No se puede conectar al servidor. Por favor, verifique su conexión y que el servidor esté ejecutándose.');
            }
            return Promise.reject(error);
        }
    );
    return api;
};

export default crearInstanciaApi;