// factories/SetupFactory.ts
import { CodeLanguage, CSSFramework, UIFramework, UILibrary } from "../../types";
import { IFrameworkSetup, SetupOptions } from "../../interfaces/framework-setup";
import { ReactSetup } from "../implementations/react-setup";
import { NextjsSetup } from "../implementations/nextjs-setup";
import { VanillaJsSetup } from "../implementations/vanilla-setup";
import { ReactNativeSetup } from "../implementations/react-native-setup";
import { SvelteSetup } from "../implementations/svelte-setup";

/**
 * Factory for creating framework setup instances based on the UIFramework type
 */
export class SetupFactory {
private static instances: Map<UIFramework, IFrameworkSetup> = new Map();

/**
 * Get the appropriate framework setup implementation
 * Uses Singleton pattern for each framework type
 */
static getFrameworkSetup(framework: UIFramework): IFrameworkSetup {
    if (!this.instances.has(framework)) {
    switch (framework) {
        case 'react':
        this.instances.set(framework, new ReactSetup());
        break;
        case 'nextjs':
        this.instances.set(framework, new NextjsSetup());
        break;
        case 'html':
        this.instances.set(framework, new VanillaJsSetup());
        break;
        case 'react-native':
        this.instances.set(framework, new ReactNativeSetup());
        break;
        case 'svelte':
        this.instances.set(framework, new SvelteSetup());
        break;
        default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
    }
    
    return this.instances.get(framework)!;
}

/**
 * Create SetupOptions for the selected configuration
 */
static createSetupOptions(
        cssFramework: CSSFramework,
        uiLibrary: UILibrary,
        language: CodeLanguage,
        projectName?: string,
        destination?: string
    ): SetupOptions {
        return {
        cssFramework,
        uiLibrary,
        language,
        projectName,
        destination
        };
    }
}