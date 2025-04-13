import axios from 'axios';
import { API_CONFIG } from '../utils/constants';

export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    emailVerified: boolean;
    isActive: boolean;
    profilePicture: string;
    nationality: string;
    isVerifiedOTP: boolean;
    createdAt: string;
    updatedAt: string;
    lastSignInAt: string;
}

export interface LoginResponse {
    message: string;
    status: number;
    metadata: {
        user: User;
        accessToken: string;
    };
}

export class AuthService {
    private static instance: AuthService;
    private axiosInstance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: API_CONFIG.HEADERS,
    });

    private constructor() {
        this.setupInterceptors();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    this.handleLogout();
                }
                return Promise.reject(error);
            },
        );
    }

    public async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
        try {
            const response = await this.axiosInstance.post('/auth/login', credentials);
            const { metadata } = response.data;
            this.setToken(metadata.accessToken);
            this.setCurrentUser(metadata.user);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }

    public async handleGoogleCallback(): Promise<LoginResponse> {
        try {
            const response = await this.axiosInstance.get('/auth/google/callback');
            const { metadata } = response.data;
            this.setToken(metadata.accessToken);
            this.setCurrentUser(metadata.user);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Google login failed');
        }
    }

    public async logout(): Promise<void> {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('No token found');
            }

            const response = await this.axiosInstance.post(
                '/auth/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            // Clear user data regardless of response
            this.clearUserData();

            if (response.data.status !== 200) {
                throw new Error(response.data.message || 'Logout failed');
            }
        } catch (error: any) {
            console.error('Logout error:', error);
            // Always clear local data even if API call fails
            this.clearUserData();
            throw new Error(error.response?.data?.message || 'Logout failed');
        }
    }

    public setToken(token: string): void {
        localStorage.setItem('token', token);
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    public getToken(): string | null {
        return localStorage.getItem('token');
    }

    public setCurrentUser(user: User): void {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }

    public getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'undefined') return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    private clearUserData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete this.axiosInstance.defaults.headers.common['Authorization'];
    }

    public isAuthenticated(): boolean {
        return !!this.getToken() && !!this.getCurrentUser();
    }

    private handleLogout(): void {
        this.clearUserData();
        window.location.href = '/login';
    }

    public async googleLogin() {
        window.location.href = `${API_CONFIG.BASE_URL}/auth/google`;
    }
}

export const authService = AuthService.getInstance();
