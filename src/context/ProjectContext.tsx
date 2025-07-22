import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Section } from '../types';
import Color from 'color';

const createNewSection = (): Section => ({
    id: uuidv4(),
    title: 'Nueva Sección',
    content: `# ¡Bienvenido a Orion!

Usa la sintaxis de Markdown para dar formato a tu texto. Por ejemplo:

- **Negrita**
- *Cursiva*
- \`código\`
- Un [enlace](https://archesv.xyz)
- ||Un spoiler para ocultar texto||

También puedes crear listas numeradas:

1. Primer elemento
2. Segundo elemento
3. Tercer elemento

Esta web aún **NO** está completa, a si que es muy probable
que encuentres varios bugs y falta de contenido, con el tiempo
lo iré arreglando y agregando contenido, muchas gracias por darle una oportunidad a mi
proyecto ;)
`
});
const createNewProject = (): Project => ({
    id: uuidv4(),
    name: 'Mi Primer Proyecto en Orion',
    sections: [createNewSection()],
    settings: {
        bgGradientStart: '#0f2027',
        bgGradientEnd: '#2c5364',
        backgroundBlur: '0px',
        scrollAnimation: 'smooth',
        showSidebarInExport: true,
    },
});

interface ProjectContextType {
    projects: Project[];
    activeProjectId: string | null;
    activeProject: Project | undefined;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    setActiveProjectId: React.Dispatch<React.SetStateAction<string | null>>;
    updateProject: (projectId: string, updatedData: Partial<Project>) => void;
    createNewProject: () => Project;
    createNewSection: () => Section;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [initialProject] = useState(createNewProject());
    const [projects, setProjects] = useState<Project[]>([initialProject]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(initialProject.id);

    const activeProject = projects.find(p => p.id === activeProjectId);

    useEffect(() => {
        if (activeProject) {
            try {
                const startColor = Color(activeProject.settings.bgGradientStart);

                const endColor = Color(activeProject.settings.bgGradientEnd);

                const accentStart = startColor.lighten(0.3).saturate(0.2).hex();
                const accentEnd = endColor.lighten(0.3).saturate(0.2).hex();

                const root = document.documentElement;
                root.style.setProperty('--accent-primary', accentStart);
                root.style.setProperty('--accent-secondary', accentEnd);

            } catch (error) {
                console.warn("[DEPURACION] No se pudieron actualizar los colores:", error);
                /* Si encuentras un error, hazmelo saber, porfavor 😀🔫 */
            }
        }
    }, [activeProject]);

    const updateProject = (projectId: string, updatedData: Partial<Project>) => {
        setProjects(projects =>
            projects.map(p =>
                p.id === projectId ? { ...p, ...updatedData } : p
            )
        );
    };

    const value: ProjectContextType = {
        projects,
        setProjects,
        activeProject,
        activeProjectId,
        setActiveProjectId,
        updateProject,
        createNewProject,
        createNewSection,
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};