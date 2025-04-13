import { API_CONFIG } from '../utils/constants';

export const API_ROUTES = {
    // Auth routes
    AUTH: {
        LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
        REGISTER: `${API_CONFIG.BASE_URL}/auth/register`,
        GOOGLE: `${API_CONFIG.BASE_URL}/auth/google`,
        LOGOUT: `${API_CONFIG.BASE_URL}/auth/logout`,
        ME: `${API_CONFIG.BASE_URL}/auth/me`,
        REFRESH_TOKEN: `${API_CONFIG.BASE_URL}/auth/refresh-token`,
    },

    // User routes
    USER: {
        PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
        UPDATE_PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
        CHANGE_PASSWORD: `${API_CONFIG.BASE_URL}/user/change-password`,
    },

    // Tour routes
    TOUR: {
        LIST: `${API_CONFIG.BASE_URL}/tours`,
        DETAIL: (id: string) => `${API_CONFIG.BASE_URL}/tours/${id}`,
        SEARCH: `${API_CONFIG.BASE_URL}/tours/search`,
        POPULAR: `${API_CONFIG.BASE_URL}/tours/popular`,
        RECOMMENDED: `${API_CONFIG.BASE_URL}/tours/recommended`,
    },

    // Booking routes
    BOOKING: {
        CREATE: `${API_CONFIG.BASE_URL}/bookings`,
        LIST: `${API_CONFIG.BASE_URL}/bookings`,

        DETAIL: (id: string) => `${API_CONFIG.BASE_URL}/bookings/${id}`,
        CANCEL: (id: string) => `${API_CONFIG.BASE_URL}/bookings/${id}/cancel`,
    },

    // Review routes
    REVIEW: {
        CREATE: `${API_CONFIG.BASE_URL}/reviews`,
        LIST: (tourId: string) => `${API_CONFIG.BASE_URL}/tours/${tourId}/reviews`,
        UPDATE: (id: string) => `${API_CONFIG.BASE_URL}/reviews/${id}`,
        DELETE: (id: string) => `${API_CONFIG.BASE_URL}/reviews/${id}`,
    },

    // Payment routes
    PAYMENT: {
        CREATE: `${API_CONFIG.BASE_URL}/payments`,
        VERIFY: (id: string) => `${API_CONFIG.BASE_URL}/payments/${id}/verify`,
    },
};
