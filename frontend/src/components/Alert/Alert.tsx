import React, { useEffect, useState } from 'react';
import './Alert.css';

interface AlertProps {
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    onClose: () => void;
    duration?: number;
    alertKey?: string;
}

const Alert: React.FC<AlertProps> = ({
    message,
    type = 'info',
    onClose,
    duration = 2000,
    alertKey,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (alertKey) {
            const hasShown = localStorage.getItem(`alert_${alertKey}`);
            if (hasShown) {
                setIsVisible(false);
                onClose();
                return;
            }
        }

        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
            if (alertKey) {
                localStorage.setItem(`alert_${alertKey}`, 'true');
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration, alertKey]);

    if (!isVisible) return null;

    return (
        <div className={`alert alert-${type}`}>
            <div className="alert-content">
                <span className="alert-message">{message}</span>
                <button
                    className="alert-close"
                    onClick={() => {
                        setIsVisible(false);
                        onClose();
                        if (alertKey) {
                            localStorage.setItem(`alert_${alertKey}`, 'true');
                        }
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Alert;
