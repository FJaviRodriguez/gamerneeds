import axios from 'axios';

const crearInstanciaApi = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const api = axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Token configurado en headers:', config.headers['Authorization']);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return api;
};

export default crearInstanciaApi;