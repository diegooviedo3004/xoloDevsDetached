import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
    baseURL: 'http://192.168.103.55:8000',
});

const setupInterceptors = () => {
    api.interceptors.request.use(config => {
        const { access } = useAuthStore.getState();
        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    });
};

setupInterceptors();

export default api;
