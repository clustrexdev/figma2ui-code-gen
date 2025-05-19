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
exports.ReactNativeSetup = void 0;
const cli_1 = require("../cli");
class ReactNativeSetup extends cli_1.BaseFrameworkSetup {
    createProjectStructure(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating React Native project structure');
            // Project structure creation logic specific to React Native
        });
    }
    setupStyles(cssFramework) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up styling for React Native');
            // React Native uses its own styling system, not traditional CSS frameworks
        });
    }
    setupUILibrary(uiLibrary) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Setting up UI library for React Native: ${uiLibrary}`);
            switch (uiLibrary) {
                case 'ant-design':
                    yield this.setupAntDesignRN();
                    break;
                case 'none':
                    // Use React Native's built-in components
                    break;
                default:
                    console.log(`UI library ${uiLibrary} is not supported for React Native, using default components`);
                    break;
            }
        });
    }
    installDependencies(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Installing React Native dependencies');
            // Base dependencies
            const dependencies = ['react', 'react-native'];
            // Add React Native specific dependencies
            dependencies.push('react-native-safe-area-context', '@react-navigation/native', 'react-native-screens', 'react-native-gesture-handler');
            // Add UI library dependencies
            if (options.uiLibrary === 'ant-design') {
                dependencies.push('@ant-design/react-native');
            }
            // TypeScript setup for React Native
            if (options.language === 'typescript') {
                dependencies.push('@types/react', '@types/react-native', '@tsconfig/react-native');
            }
            console.log('Dependencies to install:', dependencies.join(', '));
            // Logic to install dependencies
        });
    }
    // Protected helper methods specific to React Native setup
    setupAntDesignRN() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Setting up Ant Design Mobile for React Native');
            // React Native-specific Ant Design setup
        });
    }
}
exports.ReactNativeSetup = ReactNativeSetup;
//# sourceMappingURL=react-native-setup.js.map