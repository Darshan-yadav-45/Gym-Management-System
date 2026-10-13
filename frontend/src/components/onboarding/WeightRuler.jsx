import React from 'react';
import BMIScale from './BMIScale';

export default function WeightRuler({ data, update }) {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">What's your current weight?</h1>
            <p className="onboarding-subtitle">We need this to create a personalized training plan.</p>

            <div className="slider-container">
                <div className="slider-value">
                    {data.weight} <span style={{ fontSize: '1.5rem', color: 'var(--fitflow-text-secondary)' }}>kg</span>
                </div>
                
                <input 
                    type="range" 
                    min="30" 
                    max="200" 
                    value={data.weight} 
                    onChange={(e) => update('weight', parseInt(e.target.value, 10))}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--fitflow-text-secondary)' }}>
                    <span>30 kg</span>
                    <span>200 kg</span>
                </div>
            </div>

            {/* Render BMI Scale here to provide immediate feedback */}
            <BMIScale height={data.height} weight={data.weight} />
        </div>
    );
}
