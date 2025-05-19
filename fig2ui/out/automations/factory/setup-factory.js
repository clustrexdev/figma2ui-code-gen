"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupFactory = void 0;
const react_setup_1 = require("../implementations/react-setup");
const nextjs_setup_1 = require("../implementations/nextjs-setup");
const vanilla_setup_1 = require("../implementations/vanilla-setup");
const react_native_setup_1 = require("../implementations/react-native-setup");
const svelte_setup_1 = require("../implementations/svelte-setup");
/**
 * Factory for creating framework setup instances based on the UIFramework type
 */
class SetupFactory {
    /**
     * Get the appropriate framework setup implementation
     * Uses Singleton pattern for each framework type
     */
    static getFrameworkSetup(framework) {
        if (!this.instances.has(framework)) {
            switch (framework) {
                case 'react':
                    this.instances.set(framework, new react_setup_1.ReactSetup());
                    break;
                case 'nextjs':
                    this.instances.set(framework, new nextjs_setup_1.NextjsSetup());
                    break;
                case 'html':
                    this.instances.set(framework, new vanilla_setup_1.VanillaJsSetup());
                    break;
                case 'react-native':
                    this.instances.set(framework, new react_native_setup_1.ReactNativeSetup());
                    break;
                case 'svelte':
                    this.instances.set(framework, new svelte_setup_1.SvelteSetup());
                    break;
                default:
                    throw new Error(`Unsupported framework: ${framework}`);
            }
        }
        return this.instances.get(framework);
    }
    /**
     * Create SetupOptions for the selected configuration
     */
    static createSetupOptions(cssFramework, uiLibrary, language, projectName, destination) {
        return {
            cssFramework,
            uiLibrary,
            language,
            projectName,
            destination
        };
    }
}
exports.SetupFactory = SetupFactory;
SetupFactory.instances = new Map();
//# sourceMappingURL=setup-factory.js.map