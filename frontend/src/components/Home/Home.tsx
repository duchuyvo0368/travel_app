import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import Alert from '../Alert/Alert';
import HeroSection from '../HeroSection/HeroSection';
import DestinationsSection from '../DestinationsSection/DestinationsSection';
import FeaturesSection from '../FeaturesSection/FeaturesSection';
import OffersSection from '../OffersSection/OffersSection';
import './Home.css';

const Home: React.FC = () => {
    const [showAlert, setShowAlert] = useState(false);
    const location = useLocation();
    const user = authService.getCurrentUser();

    useEffect(() => {
        if (location.state?.fromLogin && user && !sessionStorage.getItem('alertShown')) {
            setShowAlert(true);
            sessionStorage.setItem('alertShown', 'true');
            window.history.replaceState({}, document.title);
        }
    }, [location.state, user]);

    const handleCloseAlert = () => {
        setShowAlert(false);
        sessionStorage.removeItem('alertShown');
    };

    return (
        <div className="home-container">
            {showAlert && (
                <Alert
                    message={`Welcome back, ${user?.username}!`}
                    type="success"
                    onClose={handleCloseAlert}
                    duration={2000}
                />
            )}
            <HeroSection />
            <DestinationsSection />
            <FeaturesSection />
            <OffersSection />
        </div>
    );
};

export default Home;
