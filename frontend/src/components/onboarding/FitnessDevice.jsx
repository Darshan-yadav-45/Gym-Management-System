import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

export default function FitnessDevice() {
    return (
        <div style={{ position: 'relative', width: '200px', height: '400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                animate={{ 
                    y: [0, -15, 0],
                    rotateZ: [-2, 2, -2]
                }}
                transition={{ 
                    repeat: Infinity, 
                    duration: 4, 
                    ease: "easeInOut" 
                }}
                style={{
                    position: 'relative',
                    width: '160px',
                    height: '320px',
                    backgroundColor: '#111',
                    border: '4px solid #333',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(204, 255, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.1) inset',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px'
                }}
            >
                <div style={{ width: '40px', height: '4px', backgroundColor: '#333', borderRadius: '4px', marginBottom: '20px' }}></div>
                <Smartphone size={64} color="var(--fitflow-accent)" style={{ marginTop: '40px' }} />
                
                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'var(--fitflow-accent)',
                        filter: 'blur(30px)',
                        borderRadius: '50%',
                        zIndex: -1
                    }}
                />
                
                <div style={{ marginTop: 'auto', width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px' }}></div>
                <div style={{ marginTop: '8px', width: '70%', height: '8px', backgroundColor: '#333', borderRadius: '4px' }}></div>
            </motion.div>
        </div>
    );
}
