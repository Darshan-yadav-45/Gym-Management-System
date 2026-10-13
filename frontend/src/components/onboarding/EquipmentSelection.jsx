import React from 'react';
import { Home, Dumbbell, Building, Settings } from 'lucide-react';

export default function EquipmentSelection({ data, update }) {
    const handleSelect = (equipment) => {
        update('equipment', equipment);
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">Where will you train?</h1>
            <p className="onboarding-subtitle">Select your primary training environment and equipment.</p>

            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div 
                    className={`selection-card ${data.equipment === 'NO_EQUIPMENT' ? 'selected' : ''}`}
                    onClick={() => handleSelect('NO_EQUIPMENT')}
                >
                    <div className="card-icon"><Home size={28} /></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.5rem' }}>No Equipment</h3>
                    <p style={{ color: 'var(--fitflow-text-secondary)', fontSize: '0.85rem', margin: 0 }}>Home bodyweight workouts.</p>
                </div>

                <div 
                    className={`selection-card ${data.equipment === 'DUMBBELLS' ? 'selected' : ''}`}
                    onClick={() => handleSelect('DUMBBELLS')}
                >
                    <div className="card-icon"><Dumbbell size={28} /></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Dumbbells</h3>
                    <p style={{ color: 'var(--fitflow-text-secondary)', fontSize: '0.85rem', margin: 0 }}>Basic strength training.</p>
                </div>

                <div 
                    className={`selection-card ${data.equipment === 'GARAGE_GYM' ? 'selected' : ''}`}
                    onClick={() => handleSelect('GARAGE_GYM')}
                >
                    <div className="card-icon"><Home size={28} /></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Garage Gym</h3>
                    <p style={{ color: 'var(--fitflow-text-secondary)', fontSize: '0.85rem', margin: 0 }}>Home gym equipment.</p>
                </div>

                <div 
                    className={`selection-card ${data.equipment === 'FULL_GYM' ? 'selected' : ''}`}
                    onClick={() => handleSelect('FULL_GYM')}
                >
                    <div className="card-icon"><Building size={28} /></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Full Gym</h3>
                    <p style={{ color: 'var(--fitflow-text-secondary)', fontSize: '0.85rem', margin: 0 }}>Complete gym access.</p>
                </div>
                
                <div 
                    className={`selection-card ${data.equipment === 'CUSTOM' ? 'selected' : ''}`}
                    onClick={() => handleSelect('CUSTOM')}
                >
                    <div className="card-icon"><Settings size={28} /></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Custom</h3>
                    <p style={{ color: 'var(--fitflow-text-secondary)', fontSize: '0.85rem', margin: 0 }}>Choose your own.</p>
                </div>
            </div>
        </div>
    );
}
