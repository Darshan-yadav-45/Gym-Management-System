import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.98
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.98
        };
    }
};

export default function StepTransition({ children, direction }) {
    return (
        <AnimatePresence mode="wait" custom={direction}>
            <motion.div
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.3 }
                }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
