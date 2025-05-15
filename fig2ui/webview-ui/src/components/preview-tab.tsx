import React, { useEffect, useState } from 'react';
import { PreviewTabProps, Frame } from '../types';
import { vscode } from '../utilities/vscode';
import { ExtractAssetsFromNodes } from '../api/figma';

const PreviewTab: React.FC<PreviewTabProps> = ({
    selectedFrame,
    fileName,
    setFileName,
    figmaUrl
}) => {
    console.log(selectedFrame);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [savePath, setSavePath] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    function extractFigmaFileKey(url: string): string {
        try {
            const parsedUrl = new URL(url);
            const pathParts = parsedUrl.pathname.split('/');
            const designIndex = pathParts.indexOf('design');
            if (designIndex !== -1 && pathParts.length > designIndex + 1) {
                return pathParts[designIndex + 1];
            }
            return "";
        } catch (error) {
            console.error('Invalid URL:', error);
            return "";
        }
    }

    const [assets, setAssets] = useState<{ id: string, name: string, thumbnail: string }[]>([]);

    useEffect(() => {
        if (selectedFrame.id && figmaUrl) {
            async function fetchAssets() {
                setIsLoading(true);
                try {
                    const payload = {
                        nodeId: selectedFrame.id,
                        fileKey: extractFigmaFileKey(figmaUrl),
                        format: "png"
                    };
                    
                    const response = await ExtractAssetsFromNodes(payload);
                    console.log(response);
                    
                    setAssets(response.result?.map((item: {
                        imageRef: string;
                        imageUrl: string;
                    }) => ({
                        id: item.imageRef, 
                        name: item.imageRef, 
                        thumbnail: item.imageUrl
                    })) || []);
                    
                } catch (error) {
                    vscode.postMessage({
                        command: "showError",
                        text: error instanceof Error ? error.message : "Unknown Error Occurred"
                    });
                } finally {
                    setIsLoading(false);
                }
            }
            
            fetchAssets();
        }
    }, [selectedFrame.id, figmaUrl]);

    // State to track selected asset for preview
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

    // Get workspace root path when component mounts
    useEffect(() => {
        vscode.postMessage({
            command: "getWorkspacePath"
        });

        // Event listener for receiving the workspace path from VSCode
        const messageHandler = (event : any) => {
            const message = event.data;
            if (message.command === "workspacePath") {
                setSavePath(message.path);
            }
            if (message.command === "saveResult") {
                setIsSaving(false);
                if (message.success) {
                    setSaveMessage({ type: 'success', text: "Assets saved successfully!" });
                    setTimeout(() => setSaveMessage(null), 3000);
                } else {
                    setSaveMessage({ type: 'error', text: message.error || "Failed to save assets" });
                }
            }
        };

        window.addEventListener('message', messageHandler);
        return () => window.removeEventListener('message', messageHandler);
    }, []);

    // Calculate final save path
    const finalSavePath = `${savePath}/assets/${fileName || "unnamed"}`;

    // Handle save button click
    const handleSave = () => {
        if (!fileName.trim()) {
            setSaveMessage({ type: 'error', text: "Please enter a file name" });
            return;
        }

        setIsSaving(true);
        setSaveMessage(null);

        // Send message to VSCode extension to save the assets
        vscode.postMessage({
            command: "saveAssets",
            assets: assets.map(asset => ({
                id: asset.id,
                name: asset.name,
                url: asset.thumbnail
            })),
            savePath: finalSavePath,
            frameId: selectedFrame.id
        });
    };

    return (
        <div className="flex h-full">
            {/* Sidebar with assets */}
            <div className="w-64 border-r border-gray-700 pr-4 flex flex-col gap-5 overflow-y-auto h-screen">
                <main>
                    <h3 className="text-lg font-semibold mb-4">Frame</h3>
                    
                    <div className="space-y-4">
                        <div 
                            key={selectedFrame.id}
                            className={`p-2 border rounded cursor-pointer ${
                                selectedAsset === selectedFrame.id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:bg-gray-800'
                            }`}
                            onClick={() => setSelectedAsset(selectedFrame.id)}
                        >
                            <div className="flex items-center">
                                <img 
                                    src={selectedFrame.thumbnail} 
                                    alt={selectedFrame.name} 
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <span className="ml-2 text-sm">{selectedFrame.name}</span>
                            </div>
                        </div>
                    </div>
                </main>
                <main>
                    <h3 className="text-lg font-semibold mb-4">Frame Assets</h3>
                    
                    {(!isLoading && assets.length > 0) && (
                        <div className="space-y-4">
                            {assets.map((asset) => (
                                <div 
                                    key={asset.id}
                                    className={`p-2 border rounded cursor-pointer ${
                                        selectedAsset === asset.id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:bg-gray-800'
                                    }`}
                                    onClick={() => setSelectedAsset(asset.id)}
                                >
                                    <div className="flex items-center">
                                        <img 
                                            src={asset.thumbnail} 
                                            alt={asset.name} 
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                        <span className="ml-2 text-sm">{asset.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {isLoading && (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="p-2 border rounded cursor-pointer">
                                    <div className="flex items-center w-full">
                                        <div className="w-10 h-10 object-cover bg-dark-green rounded" />
                                        <span className="ml-2 text-sm w-1/2 h-10 bg-dark-green" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Main preview area */}
            <div className="flex-1 pl-4 overflow-y-auto">
                <div className="flex flex-col h-full">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">{selectedFrame.name}</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Preview the frame and configure the output options
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
                        <p className="text-gray-400 text-xs mt-1">
                            Assets will be saved to /assets/{fileName}/
                        </p>
                    </div>

                    {/* Frame preview */}
                    <div className="flex-1 bg-gray-800 rounded-lg p-4 flex items-center justify-center mb-4">
                        {selectedAsset ? (
                            <div className="text-center">
                                <img
                                    src={assets.find(a => a.id === selectedAsset)?.thumbnail || ""}
                                    alt="Selected asset"
                                    className="mx-auto mb-2"
                                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                                />
                                <p className="text-sm text-gray-400">
                                    {assets.find(a => a.id === selectedAsset)?.name}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <img
                                    src={selectedFrame.thumbnail}
                                    alt={selectedFrame.name}
                                    className="mx-auto mb-2"
                                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                                />
                                <p className="text-sm text-gray-400">
                                    {selectedFrame.name} - Frame Preview
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Information panel */}
                    <div className="bg-gray-800 p-4 rounded mb-4">
                        <h3 className="font-medium mb-2">Frame Information</h3>
                        <div className="text-sm text-gray-400">
                            <p><span className="font-medium text-gray-300">ID:</span> {selectedFrame.id}</p>
                            <p><span className="font-medium text-gray-300">Assets:</span> {assets.length} files</p>
                            <p><span className="font-medium text-gray-300">Save Path:</span> {finalSavePath}</p>
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="mb-4">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving || assets.length === 0}
                            className={`w-full py-2 px-4 rounded font-medium flex items-center justify-center ${
                                isSaving || assets.length === 0 
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>Save Assets</>
                            )}
                        </button>
                        
                        {/* Save message */}
                        {saveMessage && (
                            <div className={`mt-2 p-2 rounded text-sm ${
                                saveMessage.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                            }`}>
                                {saveMessage.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewTab;