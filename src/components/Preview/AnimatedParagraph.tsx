import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import BlurredText from './BlurredText';

interface AnimatedParagraphProps {
    node: any;
    children: React.ReactNode;
}

const AnimatedParagraph: React.FC<AnimatedParagraphProps> = ({ node, children, ...props }) => {
    const processedChildren = useMemo(() => {
        const regex = /\[b\](.*?)\[\/b\]/g;

        if (node && node.children[0]?.type === 'text') {
            const textContent = node.children[0].value;
            if (regex.test(textContent)) {
                const parts = textContent.split(regex);
                return parts.map((part, index) => {
                    if (index % 2 === 1) {
                        return <BlurredText key={index}>{part}</BlurredText>;
                    }
                    return part;
                });
            }
        }
        return children;
    }, [children, node]);

    return (
        <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            layout
            {...props}
        >
            {processedChildren}
        </motion.p>
    );
};

export default React.memo(AnimatedParagraph);