import axios from 'axios';
import { vscode } from '../utilities/vscode';

interface ExtractAssetsProps {
    nodeId : string;
    fileKey : string;
    format : string;
}

export async function ExtractReadyForDevNodes(fileUri : string) {
    try {
        const payload = JSON.stringify({
            "fileUri" : fileUri
        }); 
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://jwyvhgpyn7.execute-api.ap-south-1.amazonaws.com/v1/get_nodes_in_files',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : payload
        };

        const response = await axios.request(config);
        vscode.postMessage({
            command: "showInformation",
            text: "Frames have been successfully retrieved from figma!"
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        const err = error instanceof Error ? error?.message : "Unknwon Error Occurred"
        vscode.postMessage({
            command: "showError",
            text: err
        });
        console.log(err);
    }
};

export async function ExtractAssetsFromNodes(body : ExtractAssetsProps) {
    try {
        const endpoint = "https://kdwi5u76mk.execute-api.ap-south-1.amazonaws.com/v1/extract_assets_from_figma";
        const payload = {
            node_id : body.nodeId,
            file_key : body.fileKey,
            format : body.format
        }

        const response = await axios.post(endpoint, payload);
        return response.data;
    } catch (error) {
        const err = error instanceof Error ? error?.message : "Unknwon Error Occurred"
        vscode.postMessage({
            command: "showError",
            message: err
        });
        throw new Error(err);
    }
}