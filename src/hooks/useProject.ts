import { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
export const useProject = () => {
    const context = useContext(ProjectContext);

    if (!context) {
        throw new Error('useProject debe ser usado dentro de un ProjectProvider');
    }

    return context;
};