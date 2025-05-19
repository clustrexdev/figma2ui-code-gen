"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const HelloWorldPanel_1 = require("./panels/HelloWorldPanel");
const vscode_2 = require("vscode");
function activate(context) {
    // Create the show hello world command
    console.log("Fig2UI Extension has been started...");
    let folders = vscode_2.workspace.workspaceFolders;
    if (folders) {
        const workspacepath = folders[0].uri.path;
        const workspaceFspath = folders[0].uri.fsPath;
        console.log("Path: ", workspacepath);
        console.log("Fs Path: ", workspaceFspath);
    }
    const showHelloWorldCommand = vscode_1.commands.registerCommand("hello-world.showHelloWorld", () => {
        HelloWorldPanel_1.HelloWorldPanel.render(context.extensionUri);
    });
    // Add command to the extension context
    context.subscriptions.push(showHelloWorldCommand);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map