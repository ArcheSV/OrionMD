import React from 'react';
import BlurredText from './BlurredText';
const regex = /\|\|(.*?)\|\|/g;

const parseNodeForSpoiler = (node: React.ReactNode, keyPrefix: string): React.ReactNode => {
    if (typeof node === 'string') {
        if (!regex.test(node)) {
            return node;
        }

        const parts = node.split(regex);
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return <BlurredText key={`${keyPrefix}-${index}`}>{part}</BlurredText>;
            }
            return part;
        });
    }

    if (React.isValidElement(node)) {
        if (node.props.children) {
            return React.cloneElement(
                node,
                {...node.props, key: keyPrefix},
                React.Children.map(node.props.children, (child, index) =>
                    parseNodeForSpoiler(child, `${keyPrefix}-child-${index}`)
                )
            );
        }
    }

    return node;
};

const SpoilerParser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            {React.Children.map(children, (child, index) =>
                parseNodeForSpoiler(child, `sp-root-${index}`)
            )}
        </>
    );
};

export default SpoilerParser;