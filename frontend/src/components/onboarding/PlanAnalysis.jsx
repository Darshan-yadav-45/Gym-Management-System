import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function PlanAnalysis({ data, onComplete }) {
    const [currentStage, setCurrentStage] = useState(0);

    const stages = [
        "Analyzing your profile...",
        "Building your workout plan...",
        "Preparing your weekly schedule...",
        "Personalizing your FitFlow experience..."
    ];

    useEffect(() => {
        let stage = 0;
        const interval = setInterval(() => {
            stage++;
            setCurrentStage(stage);
            
            if (stage >= stages.length) {
                clearInterval(interval);
                setTimeout(() => {
                    onComplete();
                }, 1000);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <h1 className="onboarding-title" style={{ marginBottom: '4rem' }}>
                Creating your FitFlow plan...
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
                {stages.map((stageText, index) => {
                    const isCompleted = currentStage > index;
                    const isActive = currentStage === index;
                    const opacity = isCompleted ? 1 : isActive ? 1 : 0.2;

                    return (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem',
                                color: isCompleted ? 'var(--fitflow-accent)' : 'var(--fitflow-text-primary)'
                            }}
                        >
                            <div style={{ 
                                width: '24px', 
                                height: '24px', 
                                borderRadius: '50%', 
                                border: `2px solid ${isCompleted ? 'var(--fitflow-accent)' : isActive ? 'var(--fitflow-text-primary)' : 'var(--fitflow-border)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {isCompleted && <Check size={14} color="#000" />}
                                {isActive && (
                                    <motion.div 
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} 
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        style={{ width: '8px', height: '8px', backgroundColor: 'var(--fitflow-text-primary)', borderRadius: '50%' }}
                                    />
                                )}
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: isCompleted || isActive ? 600 : 400 }}>
                                {isCompleted ? stageText.replace('...', '') + ' ✓' : stageText}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
