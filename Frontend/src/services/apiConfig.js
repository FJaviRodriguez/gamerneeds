import axios from 'axios';

const crearInstanciaApi = () => {
    const desarrollo = process.env.NODE_ENV === 'development';
    const apiUrl = desarrollo 
        ? 'http://localhost:5000/api'
        : 'http://107.22.32.241:5000/api';
    
    if (!apiUrl) {
        console.error('API URL not configured');
        throw new Error('API URL not configured');
    }

    const api = axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 10000 
    });

    // Add error handling for network issues
    api.interceptors.response.use(
        response => response,
        error => {
            if (error.code === 'ERR_NETWORK') {
                console.error('Network error details:', {
                    baseURL: api.defaults.baseURL,
                    error: error.message
                });
                throw new Error('Error de conexión con el servidor. Verifica que el servidor esté ejecutándose y sea accesible.');
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export default crearInstanciaApi;