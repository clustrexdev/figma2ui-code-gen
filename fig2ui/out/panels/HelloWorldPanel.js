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
exports.HelloWorldPanel = void 0;
const vscode_1 = require("vscode");
const getUri_1 = require("../utilities/getUri");
const getNonce_1 = require("../utilities/getNonce");
const file_system_1 = require("../utilities/file-system");
const api_services_1 = require("../services/api-services");
const fs = require("fs");
const path = require("path");
const https = require("https");
class HelloWorldPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        this._setWebviewMessageListener(this._panel.webview);
    }
    static render(extensionUri) {
        if (HelloWorldPanel.currentPanel) {
            HelloWorldPanel.currentPanel._panel.reveal(vscode_1.ViewColumn.One);
        }
        else {
            const panel = vscode_1.window.createWebviewPanel("Fig2UI", "Fig2UI - Generate Code from Figma", vscode_1.ViewColumn.One, {
                enableScripts: true,
                localResourceRoots: [vscode_1.Uri.joinPath(extensionUri, "out"), vscode_1.Uri.joinPath(extensionUri, "webview-ui/build")],
            });
            HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
        }
    }
    dispose() {
        HelloWorldPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    _getWebviewContent(webview, extensionUri) {
        const stylesUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
        const scriptUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);
        const nonce = (0, getNonce_1.getNonce)();
        const connectSrc = [
            'https://kdwi5u76mk.execute-api.ap-south-1.amazonaws.com/v1/extract_assets_from_figma',
            'https://jwyvhgpyn7.execute-api.ap-south-1.amazonaws.com/v1/get_nodes_in_files',
            'http://127.0.0.1:5000' // Add your API endpoint here
        ].join(' ');
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
          http-equiv="Content-Security-Policy"
          content="
            default-src 'none';
            style-src ${webview.cspSource};
            script-src 'nonce-${nonce}';
            connect-src ${connectSrc};
            img-src ${webview.cspSource} https:;
          "
        />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Fig2UI</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
    }
    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            const command = message.command;
            const text = message.text;
            const placeholderCode = message.placeholderCode;
            const language = message.language;
            const uiFramework = message.uiFramework;
            const fileName = message.fileName;
            const folderName = message.folderName;
            switch (command) {
                case "showInfoMessage":
                    vscode_1.window.showInformationMessage(text);
                    return;
                case "showError":
                    vscode_1.window.showErrorMessage(text);
                    return;
                case "getWorkspacePath":
                    const workspaceFolders = vscode_1.workspace.workspaceFolders;
                    const rootPath = workspaceFolders && workspaceFolders.length > 0
                        ? workspaceFolders[0].uri.fsPath
                        : "";
                    webview.postMessage({
                        command: "workspacePath",
                        path: rootPath
                    });
                    return;
                case "saveAssets":
                    this._saveAssets(webview, message.assets, message.savePath, message.frameId)
                        .then(() => {
                        webview.postMessage({
                            command: "saveResult",
                            success: true
                        });
                    })
                        .catch((error) => {
                        webview.postMessage({
                            command: "saveResult",
                            success: false,
                            error: error.message
                        });
                    });
                    return;
                case "fetchFigmaDesign":
                    // When user submits Figma URL and tech stack choices
                    webview.postMessage({
                        command: "figmaDesignFetched",
                        success: true,
                        message: "Figma design frames extracted successfully"
                    });
                    return;
                case "generateHtml":
                    vscode_1.window.showInformationMessage(text);
                    (0, file_system_1.handleApply)({
                        fileName, folderName, language, placeholderCode, uiFramework
                    });
                    return;
                case "generateCode":
                    // Handle code generation request
                    try {
                        vscode_1.window.showInformationMessage(`Generating code for ${message.frameId} using ${message.settings.uiFramework}...`);
                        // Get workspace path
                        const workspaceFolders = vscode_1.workspace.workspaceFolders;
                        const rootPath = workspaceFolders && workspaceFolders.length > 0
                            ? workspaceFolders[0].uri.fsPath
                            : "";
                        if (!rootPath) {
                            throw new Error("No workspace folder is open. Please open a folder first.");
                        }
                        // Generate code based on the UI framework
                        let generatedCode = '';
                        const { uiFramework, cssFramework, uiLibrary, language } = message.settings;
                        const frameUrl = message.frameUrl || ""; // Frame URL (image URL)
                        const prompt = message.prompt;
                        const fileName = message.fileName;
                        const folderName = message.folderName || null;
                        if (uiFramework === 'html') {
                            // Use the HTML-specific API
                            generatedCode = yield (0, api_services_1.generateHTMLCode)({
                                url: frameUrl,
                                frameId: message.frameId,
                                prompt: prompt
                            });
                        }
                        else {
                            // Use the generic code generation API
                            generatedCode = yield (0, api_services_1.generateCode)({
                                url: frameUrl,
                                frameId: message.frameId,
                                prompt: prompt,
                                uiFramework: uiFramework,
                                cssFramework: cssFramework,
                                uiLibrary: uiLibrary,
                                language: language
                            });
                        }
                        // Add appropriate file extension if not present
                        let finalFileName = fileName;
                        const fileExt = (0, file_system_1.getFileExtension)(uiFramework, language);
                        if (!fileName.endsWith(fileExt)) {
                            finalFileName = `${fileName}${fileExt}`;
                        }
                        // Save the generated code to a file
                        const filePath = yield (0, file_system_1.saveCodeToFile)(generatedCode, finalFileName, folderName, rootPath);
                        // Send success message back to webview
                        webview.postMessage({
                            command: "codeGenerated",
                            success: true,
                            filePath: filePath,
                            message: `Code successfully generated and saved to ${filePath}`
                        });
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : "Unknown error";
                        vscode_1.window.showErrorMessage(`Failed to generate code: ${errorMessage}`);
                        // Send error message back to webview
                        webview.postMessage({
                            command: "codeGenerated",
                            success: false,
                            error: errorMessage
                        });
                    }
                    return;
            }
        }), undefined, this._disposables);
    }
    // Helper method to save assets
    _saveAssets(webview, assets, savePath, frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure directory exists
                if (!fs.existsSync(savePath)) {
                    fs.mkdirSync(savePath, { recursive: true });
                }
                // Save each asset
                const savePromises = assets.map(asset => {
                    return new Promise((resolve, reject) => {
                        // Create a sanitized filename from the asset name
                        const fileName = asset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                        const filePath = path.join(savePath, `${fileName}.png`);
                        // Download the file
                        https.get(asset.url, (response) => {
                            if (response.statusCode !== 200) {
                                reject(new Error(`Failed to download ${asset.name}: ${response.statusCode}`));
                                return;
                            }
                            const fileStream = fs.createWriteStream(filePath);
                            response.pipe(fileStream);
                            fileStream.on('finish', () => {
                                fileStream.close();
                                resolve();
                            });
                            fileStream.on('error', (err) => {
                                fs.unlink(filePath, () => { });
                                reject(err);
                            });
                        }).on('error', (err) => {
                            reject(err);
                        });
                    });
                });
                // Wait for all assets to be saved
                yield Promise.all(savePromises);
                // Create a manifest file with metadata
                const manifest = {
                    frameId: frameId,
                    assets: assets.map(asset => ({
                        id: asset.id,
                        name: asset.name,
                        filePath: path.join(savePath, `${asset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`)
                    })),
                    savedAt: new Date().toISOString()
                };
                fs.writeFileSync(path.join(savePath, 'manifest.json'), JSON.stringify(manifest, null, 2));
                // Show success message
                vscode_1.window.showInformationMessage(`Successfully saved ${assets.length} assets to ${savePath}`);
            }
            catch (error) {
                vscode_1.window.showErrorMessage(`Failed to save assets: ${error instanceof Error ? error.message : "Unknown Error"}`);
                throw error;
            }
        });
    }
}
exports.HelloWorldPanel = HelloWorldPanel;
//# sourceMappingURL=HelloWorldPanel.js.map