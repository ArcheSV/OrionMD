import React, { useMemo, isValidElement, cloneElement, Children } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProject } from '../../hooks/useProject';
import BlurredText from './BlurredText';

import '../../styles/markdown.css';

const parseChildrenForSpoiler = (children: React.ReactNode): React.ReactNode => {
    return Children.map(children, (child, index) => {

        if (typeof child === 'string') {
            const spoilerRegex = /\|\|(.*?)\|\|/g;
            if (!child.match(spoilerRegex)) {
                return child;
            }

            const parts = child.split(spoilerRegex);
            return parts.map((part, i) =>
                i % 2 === 1 ? <BlurredText key={`${index}-${i}`}>{part}</BlurredText> : part
            );
        }

        if (isValidElement(child)) {
            const props = child.props as { children?: React.ReactNode };

            if (props.children) {
                return cloneElement(
                    child,
                    props,
                    parseChildrenForSpoiler(props.children)
                );
            }
        }

        return child;
    });
};


const Preview: React.FC = () => {
    const { activeProject } = useProject();

    const fullMarkdownContent = useMemo(() => {
        if (!activeProject) return '';
        return activeProject.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
    }, [activeProject?.sections]);

    const customComponents = {
        p: ({ node, ...props }: any) => <p {...props}>{parseChildrenForSpoiler(props.children)}</p>,
        li: ({ node, ...props }: any) => <li {...props}>{parseChildrenForSpoiler(props.children)}</li>,
        strong: ({ node, ...props }: any) => <strong {...props}>{parseChildrenForSpoiler(props.children)}</strong>,
        em: ({ node, ...props }: any) => <em {...props}>{parseChildrenForSpoiler(props.children)}</em>,

        img: ({node, ...props}: any) => (
            <img
                style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                {...props}
                alt={props.alt || ''}
            />
        ),
    };

    return (
        <div
            className="preview-pane"
            style={{ scrollBehavior: activeProject!.settings.scrollAnimation }}
        >
            <article className="markdown-body">
                <ReactMarkdown
                    key={fullMarkdownContent}
                    remarkPlugins={[remarkGfm]}
                    components={customComponents}
                >
                    {fullMarkdownContent}
                </ReactMarkdown>
            </article>
        </div>
    );
};

export default Preview;