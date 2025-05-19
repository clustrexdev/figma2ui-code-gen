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
exports.generateHTMLCode = exports.generateCode = void 0;
// src/services/api-services.ts
const axios_1 = require("axios");
const API_BASE_URL = 'https://your-api-endpoint.com/api/v1';
// Generic code generation function
const generateCode = ({ url, frameId, prompt, uiFramework, cssFramework, uiLibrary, language }) => __awaiter(void 0, void 0, void 0, function* () {
    // Select the appropriate API endpoint based on UI framework
    let endpoint = '';
    switch (uiFramework) {
        case 'html':
            endpoint = `${API_BASE_URL}/generate-html-code`;
            break;
        case 'react':
            endpoint = `${API_BASE_URL}/generate-react-code`;
            break;
        case 'react-native':
            endpoint = `${API_BASE_URL}/generate-react-native-code`;
            break;
        case 'nextjs':
            endpoint = `${API_BASE_URL}/generate-nextjs-code`;
            break;
        case 'svelte':
            endpoint = `${API_BASE_URL}/generate-svelte-code`;
            break;
        default:
            endpoint = `${API_BASE_URL}/generate-html-code`;
    }
    try {
        const response = yield axios_1.default.post(endpoint, {
            url: url,
            frameId: frameId,
            prompt: prompt,
            cssFramework: cssFramework,
            uiLibrary: uiLibrary,
            language: language
        });
        // For now, assume the API returns code as 'body' property
        return response.data.body;
    }
    catch (error) {
        console.error('Error generating code:', error);
        throw new Error('Failed to generate code. Please try again.');
    }
});
exports.generateCode = generateCode;
// Specific HTML generation function based on existing API
const generateHTMLCode = ({ url, frameId, prompt }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${API_BASE_URL}/generate-html-code`, {
            url: url,
            frameId: frameId,
            prompt: prompt
        });
        return response.data.body;
    }
    catch (error) {
        console.error('Error generating HTML code:', error);
        throw new Error('Failed to generate HTML code. Please try again.');
    }
});
exports.generateHTMLCode = generateHTMLCode;
//# sourceMappingURL=api-services.js.map