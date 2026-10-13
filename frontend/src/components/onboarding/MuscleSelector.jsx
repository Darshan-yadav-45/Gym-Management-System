import React from 'react';
import BodyModel from './BodyModel';

export default function MuscleSelector({ data, update, type }) {
    const isUpper = type === 'upper';
    
    const muscles = isUpper 
        ? [ 'CHEST', 'BICEPS', 'TRICEPS', 'LATS', 'SHOULDERS' ]
        : [ 'ABS', 'FOREARMS', 'TRAPS', 'GLUTES', 'QUADS', 'HAMSTRINGS', 'CALVES' ];

    const toggleMuscle = (muscle) => {
        const current = [...data.targetMuscles];
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
                Select {isUpper ? 'upper body' : 'lower body and core'} areas. You can choose multiple.
            </p>

            <BodyModel 
                targetMuscles={data.targetMuscles} 
                onToggleMuscle={toggleMuscle} 
                type={type} 
            />

            <div className="muscle-tags">
                {muscles.map(m => (
                    <div 
                        key={m}
                        className={`muscle-tag ${data.targetMuscles.includes(m) ? 'selected' : ''}`}
                        onClick={() => toggleMuscle(m)}
                    >
                        {m.charAt(0) + m.slice(1).toLowerCase()}
                    </div>
                ))}
            </div>
        </div>
    );
}
