import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../utils/constants';

class BaseService {
    protected api = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: API_CONFIG.HEADERS,
    });

    constructor() {
        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.api.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error),
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & {
                    _retry?: boolean;
                };

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (refreshToken) {
                            const response = await this.api.post<{ token: string }>(
                                '/auth/refresh-token',
                                { refreshToken },
                            );

                            const { token } = response.data;
                            localStorage.setItem('token', token);

                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            return this.api(originalRequest);
                        }
                    } catch (refreshError) {
                        this.handleLogout();
                    }
                }

                return Promise.reject(error);
            },
        );
    }

    protected handleLogout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }

    protected handleError(error: any): Error {
        const message = error.response?.data?.message || 'An error occurred';
        return new Error(message);
    }
}

export default BaseService;
