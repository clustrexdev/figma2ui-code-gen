// Define the available UI frameworks
export type UIFramework = "html" | "react" | "react-native" | "nextjs" | "svelte";

// Define the available CSS frameworks
export type CSSFramework = "tailwindcss" | "bootstrap" | "scss" | "css";

// Define the available UI libraries
export type UILibrary = "none" | "mui" | "shadcn" | "ant-design";

// Define the available code languages
export type CodeLanguage = "javascript" | "typescript";

// Define the tab types
export type TabType = "setup" | "extract" | "preview" | "generate" | "link";

// Define the frame interface
export interface Frame {
id: string;
name: string;
thumbnail: string;
}

// Define the flow interface
export interface Flow {
source: string;
target: string;
}

// Setup tab props
export interface SetupTabProps {
figmaUrl: string;
setFigmaUrl: (url: string) => void;
uiFramework: UIFramework;
setUiFramework: (framework: UIFramework) => void;
cssFramework: CSSFramework;
setCssFramework: (framework: CSSFramework) => void;
uiLibrary: UILibrary;
setUiLibrary: (library: UILibrary) => void;
language: CodeLanguage;
setLanguage: (language: CodeLanguage) => void;
isProcessing: boolean;
handleFigmaUrlSubmit: () => void;
needInitialization : boolean;
setNeedInitialization : (value : boolean) => void;
}

// Extract tab props
export interface ExtractTabProps {
extractedFrames: Frame[];
isProcessing: boolean;
handleFrameSelect: (frame: Frame) => void;
handleFrameDiscard: (frameId: string) => void;
}

// Preview tab props
export interface PreviewTabProps {
selectedFrame: Frame;
fileName: string;
setFileName: (name: string) => void;
figmaUrl : string;
}

// Generate tab props
// Additional prop to add to GenerateTabProps in types.ts

export interface GenerateTabProps {
    selectedFrame: Frame;
    uiFramework: UIFramework;
    cssFramework: CSSFramework;
    uiLibrary: UILibrary;
    language: CodeLanguage;
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    fileName: string;
    setFileName: React.Dispatch<React.SetStateAction<string>>;
    folderName: string; // Add this
    setFolderName: React.Dispatch<React.SetStateAction<string>>; // Add this
    isProcessing: boolean;
    handleGenerateCode: () => void;
}

// Link tab props
export interface LinkTabProps {
extractedFrames: Frame[];
flows: Flow[];
handleAddFlow: (sourceId: string, targetId: string) => void;
handleDeleteFlow: (index: number) => void;
}

// Navigation props
export interface NavigationProps {
activeTab: TabType;
setActiveTab: (tab: TabType) => void;
handlePreviousTab: () => void;
handleNextTab: () => void;
canMoveNext: boolean;
extractedFrames: Frame[];
selectedFrame: Frame | null;
}