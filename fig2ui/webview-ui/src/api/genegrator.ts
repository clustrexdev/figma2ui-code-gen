import axios from "axios";
import { vscode } from "../utilities/vscode";

interface GenerateHtmlCodeProps {
    url : string;
    cssFramework : string;
    language : string;
    prompt : string;
    fileName : string;
    folderName : string;
}

export async function GenerateHtmlCode(body : GenerateHtmlCodeProps) {
    try {
        const endpoint = "http://127.0.0.1:5000/api/v1/generate-html-code";
        const response = await axios.post(endpoint, body);

        vscode.postMessage({
            command : "showInformation",
            text : "code has been generated for the selected frame"            
        });
        console.log("Response: ", response.data);
        return response.data;
    } catch (error) {
        const err = error instanceof Error ? error.message : "Unknown Error Occurred";
        vscode.postMessage({
            command : "showError",
            text : err
        });
        console.log(err);
    }
}