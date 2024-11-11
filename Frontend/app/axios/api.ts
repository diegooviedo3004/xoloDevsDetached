import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: apiUrl,
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
