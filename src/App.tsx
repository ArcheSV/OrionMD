import React from 'react';
import { useProject } from './hooks/useProject';

import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import Preview from './components/Preview/Preview';
import SettingsPanel from './components/Settings/SettingsPanel';
import Background3D from './components/Background3D/Scene';

function App() {
    let projectData;
    try {
        projectData = useProject();
    } catch (error) {
        console.error(error);
        return (
            <div style={{ padding: '2rem', color: 'red', backgroundColor: 'black', height: '100vh' }}>
                <h1>Error de Aplicación</h1>
                <p>No se pudo cargar el contexto del proyecto. Asegúrate de que App.tsx está envuelto en ProjectProvider en main.tsx.</p>
                <pre>{(error as Error).message}</pre>
            </div>
        );
    }

    const { activeProject } = projectData;

    if (!activeProject) {
        return (
            <div style={{ display: 'grid', placeContent: 'center', height: '100vh', background: '#1a1a1a', color: '#fff' }}>
                Cargando Orion o creando un nuevo proyecto...
            </div>
        );
    }

    const appContainerStyles: React.CSSProperties = {
        background: `linear-gradient(145deg, ${activeProject.settings.bgGradientStart}, ${activeProject.settings.bgGradientEnd})`,
    };

    return (
        <div className="app-container" style={appContainerStyles}>

            <Background3D />
            <Sidebar />

            <main className="main-content">
                <Editor />
                <Preview />
            </main>

            <SettingsPanel />

        </div>
    );
}

export default App;