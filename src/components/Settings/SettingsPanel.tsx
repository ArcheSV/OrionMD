import React, { useState } from 'react';
import { useProject } from '../../hooks/useProject';
import type { Settings } from '../../types';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const controlVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            type: 'spring',
            stiffness: 100,
        },
    }),
};

const SettingsPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { activeProject, updateProject } = useProject();

    if (!activeProject) return null;
    const handleSettingChange = (key: keyof Settings, value: string | boolean | 'smooth' | 'auto') => {
        const newSettings = { ...activeProject.settings, [key]: value };
        updateProject(activeProject.id, { settings: newSettings });
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="settings-toggle-btn"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                title="Configuración"
            >
                ⚙️
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="settings-panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                    >
                        <div className="settings-header">
                            <h2>Configuración Visual</h2>
                            <p>Personaliza la apariencia de tu proyecto.</p>
                        </div>
                        <motion.div className="setting-control" custom={0} initial="hidden" animate="visible" variants={controlVariants}>
                            <label htmlFor="bgStart">Color de Inicio del Gradiente</label>
                            <div className="color-picker-wrapper">
                                <input
                                    type="color"
                                    id="bgStart"
                                    className="color-picker"
                                    value={activeProject.settings.bgGradientStart}
                                    onChange={(e) => handleSettingChange('bgGradientStart', e.target.value)}
                                />
                                <span>{activeProject.settings.bgGradientStart}</span>
                            </div>
                        </motion.div>

                        <motion.div className="setting-control" custom={1} initial="hidden" animate="visible" variants={controlVariants}>
                            <label htmlFor="bgEnd">Color de Fin del Gradiente</label>
                            <div className="color-picker-wrapper">
                                <input
                                    type="color"
                                    id="bgEnd"
                                    className="color-picker"
                                    value={activeProject.settings.bgGradientEnd}
                                    onChange={(e) => handleSettingChange('bgGradientEnd', e.target.value)}
                                />
                                <span>{activeProject.settings.bgGradientEnd}</span>
                            </div>
                        </motion.div>
                        {/*<motion.div className="setting-control" custom={2} initial="hidden" animate="visible" variants={controlVariants}>
                            <label htmlFor="bgBlur">Desenfoque de Paneles: <span>{activeProject.settings.backgroundBlur}</span></label>
                            <input
                                type="range"
                                className="custom-slider"
                                id="bgBlur"
                                min="0"
                                max="20"
                                step="1"
                                value={parseInt(activeProject.settings.backgroundBlur)}
                                onChange={(e) => handleSettingChange('backgroundBlur', `${e.target.value}px`)}
                            />
                        </motion.div>
                        //Todo esto lo quise poner pero no funcionaba nadasdiouahskjdghasdiujgahsdkujash
                        //Esto en teoria sirve para que pueda ponerse mas blur al fondo, pero claro, NO VA*/}

                        <motion.div className="setting-control" custom={3} initial="hidden" animate="visible" variants={controlVariants}>
                            <label htmlFor="scrollAnim">Animación de Scroll</label>
                            <select
                                id="scrollAnim"
                                value={activeProject.settings.scrollAnimation}
                                onChange={(e) => handleSettingChange('scrollAnimation', e.target.value as 'smooth' | 'auto')}
                            >
                                // NO FUNCIONA NADAAAAAAAA
                                <option value="smooth">Suave (Smooth)</option>
                                <option value="auto">Instantáneo (Auto)</option>
                            </select>
                        </motion.div>

                        <motion.div className="setting-control checkbox-control" custom={4} initial="hidden" animate="visible" variants={controlVariants}>
                            <label htmlFor="showSidebar">
                                <input
                                    type="checkbox"
                                    id="showSidebar"
                                    checked={activeProject.settings.showSidebarInExport}
                                    onChange={(e) => handleSettingChange('showSidebarInExport', e.target.checked)}
                                />
                                <span className="custom-checkbox"></span>
                                Incluir barra lateral al exportar
                            </label>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SettingsPanel;