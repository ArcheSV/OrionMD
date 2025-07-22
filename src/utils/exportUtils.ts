import { saveAs } from 'file-saver';
import { marked } from 'marked';
import type { Project } from '../types';
import Color from 'color';

const spoilerExtension = {
    name: 'spoiler',
    level: 'inline' as const,
    start(src: string) { return src.indexOf('||'); },
    tokenizer(src: string) {
        const rule = /^\|\|(.*?)\|\|/;
        const match = rule.exec(src);

        if (match) {
            return {
                type: 'spoiler',
                raw: match[0],
                text: this.lexer.inlineTokens(match[1]),
            };
        }
    },
    renderer(token: any) {
        return `<span class="html-spoiler">${this.parser.parseInline(token.text)}</span>`;
    }
};

marked.use({ extensions: [spoilerExtension] });

const generateHtml = (project: Project): string => {
    const bodyContent = project.sections.map(section =>
        `<section id="section-${section.id}">
        <h2>${section.title}</h2>
        <div>${marked.parse(section.content)}</div>
    </section>`
    ).join('');

    const sidebarContent = project.settings.showSidebarInExport ?
        `<nav class="sidebar">
        <div class="sidebar-header">
            <svg width="24" height="24" viewBox="0 0 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3>${project.name}</h3>
        </div>
        <ul>
            ${project.sections.map(s => `<li><a href="#section-${s.id}">${s.title}</a></li>`).join('')}
        </ul>
     </nav>` : '';

    let accentStart = '#8a85ff';
    let accentEnd = '#c265ff';
    try {
        const startColor = Color(project.settings.bgGradientStart);
        const endColor = Color(project.settings.bgGradientEnd);
        accentStart = startColor.lighten(0.3).saturate(0.2).hex();
        accentEnd = endColor.lighten(0.3).saturate(0.2).hex();
    } catch (e) {
        console.error("No se pudieron calcular los colores de acento para la exportación.", e);
    }

    const fullCss = `
    :root { 
      --accent-primary: ${accentStart}; 
      --accent-secondary: ${accentEnd};
    }
    
    body { font-family: 'Sora', -apple-system, sans-serif; line-height: 1.6; margin: 0; color: #ebe9ff; background-color: #020015; }
    .aurora-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: linear-gradient(145deg, ${project.settings.bgGradientStart}, ${project.settings.bgGradientEnd}); }
    .aurora-canvas::before, .aurora-canvas::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; filter: blur(120px); opacity: 0.4; }
    .aurora-canvas::before { background: radial-gradient(circle at 10% 20%, var(--accent-primary), transparent 40%); animation: move-aurora-1 25s infinite alternate; }
    .aurora-canvas::after { background: radial-gradient(circle at 90% 80%, var(--accent-secondary), transparent 40%); animation: move-aurora-2 20s infinite alternate-reverse; }
    @keyframes move-aurora-1 { from { transform: translate(-20%, -15%); } to { transform: translate(10%, 20%); } }
    @keyframes move-aurora-2 { from { transform: translate(15%, 10%); } to { transform: translate(-10%, -20%); } }
    .container { display: flex; width: 100vw; height: 100vh; padding: 20px; gap: 20px; box-sizing: border-box; position: relative; z-index: 1; }
    .sidebar { width: 280px; height: calc(100vh - 40px); padding: 1.5rem; border-radius: 12px; flex-shrink: 0; background: rgba(15, 12, 41, 0.5); backdrop-filter: blur(${project.settings.backgroundBlur}); -webkit-backdrop-filter: blur(${project.settings.backgroundBlur}); border: 1px solid rgba(138, 133, 255, 0.2); }
    .sidebar-header { display: flex; align-items: center; gap: 0.75rem; color: white; }
    .sidebar ul { list-style: none; padding: 0; margin-top: 2rem; }
    .sidebar li a { text-decoration: none; color: #c1bfff; display: block; padding: 0.5rem; border-radius: 6px; transition: all 0.2s; }
    .sidebar li a:hover { color: white; background-color: var(--accent-primary); opacity: 0.5; }
    .content { flex-grow: 1; padding: 2rem 3rem; overflow-y: auto; height: calc(100vh - 40px); border-radius: 12px; color: #24292e; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(${project.settings.backgroundBlur}); -webkit-backdrop-filter: blur(${project.settings.backgroundBlur}); border: 1px solid rgba(138, 133, 255, 0.2); }
    .content h1, .content h2 { border-bottom: 1px solid #eaecef; padding-bottom: 0.5em; }
    .content code { background-color: #e6e6e6; padding: 2px 5px; border-radius: 4px; }
    .content pre { background-color: #e6e6e6; padding: 1rem; border-radius: 5px; overflow-x: auto; }
    .content blockquote { border-left: 4px solid #ccc; padding-left: 1rem; color: #666; margin-left: 0; }
    .content img { max-width: 100%; height: auto; border-radius: 8px; }
    .html-spoiler { display: inline-block; background-color: transparent; color: #24292e; filter: blur(4px); cursor: pointer; border-radius: 4px; padding: 0 4px; transition: filter 0.3s ease-in-out; }
    .html-spoiler:hover { filter: blur(0px); }
    @media (max-width: 768px) { .container { flex-direction: column; height: auto; } .sidebar, .content { width: auto; height: auto; max-height: none; } }
  `;

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${project.name}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600&display=swap" rel="stylesheet">
        <style>${fullCss}</style>
    </head>
    <body>
        <div class="aurora-canvas"></div>
        <div class="container">
            ${sidebarContent}
            <main class="content">
                <h1>${project.name}</h1>
                ${bodyContent}
            </main>
        </div>
    </body>
    </html>
  `;
};

export const exportToHtml = (project: Project): void => {
    const htmlString = generateHtml(project);
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${project.name.replace(/ /g, "_") || 'orion_export'}.html`);
};