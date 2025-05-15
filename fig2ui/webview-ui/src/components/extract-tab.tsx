import React from "react";
import { ExtractTabProps, Frame } from "../types";

const ExtractTab: React.FC<ExtractTabProps> = ({
extractedFrames,
isProcessing,
handleFrameSelect,
handleFrameDiscard
}) => {
if (isProcessing) {
    return (
    <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Extracting frames from Figma...</p>
        <p className="text-sm text-gray-400 mt-2">This may take a moment depending on the size of your design</p>
    </div>
    );
}

if (extractedFrames.length === 0) {
    return (
    <div className="text-center py-12">
        <div className="inline-block p-4 rounded-full bg-gray-800 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No frames extracted</h3>
        <p className="text-gray-400 max-w-md mx-auto">
        Go back to the Setup tab and enter a valid Figma URL to extract frames
        </p>
    </div>
    );
}

const FrameCard: React.FC<{
    frame: Frame;
    onSelect: (frame: Frame) => void;
    onDiscard: (frameId: string) => void;
}> = ({ frame, onSelect, onDiscard }) => (
    <div className="bg-dark-green rounded-lg overflow-hidden shadow-lg transition-transform hover:translate-y-[-2px]">
    <div className="relative h-48 bg-gray-800">
        <img 
        src={frame.thumbnail} 
        alt={frame.name} 
        className="w-full h-full object-cover p-2" 
        />
    </div>
    <div className="p-4">
        <h3 className="font-bold text-lg mb-3">{frame.name}</h3>
        <div className="flex justify-between gap-2">
        <button
            onClick={() => onSelect(frame)}
            className="flex-1 bg-primary text-dark px-3 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Preview
        </button>
        <button
            onClick={() => onDiscard(frame.id)}
            className="bg-transparent border border-red-500 text-red-500 px-3 py-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        </button>
        </div>
    </div>
    </div>
);

return (
    <div>
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Extracted Frames</h2>
        <span className="bg-primary text-dark text-sm px-2 py-1 rounded-full font-medium">
        {extractedFrames.length} {extractedFrames.length === 1 ? 'Frame' : 'Frames'}
        </span>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {extractedFrames.map((frame) => (
        <FrameCard 
            key={frame.id} 
            frame={frame} 
            onSelect={handleFrameSelect} 
            onDiscard={handleFrameDiscard} 
        />
        ))}
    </div>
    </div>
);
};

export default ExtractTab;