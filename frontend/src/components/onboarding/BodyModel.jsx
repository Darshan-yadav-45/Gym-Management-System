import React from 'react';
import { motion } from 'framer-motion';

export default function BodyModel({ targetMuscles, onToggleMuscle, type }) {
    // This is a placeholder for a 3D model. We use a 2D styled abstraction.
    // In a real application, you'd integrate React Three Fiber here.
    
    const muscles = type === 'upper' 
        ? [
            { id: 'CHEST', name: 'Chest', top: '30%', left: '50%' },
            { id: 'BICEPS', name: 'Biceps', top: '35%', left: '30%' },
            { id: 'TRICEPS', name: 'Triceps', top: '35%', left: '70%' },
            { id: 'LATS', name: 'Lats', top: '45%', left: '20%' },
            { id: 'SHOULDERS', name: 'Shoulders', top: '25%', left: '30%' },
        ]
        : [
            { id: 'ABS', name: 'Abs', top: '50%', left: '50%' },
            { id: 'QUADS', name: 'Quads', top: '70%', left: '40%' },
            { id: 'GLUTES', name: 'Glutes', top: '65%', left: '60%' },
            { id: 'HAMSTRINGS', name: 'Hamstrings', top: '80%', left: '60%' },
            { id: 'CALVES', name: 'Calves', top: '90%', left: '40%' },
        ];

    return (
        <div className="body-model-container">
            {/* Abstract body outline */}
            <svg viewBox="0 0 100 200" style={{ width: '100%', height: '100%', opacity: 0.1, position: 'absolute' }}>
                <path d="M50 10 C 60 10 65 20 65 30 C 65 40 85 45 85 80 C 85 100 70 100 65 110 C 65 150 70 190 70 190 C 70 200 60 200 55 190 C 55 160 50 120 50 120 C 50 120 45 160 45 190 C 40 200 30 200 30 190 C 30 190 35 150 35 110 C 30 100 15 100 15 80 C 15 45 35 40 35 30 C 35 20 40 10 50 10 Z" fill="white" />
            </svg>

            {/* Interactive Muscle Points */}
            {muscles.map((muscle) => {
                const isSelected = targetMuscles.includes(muscle.id);
                return (
                    <motion.div
                        key={muscle.id}
                        className={`muscle-point ${isSelected ? 'selected' : ''}`}
                        style={{ top: muscle.top, left: muscle.left, transform: 'translate(-50%, -50%)' }}
                        onClick={() => onToggleMuscle(muscle.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isSelected && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 2 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--fitflow-accent)',
                                    opacity: 0.3,
                                    zIndex: -1
                                }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
