import React from 'react';
import './OfferCard.css';

interface OfferCardProps {
    title: string;
    discount: string;
    imageUrl: string;
    description: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ title, discount, imageUrl, description }) => {
    return (
        <div className="offer-card">
            <div className="offer-tag">{discount}</div>
            <img src={imageUrl} alt={title} />
            <div className="offer-info">
                <h3>{title}</h3>
                <p>{description}</p>
                <button>Book Now</button>
            </div>
        </div>
    );
};

export default OfferCard;
