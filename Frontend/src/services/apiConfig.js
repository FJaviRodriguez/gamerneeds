import axios from 'axios';

const crearInstanciaApi = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (!apiUrl) {
        console.error('VITE_API_URL is not defined in environment variables');
        throw new Error('API URL not configured');
    }

    const api = axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 10000 
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
                console.error('Network error details:', {
                    baseURL: api.defaults.baseURL,
                    error: error.message
                });
                throw new Error('Error de conexión con el servidor. Por favor, verifica que el servidor esté ejecutándose y sea accesible.');
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export default crearInstanciaApi;