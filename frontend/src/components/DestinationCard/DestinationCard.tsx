import React from 'react';
import './DestinationCard.css';

interface DestinationCardProps {
    title: string;
    imageUrl: string;
    price: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ title, imageUrl, price }) => {
    return (
        <div className="destination-card">
            <img src={imageUrl} alt={title} />
            <div className="destination-info">
                <h3>{title}</h3>
                <p>{price}</p>
            </div>
        </div>
    );
};

export default DestinationCard;
