import React from 'react';
import { User } from 'lucide-react';

export default function GenderSelection({ data, update, onSelect }) {
    const handleSelect = (gender) => {
        update('gender', gender);
        // Add a slight delay before moving to next step to show the selection animation
        setTimeout(() => {
            onSelect();
        }, 400);
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">Let's build your fitness profile</h1>
            <p className="onboarding-subtitle">First, tell us how you'd like your profile represented.</p>

            <div className="cards-grid">
                <div 
                    className={`selection-card ${data.gender === 'MALE' ? 'selected' : ''}`}
                    onClick={() => handleSelect('MALE')}
                >
                    <div className="card-icon">
                        <User size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Male</h3>
                </div>

                <div 
                    className={`selection-card ${data.gender === 'FEMALE' ? 'selected' : ''}`}
                    onClick={() => handleSelect('FEMALE')}
                >
                    <div className="card-icon">
                        <User size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Female</h3>
                </div>
            </div>
        </div>
    );
}
