export interface Section {
    id: string;
    title: string;
    content: string;
}

export interface Settings {
    bgGradientStart: string;
    bgGradientEnd: string;
    backgroundBlur: string;
    scrollAnimation: 'smooth' | 'auto';
    showSidebarInExport: boolean;
}

export interface Project {
    id: string;
    name: string;
    sections: Section[];
    settings: Settings;
}