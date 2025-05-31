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
        timeout: 10000, 
    });
    api.interceptors.request.use(
        config => {
            console.log('Request:', config);
            return config;
        },
        error => {
            console.error('Request Error:', error);
            return Promise.reject(error);
        }
    );
    api.interceptors.response.use(
        response => {
            console.log('Response:', response);
            return response;
        },
        error => {
            console.error('Response Error:', error);
            return Promise.reject(error);
        }
    );

    return api;
};

export default crearInstanciaApi;