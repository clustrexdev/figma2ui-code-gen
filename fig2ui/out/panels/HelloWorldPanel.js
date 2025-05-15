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
const fs = require("fs");
const path = require("path");
const https = require("https");
/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
class HelloWorldPanel {
    /**
     * The HelloWorldPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }
    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    static render(extensionUri) {
        if (HelloWorldPanel.currentPanel) {
            // If the webview panel already exists reveal it
            HelloWorldPanel.currentPanel._panel.reveal(vscode_1.ViewColumn.One);
        }
        else {
            // If a webview panel does not already exist create and show a new one
            const panel = vscode_1.window.createWebviewPanel(
            // Panel view type
            "Fig2UI", 
            // Panel title
            "Fig2UI - Generate Code from Figma", 
            // The editor column the panel should be displayed in
            vscode_1.ViewColumn.One, 
            // Extra panel configurations
            {
                // Enable JavaScript in the webview
                enableScripts: true,
                // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                localResourceRoots: [vscode_1.Uri.joinPath(extensionUri, "out"), vscode_1.Uri.joinPath(extensionUri, "webview-ui/build")],
            });
            HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
        }
    }
    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    dispose() {
        HelloWorldPanel.currentPanel = undefined;
        // Dispose of the current webview panel
        this._panel.dispose();
        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the React webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    _getWebviewContent(webview, extensionUri) {
        // The CSS file from the React build output
        const stylesUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
        // The JS file from the React build output
        const scriptUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);
        const nonce = (0, getNonce_1.getNonce)();
        const connectSrc = [
            'https://kdwi5u76mk.execute-api.ap-south-1.amazonaws.com/v1/extract_assets_from_figma',
            'https://jwyvhgpyn7.execute-api.ap-south-1.amazonaws.com/v1/get_nodes_in_files'
        ].join(' ');
        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
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
    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage((message) => {
            const command = message.command;
            const text = message.text;
            const data = message.data;
            switch (command) {
                case "hello":
                    vscode_1.window.showInformationMessage(text);
                    return;
                case "showError":
                    vscode_1.window.showErrorMessage(text);
                    return;
                case "getWorkspacePath":
                    // Get workspace path and send it back to webview
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
                    // Save assets to the specified path
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
            }
        }, undefined, this._disposables);
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
                        fileName: `${asset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
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