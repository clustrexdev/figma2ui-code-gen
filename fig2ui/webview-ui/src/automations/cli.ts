// services/BaseFrameworkSetup.ts
import { IFrameworkSetup, IFrameworkImplementation, SetupOptions } from "../interfaces/framework-setup";
import { CodeLanguage, CSSFramework, UILibrary } from "../types";

export abstract class BaseFrameworkSetup implements IFrameworkSetup, IFrameworkImplementation {
    /**
     * Template method that defines the setup algorithm structure
     * Subclasses will override specific steps but not the overall algorithm
     */
    public async initialize(options: SetupOptions): Promise<void> {
        console.log(`Initializing ${this.constructor.name} with options:`, options);
        
        // Common setup steps executed in sequence
        await this.createProjectStructure(options);
        
        // Optional steps that might be overridden by specific frameworks
        await this.setupLanguage(options.language);
        await this.setupStyles(options.cssFramework);
        await this.setupUILibrary(options.uiLibrary);
        await this.installDependencies(options);
        await this.setupConfig(options);
        
        // Final common steps
        await this.postSetup(options);
    }
    
    // Required to be implemented by all framework setups
    public abstract createProjectStructure(options: SetupOptions): Promise<void>;
    
    // Common implementation with framework-specific overrides if needed
    public async setupStyles(cssFramework: CSSFramework): Promise<void> {
        console.log(`Setting up CSS framework: ${cssFramework}`);
        
        switch (cssFramework) {
            case 'tailwindcss':
                await this.setupTailwind();
                break;
            case 'bootstrap':
                await this.setupBootstrap();
                break;
            case 'scss':
                await this.setupSCSS();
                break;
            case 'css':
                await this.setupCSS();
                break;
        }
    }
    
    public async setupUILibrary(uiLibrary: UILibrary): Promise<void> {
        console.log(`Setting up UI library: ${uiLibrary}`);
        // Default implementation - can be overridden by specific frameworks
    }
    
    public async setupLanguage(language: CodeLanguage): Promise<void> {
        console.log(`Setting up language: ${language}`);
        
        if (language === 'typescript') {
            await this.setupTypeScript();
        }
    }
    
    public async installDependencies(options: SetupOptions): Promise<void> {
        console.log('Installing dependencies (Base Implementation)');
        // Default implementation - should be overridden by specific frameworks
    }
    
    public async setupConfig(options: SetupOptions): Promise<void> {
        console.log('Setting up configuration (Base Implementation)');
        // Default implementation - can be overridden by specific frameworks
    }
    
    public async postSetup(options: SetupOptions): Promise<void> {
        console.log('Running post-setup tasks (Base Implementation)');
        // Default implementation - can be overridden by specific frameworks
    }
    
    // Protected helper methods that can be used by subclasses
    protected async setupTailwind(): Promise<void> {
        console.log('Setting up Tailwind CSS (Base Implementation)');
    }
    
    protected async setupBootstrap(): Promise<void> {
        console.log('Setting up Bootstrap (Base Implementation)');
    }
    
    protected async setupSCSS(): Promise<void> {
        console.log('Setting up SCSS (Base Implementation)');
    }
    
    protected async setupCSS(): Promise<void> {
        console.log('Setting up CSS (Base Implementation)');
    }
    
    protected async setupTypeScript(): Promise<void> {
        console.log('Setting up TypeScript (Base Implementation)');
    }
}