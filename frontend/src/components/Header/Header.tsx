import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import Alert from '../Alert/Alert';
import './Header.css';

const Header: React.FC = () => {
    // isLoggingOut is used in the handleLogout function
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    // showWelcomeAlert is used in the useEffect hook
    const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    useEffect(() => {
        const hasShownWelcomeBack = localStorage.getItem('hasShownWelcomeBack');
        if (isAuthenticated && !hasShownWelcomeBack) {
            setShowWelcomeAlert(true);
            localStorage.setItem('hasShownWelcomeBack', 'true');
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAuthenticated, user?.username]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            setShowDropdown(false);
            await authService.logout();
            localStorage.removeItem('hasShownWelcomeBack');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <>
            <Alert
                message={`Welcome back, ${user?.username}!`}
                type="success"
                onClose={() => setShowWelcomeAlert(false)}
                duration={2000}
                alertKey="welcome_back"
            />

            <header className="header">
                <div className="header-content">
                    <div className="logo" onClick={handleLogoClick}>
                        Travel App
                    </div>
                    {isAuthenticated ? (
                        <div className="user-container" ref={dropdownRef}>
                            <div className="user" onClick={toggleDropdown}>
                                Hello, {user?.username}
                            </div>
                            <div className={`user-dropdown ${showDropdown ? 'show' : ''}`}>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    <span className="material-icons">logout</span>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="account-container" ref={dropdownRef}>
                            <button className="account-button" onClick={toggleDropdown}>
                                <span className="material-icons account-icon">person</span>
                                Account
                            </button>
                            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
