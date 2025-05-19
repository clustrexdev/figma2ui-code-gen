import { useState, useEffect } from 'react';
import { Clipboard, Check, X, Download } from 'lucide-react';
import { GenerateTabProps } from '../types';
import { GenerateHtmlCode } from '../api/genegrator';
import { vscode } from '../utilities/vscode';

export default function GenerateTab({
    cssFramework, fileName, folderName, handleGenerateCode, isProcessing, language, prompt, selectedFrame, setFileName, setFolderName, setPrompt, uiFramework, uiLibrary
} : GenerateTabProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const [placeholderCode, setplaceholderCode] = useState<string | null>(null);

    const generateCode = async () => {
        try {
            setIsLoading(true);
            const response = await GenerateHtmlCode({
                url : selectedFrame.thumbnail, cssFramework : cssFramework, fileName : fileName, folderName : folderName, language : language, prompt : prompt
            });

            console.log("Html Code: ", response);
            
            const htmlCode = JSON.parse(response?.body);
            setplaceholderCode(htmlCode);
        } catch (error) {
            return;
        } finally {
            setIsLoading(false);
        }
    }

    // Handle copy to clipboard
    const handleCopy = () => {
        if (placeholderCode) {
            navigator.clipboard.writeText(placeholderCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Handle apply code action
    const handleApply = () => {
        console.log('Applying code:', placeholderCode);
        // In a real app, this would apply the generated code to your project
        vscode.postMessage({
            command : "generateHtml",
            text : "Html has been generated successfully",
            fileName, folderName, language, placeholderCode, uiFramework
        });
    };

    // Handle discard code action
    const handleDiscard = () => {
        console.log('Discarding code');
        // In a real app, this would discard the generated code
    };

return (
    <div className="flex flex-col lg:flex-row h-screen bg-dark text-white">
    {/* Left Column - Controls */}
    <div className="lg:w-1/2 p-6 overflow-y-auto border-r border-gray-700">
        <div className="mb-6">
        <h2 className="text-xl font-bold">Generate Code</h2>
        <p className="text-gray-400 text-sm mt-1">
            Create code from the selected frame with AI assistance
        </p>
        </div>

        {/* Frame summary */}
        <div className="bg-dark-green p-4 rounded mb-6">
        <div className="flex items-start">
            <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
            <img src={selectedFrame.thumbnail} alt={selectedFrame.name} className='h-full object-cover w-full' />
            </div>
            <div className="ml-4">
            <h3 className="font-medium">Login Form</h3>
            <p className="text-gray-400 text-sm mt-1">
                Output: {fileName}
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-400 space-x-3">
                <span>⚛️ {uiFramework}</span>
                <span>•</span>
                <span>{cssFramework}</span>
            </div>
            </div>
        </div>
        </div>

        {/* Folder name input */}
        <div className="mb-4">
        <label htmlFor="folderName" className="block text-sm font-medium mb-1">
            Folder Name
        </label>
        <input
            id="folderName"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name (optional)"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        />
        <p className="text-gray-400 text-xs mt-1">
            Final path: {folderName ? `/${folderName}/` : '/'}{fileName}
        </p>
        </div>

        {/* File name input */}
        <div className="mb-4">
        <label htmlFor="fileName" className="block text-sm font-medium mb-1">
            File Name
        </label>
        <input
            id="fileName"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        />
        </div>

        {/* Prompt textarea */}
        <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Prompt
        </label>
        <div className="relative">
            <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Create a responsive React component that matches this login form design. Include form validation for the email field and password requirements."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white h-40 resize-none"
            />
        </div>
        </div>

        {/* Generate button */}
        <div className="mt-6">
        <button
            onClick={generateCode}
            className="w-full py-3 rounded font-medium flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
        >
            Generate Code
        </button>
        </div>
    </div>

    {/* Right Column - Code Display */}
    <div className="lg:w-1/2 p-6 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-xl font-bold">Generated Code</h2>
            <p className="text-gray-400 text-sm">{fileName}</p>
        </div>
        <div className="flex space-x-2">
            <button 
            onClick={handleCopy}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded"
            title="Copy code"
            >
            {copied ? <Check size={18} /> : <Clipboard size={18} />}
            </button>
            <button 
            onClick={handleApply}
            className="p-2 bg-green-700 hover:bg-green-600 rounded"
            title="Apply code"
            >
            <Download size={18} />
            </button>
            <button 
            onClick={handleDiscard}
            className="p-2 bg-red-700 hover:bg-red-600 rounded"
            title="Discard code"
            >
            <X size={18} />
            </button>
        </div>
        </div>

        {/* Code display area with syntax highlighting */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden flex flex-col">
        {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Generating code...</p>
            </div>
            </div>
        ) : (
            <div className="flex-1 overflow-auto">
            <pre className="p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
                {placeholderCode}
            </pre>
            </div>
        )}
        </div>
    </div>
    </div>
);
}