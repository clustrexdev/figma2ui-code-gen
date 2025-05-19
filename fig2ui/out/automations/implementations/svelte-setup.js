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
exports.SvelteSetup = void 0;
const cli_1 = require("../cli");
class SvelteSetup extends cli_1.BaseFrameworkSetup {
    createProjectStructure(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating Svelte project structure');
            // Project structure creation logic specific to Svelte
        });
    }
    installDependencies(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Installing Svelte dependencies');
            // Base dependencies
            const dependencies = ['svelte'];
            const devDependencies = [
                'svelte-check',
                'svelte-preprocess',
                'vite',
                '@sveltejs/vite-plugin-svelte'
            ];
            // Add CSS framework dependencies
            if (options.cssFramework === 'tailwindcss') {
                devDependencies.push('tailwindcss', 'autoprefixer', 'postcss');
            }
            else if (options.cssFramework === 'bootstrap') {
                dependencies.push('bootstrap', 'sveltestrap');
            }
            // Add TypeScript dependencies if needed
            if (options.language === 'typescript') {
                devDependencies.push('typescript', 'tslib', '@tsconfig/svelte');
            }
            console.log('Dependencies to install:', dependencies.join(', '));
            console.log('Dev dependencies to install:', devDependencies.join(', '));
            // Logic to install dependencies
        });
    }
    setupConfig(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Svelte configuration');
            // Set up svelte.config.js based on options
            if (options.language === 'typescript') {
                yield this.setupTypeScript();
            }
            if (options.cssFramework === 'tailwindcss' || options.cssFramework === 'scss') {
                yield this.setupPreprocessor(options.cssFramework);
            }
        });
    }
    // Protected helper methods specific to Svelte setup
    setupTypeScript() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up TypeScript for Svelte');
            // Svelte-specific TypeScript setup
        });
    }
    setupPreprocessor(cssFramework) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Setting up preprocessor for ${cssFramework}`);
            // Svelte-specific preprocessor setup
        });
    }
    setupTailwind() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Tailwind CSS for Svelte');
            // Svelte-specific Tailwind setup
        });
    }
}
exports.SvelteSetup = SvelteSetup;
//# sourceMappingURL=svelte-setup.js.map