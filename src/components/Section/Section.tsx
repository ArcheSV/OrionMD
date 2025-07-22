import React from 'react';
import type { Section } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

interface SectionProps {
    section: Section;
    onUpdate: (updatedContent: Partial<Section>) => void;
    onDelete: () => void;
}

const SectionComponent: React.FC<SectionProps> = ({ section, onUpdate, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 'auto',
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ title: e.target.value });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ content: e.target.value });
    };

    return (
        <motion.div ref={setNodeRef} style={style} {...attributes} className="section-card">
            <div className="section-card-header">
                <motion.button
                    {...listeners}
                    className="drag-handle"
                    whileHover={{ scale: 1.2, color: 'white' }}
                    whileTap={{ scale: 0.9, cursor: 'grabbing' }}
                >
                    ⠿
                </motion.button>

                <input
                    type="text"
                    value={section.title}
                    onChange={handleTitleChange}
                    className="section-title-input"
                    placeholder="Título de la sección"
                />

                <motion.button
                    onClick={onDelete}
                    title="Eliminar sección"
                    className="delete-btn"
                    whileHover={{ scale: 1.1, backgroundColor: '#ff5c5c' }}
                    whileTap={{ scale: 0.9 }}
                >
                    🗑️
                </motion.button>
            </div>

            <textarea
                value={section.content}
                onChange={handleContentChange}
                className="section-textarea"
                placeholder="Escribe aqui..."
                rows={8}
            />
        </motion.div>
    );
};

export default SectionComponent;