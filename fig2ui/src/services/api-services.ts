// src/services/api-services.ts
import axios from 'axios';
import { UIFramework, CSSFramework, UILibrary, CodeLanguage } from '../types';

const API_BASE_URL = 'https://your-api-endpoint.com/api/v1';

interface GenerateCodeParams {
url: string;
frameId: string;
prompt: string;
uiFramework: UIFramework;
cssFramework: CSSFramework;
uiLibrary: UILibrary;
language: CodeLanguage;
}

// Generic code generation function
export const generateCode = async ({
url,
frameId,
prompt,
uiFramework,
cssFramework,
uiLibrary,
language
}: GenerateCodeParams): Promise<string> => {
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
    const response = await axios.post(endpoint, {
    url: url,
    frameId: frameId,
    prompt: prompt,
    cssFramework: cssFramework,
    uiLibrary: uiLibrary,
    language: language
    });
    
    // For now, assume the API returns code as 'body' property
    return response.data.body;
} catch (error) {
    console.error('Error generating code:', error);
    throw new Error('Failed to generate code. Please try again.');
}
};

// Specific HTML generation function based on existing API
export const generateHTMLCode = async ({
url,
frameId,
prompt
}: {
url: string;
frameId: string;
prompt: string;
}): Promise<string> => {
try {
    const response = await axios.post(`${API_BASE_URL}/generate-html-code`, {
    url: url,
    frameId: frameId,
    prompt: prompt
    });
    
    return response.data.body;
} catch (error) {
    console.error('Error generating HTML code:', error);
    throw new Error('Failed to generate HTML code. Please try again.');
}
};