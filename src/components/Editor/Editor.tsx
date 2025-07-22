import React from 'react';
import { useProject } from '../../hooks/useProject';
import SectionComponent from '../Section/Section';
import type { Section } from '../../types';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';

const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 },
    },
};


const Editor: React.FC = () => {
    const { activeProject, updateProject, createNewSection } = useProject();
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = activeProject!.sections.findIndex(s => s.id === active.id);
            const newIndex = activeProject!.sections.findIndex(s => s.id === over.id);
            const newSections = arrayMove(activeProject!.sections, oldIndex, newIndex);
            updateProject(activeProject!.id, { sections: newSections });
        }
    };
    const handleUpdateSection = (sectionId: string, updatedContent: Partial<Section>) => {
        const newSections = activeProject!.sections.map(s => s.id === sectionId ? { ...s, ...updatedContent } : s);
        updateProject(activeProject!.id, { sections: newSections });
    };
    const handleDeleteSection = (sectionId: string) => {
        const newSections = activeProject!.sections.filter(s => s.id !== sectionId);
        updateProject(activeProject!.id, { sections: newSections });
    };
    const handleAddSection = () => {
        const newSections = [...activeProject!.sections, createNewSection()];
        updateProject(activeProject!.id, { sections: newSections });
    };
    const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateProject(activeProject!.id, { name: e.target.value });
    };

    return (
        <div className="editor-pane">
            <div className="editor-header">
                <input
                    type="text"
                    value={activeProject!.name}
                    onChange={handleProjectNameChange}
                    className="project-title-input"
                />
                <motion.button
                    onClick={handleAddSection}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    + Añadir Sección
                </motion.button>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={activeProject!.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {}
                    <motion.div
                        className="sections-container"
                        variants={listContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {activeProject!.sections.map(section => (
                                <SectionComponent
                                    key={section.id}
                                    section={section}
                                    onUpdate={(updatedContent) => handleUpdateSection(section.id, updatedContent)}
                                    onDelete={() => handleDeleteSection(section.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default Editor;