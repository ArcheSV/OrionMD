import React, { useRef } from 'react';
import { useProject } from '../../hooks/useProject';
import { exportToHtml } from '../../utils/exportUtils';
import { exportProjectAsZip, importProjectFromZip } from '../../utils/projectUtils';
import type { Project } from '../../types';

import { motion, AnimatePresence } from 'framer-motion';
const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
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

const Sidebar: React.FC = () => {
    const {
        projects,
        activeProject,
        setActiveProjectId,
        setProjects,
        createNewProject
    } = useProject();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateProject = () => {
        const newProject = createNewProject();
        setProjects(prev => [...prev, newProject]);
        setActiveProjectId(newProject.id);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importProjectFromZip(
                file,
                (importedProject: Project) => {
                    setProjects(prev => [...prev, importedProject]);
                    setActiveProjectId(importedProject.id);
                    alert(`Proyecto "${importedProject.name}" importado con éxito.`);
                },
                (errorMessage: string) => {
                    alert(`Error al importar: ${errorMessage}`);
                }
            );
        }
        event.target.value = '';
    };

    return (
        <motion.aside className="sidebar">
            <div className="sidebar-header">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1>Orion</h1>
            </div>

            <div className="sidebar-section projects-list">
                <h3>Mis Proyectos</h3>
                <motion.ul
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {projects.map(p => (
                            <motion.li
                                key={p.id}
                                variants={listItemVariants}
                                exit={{ opacity: 0, x: -50 }}
                                whileHover={{ scale: 1.03, backgroundColor: 'rgba(138, 133, 255, 0.15)' }}
                                whileTap={{ scale: 0.98 }}
                                className={p.id === activeProject?.id ? 'active' : ''}
                                onClick={() => setActiveProjectId(p.id)}
                            >
                                <span className="project-icon">📄</span>
                                {p.name}
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
                <motion.button
                    onClick={handleCreateProject}
                    className="full-width-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    + Nuevo Proyecto
                </motion.button>
            </div>

            <div className="sidebar-section actions-list">
                <h3>Acciones</h3>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => exportToHtml(activeProject!)}>Exportar a .HTML</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => exportProjectAsZip(activeProject!)}>Exportar Proyecto (.zip)</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleImportClick}>Importar Proyecto (.zip)</motion.button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".zip"
                    onChange={handleFileImport}
                />
            </div>
        </motion.aside>
    );
};

export default Sidebar;