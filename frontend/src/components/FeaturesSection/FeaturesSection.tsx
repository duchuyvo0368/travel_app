import React from 'react';
import FeatureCard from '../FeatureCard/FeatureCard';
import './FeaturesSection.css';

const FeaturesSection: React.FC = () => {
    const features = [
        {
            icon: '💰',
            title: 'Best Prices',
            description:
                'We guarantee the best prices for all our travel packages and accommodations.',
        },
        {
            icon: '🏨',
            title: 'Quality Hotels',
            description: 'Carefully selected hotels with excellent reviews and amenities.',
        },
        {
            icon: '🌍',
            title: 'Worldwide Coverage',
            description: 'Travel to any destination with our extensive network of partners.',
        },
    ];

    return (
        <section className="features-section">
            <h2>Why Choose Us</h2>
            <div className="features-grid">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
