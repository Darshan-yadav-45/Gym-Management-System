import React from 'react';

export default function HeightSlider({ data, update }) {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">How tall are you?</h1>
            <p className="onboarding-subtitle">This helps us calculate your BMI and daily energy expenditure.</p>

            <div className="slider-container">
                <div className="slider-value">
                    {data.height} <span style={{ fontSize: '1.5rem', color: 'var(--fitflow-text-secondary)' }}>cm</span>
                </div>
                
                <input 
                    type="range" 
                    min="100" 
                    max="250" 
                    value={data.height} 
                    onChange={(e) => update('height', parseInt(e.target.value, 10))}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--fitflow-text-secondary)' }}>
                    <span>100 cm</span>
                    <span>250 cm</span>
                </div>
            </div>
        </div>
    );
}
