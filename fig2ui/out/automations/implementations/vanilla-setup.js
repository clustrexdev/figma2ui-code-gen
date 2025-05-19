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
exports.VanillaJsSetup = void 0;
const cli_1 = require("../cli");
class VanillaJsSetup extends cli_1.BaseFrameworkSetup {
    createProjectStructure(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating vanilla HTML/JS project structure');
            // Project structure creation logic specific to vanilla HTML/JS
        });
    }
    installDependencies(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up dependencies for vanilla HTML/JS project');
            // For vanilla HTML/JS, we might use NPM for development dependencies
            // but the runtime dependencies are usually loaded via CDN
            const devDependencies = [];
            if (options.cssFramework === 'tailwindcss') {
                devDependencies.push('tailwindcss', 'autoprefixer', 'postcss');
            }
            // Add TypeScript dependencies if needed
            if (options.language === 'typescript') {
                devDependencies.push('typescript', '@types/node');
            }
            console.log('Dev dependencies to install:', devDependencies.join(', '));
            // Logic to install dev dependencies
        });
    }
    setupConfig(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up configuration for vanilla HTML/JS project');
            if (options.cssFramework === 'tailwindcss') {
                yield this.setupTailwindConfig();
            }
            if (options.language === 'typescript') {
                yield this.setupTypeScriptConfig();
            }
        });
    }
    // Protected helper methods specific to vanilla setup
    setupTailwindConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Tailwind CSS configuration');
            // Vanilla-specific Tailwind setup
        });
    }
    setupTypeScriptConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up TypeScript configuration');
            // Vanilla-specific TypeScript setup
        });
    }
    setupTailwind() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Tailwind CSS for vanilla HTML/JS');
            // Vanilla HTML/JS-specific Tailwind setup
        });
    }
    setupBootstrap() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Bootstrap for vanilla HTML/JS');
            // Vanilla HTML/JS-specific Bootstrap setup
        });
    }
}
exports.VanillaJsSetup = VanillaJsSetup;
//# sourceMappingURL=vanilla-setup.js.map