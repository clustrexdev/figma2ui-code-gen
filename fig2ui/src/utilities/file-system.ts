// src/utilities/file-system.ts
import * as fs from 'fs';
import * as path from 'path';
import { window, workspace } from 'vscode';

/**
 * Saves generated code to a file
 * @param code The code content to save
 * @param fileName The name of the file
 * @param folderPath Optional folder path where the file should be saved
 * @param workspacePath The root workspace path
 * @returns Promise that resolves with the full path of the saved file
 */
export const saveCodeToFile = async (
    code: string,
    fileName: string,
    folderName: string | null,
    rootPath: string
    ) : Promise<string> => {   

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
    } catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
};

export const handleApply = async ({placeholderCode, language , uiFramework, fileName, folderName} : {
    placeholderCode : string, language : string, uiFramework : string, fileName : string, folderName : string
}) => {
    if (!placeholderCode) {
        console.error('No code to apply');
        return;
    }
    
    try {
        // Get workspace path (root directory)
        const workspaceFolders = workspace.workspaceFolders;
        const rootPath = workspaceFolders && workspaceFolders.length > 0 
            ? workspaceFolders[0].uri.fsPath 
            : "";
            
        if (!rootPath) {
            throw new Error("No workspace folder is open. Please open a folder first.");
        }
        
        // Determine file extension based on language/framework
        const fileExt = getFileExtension(language, uiFramework);
        
        // Add appropriate file extension if not present
        let finalFileName = fileName;
        if (!finalFileName.endsWith(fileExt)) {
            finalFileName = `${finalFileName}${fileExt}`;
        }
        
        // Save the generated code to the file
        const filePath = await saveCodeToFile(
            placeholderCode,
            finalFileName,
            folderName,
            rootPath
        );
        
        // Notify user of success
        console.log(`Code successfully saved to ${filePath}`);
        } catch (error) {
        console.error('Failed to apply code:', error instanceof Error ? error.message : "Unknown error");
        }
};

  // Add this utility function if it doesn't exist in your file-system.ts
  // This should be placed in the file-system.ts file
export const getFileExtension = (language: string, framework: string): string => {
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