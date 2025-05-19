// interfaces/IFrameworkSetup.ts
import { CodeLanguage, CSSFramework, UILibrary } from "../types";

export interface SetupOptions {
    cssFramework: CSSFramework;
    uiLibrary: UILibrary;
    language: CodeLanguage;
    projectName?: string;
    destination?: string;
}

// Public interface that external code will use
export interface IFrameworkSetup {
    // Public method that orchestrates the setup process
    initialize(options: SetupOptions): Promise<void>;
}

// Protected interface for internal framework implementations
export interface IFrameworkImplementation {
    createProjectStructure(options: SetupOptions): Promise<void>;
    installDependencies(options: SetupOptions): Promise<void>;
    setupConfig(options: SetupOptions): Promise<void>;
    setupStyles(cssFramework: CSSFramework): Promise<void>;
    setupUILibrary(uiLibrary: UILibrary): Promise<void>;
    setupLanguage(language: CodeLanguage): Promise<void>;
    postSetup?(options: SetupOptions): Promise<void>;
}