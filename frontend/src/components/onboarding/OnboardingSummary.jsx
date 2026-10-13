import React from 'react';
import FitnessDevice from './FitnessDevice';

export default function OnboardingSummary({ data }) {
    const formatGoal = (goal) => {
        if (!goal) return "Not set";
        return goal.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    };
    
    const formatEquipment = (eq) => {
        if (!eq) return "Not set";
        return eq.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">Your FitFlow journey starts now.</h1>
            <p className="onboarding-subtitle">Here is a summary of your personalized fitness profile.</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'center', marginTop: '2rem', width: '100%' }}>
                
                <FitnessDevice />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
                    <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--fitflow-card)', borderRadius: '16px', border: '1px solid var(--fitflow-border)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--fitflow-text-secondary)', marginBottom: '0.2rem' }}>Goal</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{formatGoal(data.goal)}</div>
                    </div>
                    
                    <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--fitflow-card)', borderRadius: '16px', border: '1px solid var(--fitflow-border)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--fitflow-text-secondary)', marginBottom: '0.2rem' }}>Workout</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{data.workoutFrequency} days/week</div>
                    </div>
                    
                    <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--fitflow-card)', borderRadius: '16px', border: '1px solid var(--fitflow-border)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--fitflow-text-secondary)', marginBottom: '0.2rem' }}>Training Environment</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{formatEquipment(data.equipment)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
