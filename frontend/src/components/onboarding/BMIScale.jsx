import React from 'react';
import { motion } from 'framer-motion';

export default function BMIScale({ height, weight }) {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    // Cap BMI for UI positioning between 15 and 40
    const clampedBmi = Math.min(Math.max(bmi, 15), 40);
    const positionPercent = ((clampedBmi - 15) / (40 - 15)) * 100;

    let status = "";
    let color = "";

    if (bmi < 18.5) {
        status = "Underweight";
        color = "#3498db";
    } else if (bmi >= 18.5 && bmi < 25) {
        status = "Normal";
        color = "#2ecc71";
    } else if (bmi >= 25 && bmi < 30) {
        status = "Overweight";
        color = "#f39c12";
    } else {
        status = "Obese";
        color = "#e74c3c";
    }

    return (
        <div style={{ width: '100%', maxWidth: '500px', marginTop: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--fitflow-text-secondary)' }}>BMI Indicator</span>
                <span style={{ color: color, fontWeight: 'bold' }}>{bmi.toFixed(1)} - {status}</span>
            </div>
            
            <div style={{ position: 'relative', width: '100%', height: '8px', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: 1, backgroundColor: '#3498db' }}></div>
                <div style={{ flex: 1.5, backgroundColor: '#2ecc71' }}></div>
                <div style={{ flex: 1.5, backgroundColor: '#f39c12' }}></div>
                <div style={{ flex: 2, backgroundColor: '#e74c3c' }}></div>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '20px', marginTop: '8px' }}>
                <motion.div 
                    animate={{ left: `${positionPercent}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ 
                        position: 'absolute', 
                        top: 0, 
                        transform: 'translateX(-50%)',
                        width: '0',
                        height: '0',
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: `12px solid ${color}`
                    }}
                />
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--fitflow-text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
                This is a general fitness visualization, not a medical diagnosis.
            </p>
        </div>
    );
}
