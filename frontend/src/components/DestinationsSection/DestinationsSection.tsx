import React from 'react';
import DestinationCard from '../DestinationCard/DestinationCard';
import './DestinationsSection.css';

const DestinationsSection: React.FC = () => {
    const destinations = [
        {
            title: 'Paris, France',
            imageUrl:
                'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            price: 'Starting from $599',
        },
        {
            title: 'Tokyo, Japan',
            imageUrl:
                'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            price: 'Starting from $799',
        },
        {
            title: 'New York, USA',
            imageUrl:
                'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            price: 'Starting from $699',
        },
    ];

    return (
        <section className="destinations-section">
            <h2>Popular Destinations</h2>
            <div className="destinations-grid">
                {destinations.map((destination, index) => (
                    <DestinationCard
                        key={index}
                        title={destination.title}
                        imageUrl={destination.imageUrl}
                        price={destination.price}
                    />
                ))}
            </div>
        </section>
    );
};

export default DestinationsSection;
