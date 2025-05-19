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
exports.BaseFrameworkSetup = void 0;
const vscode_1 = require("vscode");
let folders = vscode_1.workspace.workspaceFolders;
if (folders) {
    for (const folder of folders) {
        console.log(folder);
    }
}
class BaseFrameworkSetup {
    /**
     * Template method that defines the setup algorithm structure
     * Subclasses will override specific steps but not the overall algorithm
     */
    initialize(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Initializing ${this.constructor.name} with options:`, options);
            // Common setup steps executed in sequence
            yield this.createProjectStructure(options);
            // Optional steps that might be overridden by specific frameworks
            yield this.setupLanguage(options.language);
            yield this.setupStyles(options.cssFramework);
            yield this.setupUILibrary(options.uiLibrary);
            yield this.installDependencies(options);
            yield this.setupConfig(options);
            // Final common steps
            yield this.postSetup(options);
        });
    }
    // Common implementation with framework-specific overrides if needed
    setupStyles(cssFramework) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Setting up CSS framework: ${cssFramework}`);
            switch (cssFramework) {
                case 'tailwindcss':
                    yield this.setupTailwind();
                    break;
                case 'bootstrap':
                    yield this.setupBootstrap();
                    break;
                case 'scss':
                    yield this.setupSCSS();
                    break;
                case 'css':
                    yield this.setupCSS();
                    break;
            }
        });
    }
    setupUILibrary(uiLibrary) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Setting up UI library: ${uiLibrary}`);
            // Default implementation - can be overridden by specific frameworks
        });
    }
    setupLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Setting up language: ${language}`);
            if (language === 'typescript') {
                yield this.setupTypeScript();
            }
        });
    }
    installDependencies(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Installing dependencies (Base Implementation)');
            // Default implementation - should be overridden by specific frameworks
        });
    }
    setupConfig(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up configuration (Base Implementation)');
            // Default implementation - can be overridden by specific frameworks
        });
    }
    postSetup(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Running post-setup tasks (Base Implementation)');
            // Default implementation - can be overridden by specific frameworks
        });
    }
    // Protected helper methods that can be used by subclasses
    setupTailwind() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Tailwind CSS (Base Implementation)');
        });
    }
    setupBootstrap() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Bootstrap (Base Implementation)');
        });
    }
    setupSCSS() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up SCSS (Base Implementation)');
        });
    }
    setupCSS() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up CSS (Base Implementation)');
        });
    }
    setupTypeScript() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up TypeScript (Base Implementation)');
        });
    }
}
exports.BaseFrameworkSetup = BaseFrameworkSetup;
//# sourceMappingURL=cli.js.map