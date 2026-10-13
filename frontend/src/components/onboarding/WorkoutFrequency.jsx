import React from 'react';
import { motion } from 'framer-motion';

export default function WorkoutFrequency({ data, update }) {
    const frequency = data.workoutFrequency;

    // Calculate progression percentages
    const habitPercent = Math.max(10, 100 - (frequency * 10)); 
    const progressPercent = Math.min(100, frequency * 14.28);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">How often do you want to train?</h1>
            <p className="onboarding-subtitle">We recommend 3-5 days for optimal results.</p>

            <div className="slider-container">
                <div className="slider-value">
                    {frequency} <span style={{ fontSize: '1.5rem', color: 'var(--fitflow-text-secondary)' }}>days / week</span>
                </div>
                
                <input 
                    type="range" 
                    min="1" 
                    max="7" 
                    value={frequency} 
                    onChange={(e) => update('workoutFrequency', parseInt(e.target.value, 10))}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--fitflow-text-secondary)' }}>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: '400px', marginTop: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span>Habit Building</span>
                        <span style={{ color: 'var(--fitflow-text-secondary)' }}>{frequency <= 3 ? 'Easy' : frequency <= 5 ? 'Moderate' : 'Challenging'}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--fitflow-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div 
                            style={{ height: '100%', backgroundColor: '#3498db' }}
                            animate={{ width: `${habitPercent}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span>Training Progression</span>
                        <span style={{ color: 'var(--fitflow-text-secondary)' }}>{frequency <= 2 ? 'Slow' : frequency <= 4 ? 'Optimal' : 'Fast'}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--fitflow-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div 
                            style={{ height: '100%', backgroundColor: 'var(--fitflow-accent)' }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
