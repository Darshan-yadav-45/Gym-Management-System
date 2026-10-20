import React, { useState } from 'react';
import BodyModel from './BodyModel';

export default function MuscleSelector({ data, update }) {
    const [activeTab, setActiveTab] = useState('upper');
    
    const upperMuscles = [ 'CHEST', 'BICEPS', 'TRICEPS', 'LATS', 'SHOULDERS' ];
    const lowerMuscles = [ 'ABS', 'QUADS', 'GLUTES', 'HAMSTRINGS', 'CALVES', 'FOREARMS', 'TRAPS' ];

    const activeMuscles = activeTab === 'upper' ? upperMuscles : lowerMuscles;

    const toggleMuscle = (muscle) => {
        const current = [...(data.targetMuscles || [])];
        if (current.includes(muscle)) {
            update('targetMuscles', current.filter(m => m !== muscle));
        } else {
            update('targetMuscles', [...current, muscle]);
        }
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">
                Which muscles do you want to focus on?
            </h1>
            <p className="onboarding-subtitle">
                Select your focus areas. You can choose multiple muscles across both body zones.
            </p>

            {/* Category Switcher Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    type="button"
                    onClick={() => setActiveTab('upper')}
                    style={{
                        padding: '0.6rem 1.4rem',
                        borderRadius: '30px',
                        border: activeTab === 'upper' ? '2px solid var(--fitflow-accent, #c6ff00)' : '1px solid rgba(255,255,255,0.15)',
                        backgroundColor: activeTab === 'upper' ? 'rgba(198, 255, 0, 0.15)' : 'transparent',
                        color: activeTab === 'upper' ? 'var(--fitflow-accent, #c6ff00)' : '#aaa',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Upper Body
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('lower')}
                    style={{
                        padding: '0.6rem 1.4rem',
                        borderRadius: '30px',
                        border: activeTab === 'lower' ? '2px solid var(--fitflow-accent, #c6ff00)' : '1px solid rgba(255,255,255,0.15)',
                        backgroundColor: activeTab === 'lower' ? 'rgba(198, 255, 0, 0.15)' : 'transparent',
                        color: activeTab === 'lower' ? 'var(--fitflow-accent, #c6ff00)' : '#aaa',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Lower Body & Core
                </button>
            </div>

            <BodyModel 
                targetMuscles={data.targetMuscles || []} 
                onToggleMuscle={toggleMuscle} 
                type={activeTab} 
            />

            <div className="muscle-tags" style={{ marginTop: '1.5rem' }}>
                {activeMuscles.map(m => (
                    <div 
                        key={m}
                        className={`muscle-tag ${(data.targetMuscles || []).includes(m) ? 'selected' : ''}`}
                        onClick={() => toggleMuscle(m)}
                    >
                        {m.charAt(0) + m.slice(1).toLowerCase()}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
                Selected: <span style={{ color: 'var(--fitflow-accent, #c6ff00)', fontWeight: 600 }}>
                    {(data.targetMuscles || []).length} muscle{(data.targetMuscles || []).length === 1 ? '' : 's'}
                </span>
            </div>
        </div>
    );
}
