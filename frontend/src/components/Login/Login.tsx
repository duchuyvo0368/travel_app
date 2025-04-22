import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
// API_ROUTES is imported for future use
import { API_ROUTES } from '../../config/api.routes';
import Alert from '../Alert/Alert';
import './Login.css';

interface LoginFormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

interface User {
    name: string;
    email: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for the field being edited
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Please enter your email';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Please enter your password';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!validateForm()) return;

        try {
            const response = await authService.login(formData);
            authService.setCurrentUser(response.metadata.user);
            navigate('/', { state: { fromLogin: true } });
        } catch (err: any) {
            if (err.message === 'Network Error') {
                setError('Unable to connect to the server. Please check your internet connection.');
            } else {
                setError(err.response?.data?.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authService.googleLogin();
        } catch (err: any) {
            setError('Failed to initiate Google login. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            {user ? (
                <div className="user-greeting">
                    <h2>Hello, {user.name}!</h2>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            ) : (
                <div className="login-form">
                    <h2>Login</h2>
                    {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                disabled={loading}
                                className={errors.email ? 'error' : ''}
                                autoComplete="email"
                                required
                            />
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    disabled={loading}
                                    className={errors.password ? 'error' : ''}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={togglePasswordVisibility}
                                    disabled={loading}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="field-error">{errors.password}</span>
                            )}
                        </div>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="divider">
                        <span>OR</span>
                    </div>
                    <button
                        className="google-button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            width="24px"
                            height="24px"
                        >
                            <path
                                fill="#FFC107"
                                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                            <path
                                fill="#FF3D00"
                                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            />
                            <path
                                fill="#4CAF50"
                                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            />
                            <path
                                fill="#1976D2"
                                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                        </svg>
                        Continue with Google
                    </button>
                    <div className="register-link">
                        Don't have an account? <a href="/register">Register now</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
