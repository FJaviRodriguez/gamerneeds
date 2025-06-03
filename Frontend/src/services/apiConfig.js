import axios from 'axios';

const crearInstanciaApi = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (!apiUrl) {
        return null;
    }

    const api = axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 30000,
    });
    api.interceptors.response.use(null, async (error) => {
        if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
            const retries = error.config._retry || 0;
            if (retries < 3) {
                error.config._retry = retries + 1;
                return await new Promise(resolve => setTimeout(resolve, 1000)).then(() => api(error.config));
            }
        }
        return Promise.reject(error);
    });

    return api;
};

export default crearInstanciaApi;