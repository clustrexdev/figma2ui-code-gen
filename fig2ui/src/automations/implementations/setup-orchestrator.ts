// services/SetupOrchestrator.ts
import { SetupOptions } from "../../interfaces/framework-setup";
import { CodeLanguage, CSSFramework, UIFramework, UILibrary } from "../../types";
import { SetupFactory } from "../factory/setup-factory";

/**
 * Service that orchestrates the setup process
 * This replaces your InitializeCli class with a more flexible design
 */
export class SetupOrchestrator {
    /**
     * Initialize the selected framework with the given options
     */
    async initializeFramework(
        framework: UIFramework,
        cssFramework: CSSFramework,
        uiLibrary: UILibrary,
        language: CodeLanguage,
        options: { projectName?: string, destination?: string } = {}
    ): Promise<void> {
        try {
        // Get the appropriate setup implementation
        const setupService = SetupFactory.getFrameworkSetup(framework);
        
        // Create setup options
        const setupOptions: SetupOptions = {
            cssFramework,
            uiLibrary,
            language,
            ...options
        };
        
        // Run the initialization process
        await setupService.initialize(setupOptions);
        
        console.log(`Successfully initialized ${framework} project with ${cssFramework}, ${uiLibrary}, and ${language}`);
        
        return Promise.resolve();
        } catch (error) {
        console.error(`Failed to initialize ${framework} project:`, error);
        return Promise.reject(error);
        }
    }

    /**
     * Validate if the selected combination is valid
     */
    validateCombination(
        framework: UIFramework,
        cssFramework: CSSFramework,
        uiLibrary: UILibrary
    ): boolean {
        // Example validation rules
        
        // React Native only supports limited CSS frameworks
        if (framework === 'react-native' && cssFramework !== 'css') {
        return false;
        }
        
        // Certain UI libraries are compatible only with specific frameworks
        if (uiLibrary === 'shadcn' && !['react', 'nextjs'].includes(framework)) {
        return false;
        }
        
        // Add more validation rules as needed
        
        return true;
    }
}