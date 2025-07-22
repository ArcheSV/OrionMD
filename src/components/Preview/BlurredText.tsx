import React from 'react';
import { motion } from 'framer-motion';

const BlurredText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.span
            className="blurred-text"
            initial={{ filter: 'blur(4px)' }}
            whileHover={{ filter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {children}
        </motion.span>
    );
};

export default BlurredText;