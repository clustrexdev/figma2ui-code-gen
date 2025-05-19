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
exports.ReactSetup = void 0;
const cli_1 = require("../cli");
class ReactSetup extends cli_1.BaseFrameworkSetup {
    createProjectStructure(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating React project structure');
            // Project structure creation logic specific to React
        });
    }
    installDependencies(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Installing React dependencies');
            // Base dependencies
            const dependencies = ['react', 'react-dom'];
            // Add CSS framework dependencies
            if (options.cssFramework === 'tailwindcss') {
                dependencies.push('tailwindcss', 'autoprefixer', 'postcss');
            }
            else if (options.cssFramework === 'bootstrap') {
                dependencies.push('bootstrap', 'react-bootstrap');
            }
            // Add UI library dependencies
            if (options.uiLibrary === 'mui') {
                dependencies.push('@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled');
            }
            else if (options.uiLibrary === 'ant-design') {
                dependencies.push('antd');
            }
            // Add TypeScript dependencies if needed
            if (options.language === 'typescript') {
                dependencies.push('@types/react', '@types/react-dom');
            }
            console.log('Dependencies to install:', dependencies.join(', '));
            // Logic to install dependencies
        });
    }
    // Protected helper methods specific to React setup
    setupTailwind() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Tailwind CSS for React');
            // React-specific Tailwind setup
        });
    }
    setupMUI() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Material UI for React');
            // React-specific MUI setup
        });
    }
    setupTypeScript() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up TypeScript for React');
            // React-specific TypeScript setup
        });
    }
}
exports.ReactSetup = ReactSetup;
//# sourceMappingURL=react-setup.js.map