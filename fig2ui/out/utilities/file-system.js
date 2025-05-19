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
exports.getFileExtension = exports.handleApply = exports.saveCodeToFile = void 0;
// src/utilities/file-system.ts
const fs = require("fs");
const path = require("path");
const vscode_1 = require("vscode");
/**
 * Saves generated code to a file
 * @param code The code content to save
 * @param fileName The name of the file
 * @param folderPath Optional folder path where the file should be saved
 * @param workspacePath The root workspace path
 * @returns Promise that resolves with the full path of the saved file
 */
const saveCodeToFile = (code, fileName, folderName, rootPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Determine the final path where the file will be saved
        let savePath = rootPath;
        // Add subfolder if specified
        if (folderName) {
            savePath = path.join(savePath, folderName);
            // Create the directory if it doesn't exist
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath, { recursive: true });
            }
        }
        // Full path including filename
        const filePath = path.join(savePath, fileName);
        // Write the code to the file
        fs.writeFileSync(filePath, code, 'utf8');
        return filePath;
    }
    catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
});
exports.saveCodeToFile = saveCodeToFile;
const handleApply = ({ placeholderCode, language, uiFramework, fileName, folderName }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!placeholderCode) {
        console.error('No code to apply');
        return;
    }
    try {
        // Get workspace path (root directory)
        const workspaceFolders = vscode_1.workspace.workspaceFolders;
        const rootPath = workspaceFolders && workspaceFolders.length > 0
            ? workspaceFolders[0].uri.fsPath
            : "";
        if (!rootPath) {
            throw new Error("No workspace folder is open. Please open a folder first.");
        }
        // Determine file extension based on language/framework
        const fileExt = (0, exports.getFileExtension)(language, uiFramework);
        // Add appropriate file extension if not present
        let finalFileName = fileName;
        if (!finalFileName.endsWith(fileExt)) {
            finalFileName = `${finalFileName}${fileExt}`;
        }
        // Save the generated code to the file
        const filePath = yield (0, exports.saveCodeToFile)(placeholderCode, finalFileName, folderName, rootPath);
        // Notify user of success
        console.log(`Code successfully saved to ${filePath}`);
    }
    catch (error) {
        console.error('Failed to apply code:', error instanceof Error ? error.message : "Unknown error");
    }
});
exports.handleApply = handleApply;
// Add this utility function if it doesn't exist in your file-system.ts
// This should be placed in the file-system.ts file
const getFileExtension = (language, framework) => {
    // Determine file extension based on language and framework
    // if (language === 'typescript') {
    //     if (framework === 'react' || framework === 'nextjs') {
    //     return '.tsx';
    //     }
    //     return '.ts';
    // } else if (language === 'javascript') {
    //     if (framework === 'react' || framework === 'nextjs') {
    //     return '.jsx';
    //     }
    //     return '.js';
    // } else if (framework === 'vue') {
    //     return '.vue';
    // } else if (framework === 'angular') {
    //     return language === 'typescript' ? '.component.ts' : '.component.js';
    // }
    // Default to HTML for basic websites
    return '.html';
};
exports.getFileExtension = getFileExtension;
//# sourceMappingURL=file-system.js.map