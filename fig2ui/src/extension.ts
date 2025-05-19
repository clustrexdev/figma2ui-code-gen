import { commands, ExtensionContext } from "vscode";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";

import {workspace} from 'vscode';

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  console.log("Fig2UI Extension has been started...");

  let folders = workspace.workspaceFolders;
  if (folders) {
      const workspacepath = folders[0].uri.path;
      const workspaceFspath = folders[0].uri.fsPath;

      console.log("Path: ", workspacepath);
      console.log("Fs Path: ", workspaceFspath);
  }
  
  const showHelloWorldCommand = commands.registerCommand("hello-world.showHelloWorld", () => {
    HelloWorldPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
}
