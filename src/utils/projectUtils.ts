import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Project } from '../types';

export const exportProjectAsZip = (project: Project): void => {
    const zip = new JSZip();
    zip.file("project.json", JSON.stringify(project, null, 2));

    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, `${project.name.replace(/ /g, "_") || 'orion_project'}.zip`);
    });
};

export const importProjectFromZip = (
        file: File,
    onImport: (projectData: Project) => void,
    onError: (message: string) => void
): void => {
    const zip = new JSZip();
    zip.loadAsync(file)
        .then(zip => {
            const projectFile = zip.file("project.json");
            if (!projectFile) {
                onError("El archivo .zip no contiene un proyecto de Orion válido (falta project.json).");
                return;
            }
            return projectFile.async("string");
        })
        .then(content => {
            if (content) {
                const projectData = JSON.parse(content) as Project;
                onImport(projectData);
            }
        })
        .catch(err => {
            console.error("Error al importar el proyecto:", err);
            onError("No se pudo leer el archivo. Podría estar corrupto.");
        });
};