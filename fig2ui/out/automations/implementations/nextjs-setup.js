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
exports.NextjsSetup = void 0;
const cli_1 = require("../cli");
class NextjsSetup extends cli_1.BaseFrameworkSetup {
    createProjectStructure(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating Next.js project structure');
            // Project structure creation logic specific to Next.js
        });
    }
    setupConfig(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Next.js configuration');
            // Next.js-specific configuration setup
            // Example: Create next.config.js with appropriate settings based on options
        });
    }
    installDependencies(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Installing Next.js dependencies');
            // Base dependencies
            const dependencies = ['next', 'react', 'react-dom'];
            // Add CSS framework dependencies
            if (options.cssFramework === 'tailwindcss') {
                dependencies.push('tailwindcss', 'autoprefixer', 'postcss');
            }
            else if (options.cssFramework === 'bootstrap') {
                dependencies.push('bootstrap', 'react-bootstrap');
            }
            // Add UI library dependencies
            if (options.uiLibrary === 'shadcn') {
                dependencies.push('@shadcn/ui');
            }
            // Add TypeScript dependencies if needed
            if (options.language === 'typescript') {
                dependencies.push('@types/react', '@types/react-dom', '@types/node');
            }
            console.log('Dependencies to install:', dependencies.join(', '));
            // Logic to install dependencies
        });
    }
    // Protected helper methods specific to Next.js setup
    setupTailwind() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Tailwind CSS for Next.js');
            // Next.js-specific Tailwind setup
        });
    }
    setupShadcn() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Shadcn UI for Next.js');
            // Next.js-specific Shadcn UI setup
        });
    }
}
exports.NextjsSetup = NextjsSetup;
//# sourceMappingURL=nextjs-setup.js.map