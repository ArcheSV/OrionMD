# 🌌 OrionMD

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![PRs Bienvenidos](https://img.shields.io/badge/PRs-bienvenidos-brightgreen.svg)](https://archesv.xyz/)

**Orion Editor** es un editor de Markdown web el cual puedes exportar tus notas en un HTML.

---

## 🔗 Demo en Vivo



## ✨ Características Principales

- **Edición en paralelo**  
  Visualiza el Markdown crudo y su renderizado en tiempo real, lado a lado.

- **Gestión dinámica de secciones**  
  Crea, elimina, reorganiza y renombra bloques mediante una interfaz de arrastrar y soltar.

- **Temas personalizables**  
  Ajusta degradados de fondo, desenfoques y acentos de color desde la configuración, con vistas previas en vivo.

- **Fondo 3D interactivo**  
  Un cielo estrellado generado con React Three Fiber que reacciona al movimiento del ratón, aportando profundidad y dinamismo.

- **Animaciones suaves**  
  Transiciones y microinteracciones impulsadas por Framer Motion para una experiencia de usuario fluida.

- **Compatibilidad ampliada con Markdown**  
  Soporta GitHub Flavored Markdown (GFM), incluyendo spoilers anidados (`||...||`) y otros elementos avanzados.

- **Gestión de proyectos**  
  Organiza múltiples documentos, importa y exporta proyectos completos como archivos `.zip`.

- **Exportación a HTML estático**  
  Genera un archivo HTML fiel al diseño, con opción de menú lateral para facilitar la navegación.

---

## 🛠️ Mas detalles

- **Lenguaje**: TypeScript
- **Framework**: React (Hooks & Context API)
- **Bundler**: Vite
- **Animaciones**: Framer Motion
- **Renderizado 3D**: React Three Fiber & Drei
- **Drag & Drop**: dnd-kit
- **Markdown**: react-markdown, remark-gfm, marked
- **Utilidades**: jszip, file-saver, color

Los estilos se implementan con CSS plano y Variables CSS para cambiar temas en tiempo real.

---

## 🏗️ Arquitectura

1. **Estado global**
    - `ProjectContext.tsx` gestiona la lista de proyectos, el documento activo y las acciones CRUD.
    - Uso de React Context para compartir estado y funciones entre componentes.

2. **Temas dinámicos**
    - Un `useEffect` detecta cambios en los colores de fondo.
    - La librería `color` calcula variantes de acento y actualiza Variables CSS en `<html>`.

3. **Componentes clave**
    - **App.tsx**: Define el layout principal (barra lateral, área de edición, panel de ajustes).
    - **Sidebar.tsx**: Lista de proyectos, importación/exportación y controles principales.
    - **Editor.tsx**: Secciones editables con lógica de arrastrar y soltar.
    - **Section.tsx**: Tarjeta individual para cada bloque de Markdown.
    - **Preview.tsx**: Renderizado en tiempo real usando `react-markdown` y un parser personalizado para spoilers.
    - **Scene.tsx**: Escena 3D independiente con React Three Fiber.

---

## 🚀 Guía de Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/orion-editor.git


2. Entra en la carpeta del proyecto:

   ```bash
   cd orion-editor
   ```
3. Instala dependencias:

   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   La aplicación se servirá en `http://localhost:5173` (o el puerto que indique Vite).

---

## 📜 Licencia



Este proyecto está bajo la **Licencia MIT**. Puedes distribuir, contribuir y hacer lo que quieras con el código libremente.
