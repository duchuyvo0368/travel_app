import React, { useState } from 'react';
import './HeroSection.css';

const HeroSection: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search logic
        console.log('Searching for:', searchQuery);
    };

    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1>Discover Your Next Adventure</h1>
                <p>Find the perfect destination for your dream vacation</p>
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Where do you want to go?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
        </section>
    );
};

export default HeroSection;
