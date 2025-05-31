import axios from 'axios';

const crearInstanciaApi = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('API URL:', apiUrl);
    
    if (!apiUrl) {
        console.error('VITE_API_URL no está configurado');
        return null;
    }
    const api = axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 15000,
        validateStatus: status => {
            return status >= 200 && status < 500;
        }
    });
    api.interceptors.request.use(
        config => {
            console.log('Request:', {
                method: config.method,
                url: config.url,
                data: config.data,
                headers: config.headers
            });
            return config;
        },
        error => {
            console.error('Request Error:', error);
            return Promise.reject(error);
        }
    );
    api.interceptors.response.use(
        response => {
            console.log('Response:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
            return response;
        },
        error => {
            console.error('Response Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            return Promise.reject(error);
        }
    );

    return api;
};

export default crearInstanciaApi;