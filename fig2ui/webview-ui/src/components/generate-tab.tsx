import React from 'react';
import { GenerateTabProps } from '../types';

const GenerateTab: React.FC<GenerateTabProps> = ({
selectedFrame,
uiFramework,
cssFramework,
uiLibrary,
language,
prompt,
setPrompt,
fileName,
setFileName,
isProcessing,
handleGenerateCode
}) => {
// Helper function to render the framework icon
const renderFrameworkIcon = (framework: string) => {
    switch (framework) {
    case 'react':
        return '⚛️';
    case 'nextjs':
        return '▲';
    case 'svelte':
        return '🔥';
    case 'react-native':
        return '📱';
    default:
        return '🌐';
    }
};

return (
    <div className="flex flex-col h-full">
    <div className="mb-6">
        <h2 className="text-xl font-bold">Generate Code</h2>
        <p className="text-gray-400 text-sm mt-1">
        Create code from the selected frame with AI assistance
        </p>
    </div>

    {/* Frame summary */}
    <div className="bg-gray-800 p-4 rounded mb-6">
        <div className="flex items-start">
        <img
            src={selectedFrame.thumbnail}
            alt={selectedFrame.name}
            className="w-16 h-16 object-cover rounded"
        />
        <div className="ml-4">
            <h3 className="font-medium">{selectedFrame.name}</h3>
            <p className="text-gray-400 text-sm mt-1">
            Output: {fileName || "unnamed"}.{language === 'typescript' ? 'tsx' : 'jsx'}
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-400 space-x-3">
            <span>{renderFrameworkIcon(uiFramework)} {uiFramework}</span>
            <span>•</span>
            <span>{cssFramework}</span>
            {uiLibrary !== 'none' && (
                <>
                <span>•</span>
                <span>{uiLibrary}</span>
                </>
            )}
            </div>
        </div>
        </div>
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
        <p className="text-gray-400 text-xs mt-1">
        Final path: /components/{fileName || "Component"}.{language === 'typescript' ? 'tsx' : 'jsx'}
        </p>
    </div>

    {/* Prompt textarea */}
    <div className="mb-4 flex-1">
        <label htmlFor="prompt" className="block text-sm font-medium mb-1">
        Prompt
        </label>
        <div className="relative h-full flex flex-col">
        <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe what you want to generate from this frame.\n\nExample: "Create a responsive ${uiFramework} component that matches this login form design. Include form validation for the email field and password requirements."`}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white h-64 resize-none"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {prompt.length} characters
        </div>
        </div>
    </div>

    {/* Prompt suggestions */}
    <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Prompt Suggestions</h4>
        <div className="flex flex-wrap gap-2">
        {[
            "Create a pixel-perfect implementation",
            "Make it responsive",
            "Add form validation",
            "Handle loading states",
            "Add animations"
        ].map((suggestion, index) => (
            <button
            key={index}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm"
            onClick={() => setPrompt(prompt ? `${prompt}\n${suggestion}` : suggestion)}
            >
            {suggestion}
            </button>
        ))}
        </div>
    </div>

    {/* Generate button */}
    <div className="mt-auto">
        <button
        onClick={handleGenerateCode}
        disabled={isProcessing || !prompt || !fileName}
        className={`w-full py-3 rounded font-medium flex items-center justify-center ${
            isProcessing || !prompt || !fileName
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        >
        {isProcessing ? (
            <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
            </>
        ) : 'Generate Code'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
        The generated code will be placed in your project directory
        </p>
    </div>
    </div>
);
};

export default GenerateTab;