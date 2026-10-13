import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ currentStep, totalSteps }) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="onboarding-step-text">STEP {currentStep} OF {totalSteps}</div>
            <div className="onboarding-progress-track">
                <motion.div 
                    className="onboarding-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}
