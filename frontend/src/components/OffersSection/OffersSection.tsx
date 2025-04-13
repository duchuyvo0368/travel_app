import React from 'react';
import OfferCard from '../OfferCard/OfferCard';
import './OffersSection.css';

const OffersSection: React.FC = () => {
    const offers = [
        {
            title: 'Bali Paradise',
            discount: '-20%',
            imageUrl:
                'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Limited time offer',
        },
        {
            title: 'Dubai Luxury',
            discount: '-15%',
            imageUrl:
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Limited time offer',
        },
    ];

    return (
        <section className="offers-section">
            <h2>Special Offers</h2>
            <div className="offers-grid">
                {offers.map((offer, index) => (
                    <OfferCard
                        key={index}
                        title={offer.title}
                        discount={offer.discount}
                        imageUrl={offer.imageUrl}
                        description={offer.description}
                    />
                ))}
            </div>
        </section>
    );
};

export default OffersSection;
