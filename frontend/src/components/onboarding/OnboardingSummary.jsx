import React from 'react';
import FitnessDevice from './FitnessDevice';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OnboardingSummary({ data, onNext, isSubmitting }) {
    const formatGoal = (goal) => {
        if (!goal) return "General Fitness";
        return goal.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    };
    
    const formatEquipment = (eq) => {
        if (!eq) return "Full Gym";
        return eq.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="onboarding-title">Your FitFlow journey starts now.</h1>
            <p className="onboarding-subtitle">Here is a summary of your personalized fitness profile.</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', width: '100%', maxWidth: '850px' }}>
                
                <FitnessDevice />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', minWidth: '320px', flex: 1 }}>
                    <div style={{ padding: '1.2rem 1.5rem', backgroundColor: 'var(--fitflow-card, #121829)', borderRadius: '16px', border: '1px solid var(--fitflow-border, rgba(255,255,255,0.08))' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--fitflow-text-secondary, #94a3b8)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fitness Goal</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{formatGoal(data.goal)}</div>
                    </div>
                    
                    <div style={{ padding: '1.2rem 1.5rem', backgroundColor: 'var(--fitflow-card, #121829)', borderRadius: '16px', border: '1px solid var(--fitflow-border, rgba(255,255,255,0.08))' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--fitflow-text-secondary, #94a3b8)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workout Schedule</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{data.workoutFrequency || 4} days / week</div>
                    </div>
                    
                    <div style={{ padding: '1.2rem 1.5rem', backgroundColor: 'var(--fitflow-card, #121829)', borderRadius: '16px', border: '1px solid var(--fitflow-border, rgba(255,255,255,0.08))' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--fitflow-text-secondary, #94a3b8)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Training Environment</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{formatEquipment(data.equipment)}</div>
                    </div>

                    {/* Prominent Next CTA Button directly on the summary card */}
                    {onNext && (
                        <button 
                            type="button"
                            onClick={onNext}
                            disabled={isSubmitting}
                            className="btn-primary"
                            style={{ 
                                marginTop: '0.5rem',
                                padding: '1.1rem 2rem',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.6rem',
                                fontSize: '1.05rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                cursor: 'pointer',
                                boxShadow: '0 0 25px rgba(198, 255, 0, 0.3)'
                            }}
                        >
                            {isSubmitting ? 'Starting Your Journey...' : 'Go to Dashboard'} <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
