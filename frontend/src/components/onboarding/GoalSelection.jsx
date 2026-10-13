import React from 'react';
import { Dumbbell, Activity, Flame } from 'lucide-react';

export default function GoalSelection({ data, update, onSelect }) {
    const handleSelect = (goal) => {
        update('goal', goal);
        setTimeout(() => {
            onSelect();
        }, 400);
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">What's your main goal?</h1>
            <p className="onboarding-subtitle">Select the primary objective for your training.</p>

            <div className="cards-grid">
                <div 
                    className={`selection-card ${data.goal === 'BUILD_MUSCLE' ? 'selected' : ''}`}
                    onClick={() => handleSelect('BUILD_MUSCLE')}
                >
                    <div className="card-icon">
                        <Dumbbell size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Build Muscle</h3>
                    <p style={{ color: 'var(--fitflow-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Increase muscle mass and strength through hypertrophy.
                    </p>
                </div>

                <div 
                    className={`selection-card ${data.goal === 'GENERAL_FITNESS' ? 'selected' : ''}`}
                    onClick={() => handleSelect('GENERAL_FITNESS')}
                >
                    <div className="card-icon">
                        <Activity size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Keep Fit</h3>
                    <p style={{ color: 'var(--fitflow-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Improve overall stamina, health, and mobility.
                    </p>
                </div>

                <div 
                    className={`selection-card ${data.goal === 'WEIGHT_MANAGEMENT' ? 'selected' : ''}`}
                    onClick={() => handleSelect('WEIGHT_MANAGEMENT')}
                >
                    <div className="card-icon">
                        <Flame size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Lose Weight</h3>
                    <p style={{ color: 'var(--fitflow-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Burn body fat and lean out your physique.
                    </p>
                </div>
            </div>
        </div>
    );
}
