"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupOrchestrator = void 0;
const setup_factory_1 = require("../factory/setup-factory");
/**
 * Service that orchestrates the setup process
 * This replaces your InitializeCli class with a more flexible design
 */
class SetupOrchestrator {
    /**
     * Initialize the selected framework with the given options
     */
    initializeFramework(framework, cssFramework, uiLibrary, language, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the appropriate setup implementation
                const setupService = setup_factory_1.SetupFactory.getFrameworkSetup(framework);
                // Create setup options
                const setupOptions = Object.assign({ cssFramework,
                    uiLibrary,
                    language }, options);
                // Run the initialization process
                yield setupService.initialize(setupOptions);
                console.log(`Successfully initialized ${framework} project with ${cssFramework}, ${uiLibrary}, and ${language}`);
                return Promise.resolve();
            }
            catch (error) {
                console.error(`Failed to initialize ${framework} project:`, error);
                return Promise.reject(error);
            }
        });
    }
    /**
     * Validate if the selected combination is valid
     */
    validateCombination(framework, cssFramework, uiLibrary) {
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
exports.SetupOrchestrator = SetupOrchestrator;
//# sourceMappingURL=setup-orchestrator.js.map