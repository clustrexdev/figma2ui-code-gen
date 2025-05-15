import React, { useState } from 'react';
import { LinkTabProps, Frame, Flow } from '../types';

const LinkTab: React.FC<LinkTabProps> = ({
extractedFrames,
flows,
handleAddFlow,
handleDeleteFlow
}) => {
const [sourceFrame, setSourceFrame] = useState<string>("");
const [targetFrame, setTargetFrame] = useState<string>("");

// Get frame by ID helper
const getFrameById = (id: string): Frame | undefined => {
    return extractedFrames.find(frame => frame.id === id);
};

// Handle flow creation
const createFlow = () => {
    if (sourceFrame && targetFrame && sourceFrame !== targetFrame) {
    handleAddFlow(sourceFrame, targetFrame);
    // Reset selection
    setSourceFrame("");
    setTargetFrame("");
    }
};

return (
    <div className="flex flex-col h-full">
    <div className="mb-6">
        <h2 className="text-xl font-bold">Link Frames</h2>
        <p className="text-gray-400 text-sm mt-1">
        Define navigation flows between your frames to generate connected components
        </p>
    </div>

    {/* Connection Creator */}
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-4">Create Navigation Flow</h3>
        
        <div className="grid grid-cols-7 gap-4 items-center mb-4">
        {/* Source frame selector */}
        <div className="col-span-3">
            <label htmlFor="sourceFrame" className="block text-sm font-medium mb-2">
            From (Source)
            </label>
            <select
            id="sourceFrame"
            value={sourceFrame}
            onChange={(e) => setSourceFrame(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
            <option value="">Select source frame</option>
            {extractedFrames.map((frame) => (
                <option key={`source-${frame.id}`} value={frame.id}>
                {frame.name}
                </option>
            ))}
            </select>
        </div>

        {/* Arrow indicator */}
        <div className="col-span-1 flex justify-center">
            <div className="bg-gray-700 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            </div>
        </div>

        {/* Target frame selector */}
        <div className="col-span-3">
            <label htmlFor="targetFrame" className="block text-sm font-medium mb-2">
            To (Target)
            </label>
            <select
            id="targetFrame"
            value={targetFrame}
            onChange={(e) => setTargetFrame(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
            <option value="">Select target frame</option>
            {extractedFrames.map((frame) => (
                <option 
                key={`target-${frame.id}`} 
                value={frame.id}
                disabled={frame.id === sourceFrame} // Prevent self-linking
                >
                {frame.name}
                </option>
            ))}
            </select>
        </div>
        </div>

        <div className="flex justify-end">
        <button
            onClick={createFlow}
            disabled={!sourceFrame || !targetFrame || sourceFrame === targetFrame}
            className={`px-4 py-2 rounded ${
            !sourceFrame || !targetFrame || sourceFrame === targetFrame
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
            Add Flow
        </button>
        </div>
    </div>

    {/* Flow Visualization */}
    <div className="flex-1 overflow-y-auto">
        <h3 className="font-medium mb-4">Defined Flows</h3>
        
        {flows.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-500">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <p className="text-gray-400">No flows defined yet. Create your first navigation flow above.</p>
        </div>
        ) : (
        <div className="space-y-4">
            {flows.map((flow, index) => {
            const sourceFrame = getFrameById(flow.source);
            const targetFrame = getFrameById(flow.target);
            
            if (!sourceFrame || !targetFrame) return null;
            
            return (
                <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center flex-1">
                    {/* Source frame */}
                    <div className="flex items-center">
                    <img 
                        src={sourceFrame.thumbnail} 
                        alt={sourceFrame.name} 
                        className="w-12 h-12 object-cover rounded"
                    />
                    <span className="ml-2 text-sm">{sourceFrame.name}</span>
                    </div>
                    
                    {/* Arrow */}
                    <div className="mx-4 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    </div>
                    
                    {/* Target frame */}
                    <div className="flex items-center">
                    <img 
                        src={targetFrame.thumbnail} 
                        alt={targetFrame.name} 
                        className="w-12 h-12 object-cover rounded"
                    />
                    <span className="ml-2 text-sm">{targetFrame.name}</span>
                    </div>
                </div>
                
                {/* Delete button */}
                <button 
                    onClick={() => handleDeleteFlow(index)}
                    className="ml-4 p-2 rounded-full hover:bg-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                </div>
            );
            })}
        </div>
        )}
    </div>

    {/* Navigation hints */}
    {flows.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mt-6">
        <h4 className="font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Navigation Code Will Be Generated
        </h4>
        <p className="text-sm text-gray-300">
            Based on your flows, navigation code will be added to your components.
            This includes routes, links, and navigation handlers appropriate for your selected UI framework.
        </p>
        </div>
    )}
    </div>
);
};

export default LinkTab;