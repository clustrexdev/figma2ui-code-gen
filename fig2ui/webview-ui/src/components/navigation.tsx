import React from "react";
import { NavigationProps, TabType } from "../types";

const Navigation: React.FC<NavigationProps> = ({
activeTab,
setActiveTab,
handlePreviousTab,
handleNextTab,
canMoveNext,
extractedFrames,
selectedFrame
}) => {
// Helper to check if a tab should be disabled
const isTabDisabled = (tab: TabType): boolean => {
    switch (tab) {
    case "setup":
        return false;
    case "extract":
        return extractedFrames.length === 0;
    case "preview":
    case "generate":
        return selectedFrame === null;
    case "link":
        return false; // Always accessible once frames are extracted
    default:
        return false;
    }
};

// Helper for active tab styling
const getTabClass = (tab: TabType): string => {
    const baseClass = "px-4 py-2 border-b-2 transition-colors";
    const activeClass = "border-primary text-primary font-medium";
    const inactiveClass = "border-transparent hover:border-gray-500 hover:text-gray-300";
    const disabledClass = "border-transparent text-gray-600 cursor-not-allowed opacity-50";
    
    if (isTabDisabled(tab)) {
    return `${baseClass} ${disabledClass}`;
    }
    
    return `${baseClass} ${activeTab === tab ? activeClass : inactiveClass}`;
};

return (
    <header className="bg-dark-green sticky top-0 z-10 shadow-lg">
    <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
        </div>
        <h1 className="text-xl font-bold">Figma to Code</h1>
        </div>
        
        <div className="flex items-center space-x-2">
        <button
            onClick={handlePreviousTab}
            disabled={activeTab === "setup"}
            className={`px-3 py-1 rounded text-sm ${activeTab === "setup" ? "bg-gray-700 cursor-not-allowed opacity-50" : "bg-primary text-dark hover:bg-opacity-90"}`}
        >
            Previous
        </button>
        <button
            onClick={handleNextTab}
            disabled={!canMoveNext}
            className={`px-3 py-1 rounded text-sm ${!canMoveNext ? "bg-gray-700 cursor-not-allowed opacity-50" : "bg-primary text-dark hover:bg-opacity-90"}`}
        >
            Next
        </button>
        </div>
    </div>
    
    {/* Tab Navigation */}
    <div className="flex overflow-x-auto scrollbar-thin">
        <button
        onClick={() => setActiveTab("setup")}
        className={getTabClass("setup")}
        >
        Setup
        </button>
        <button
        onClick={() => !isTabDisabled("extract") && setActiveTab("extract")}
        className={getTabClass("extract")}
        >
        Extract
        </button>
        <button
        onClick={() => !isTabDisabled("preview") && setActiveTab("preview")}
        className={getTabClass("preview")}
        >
        Preview
        </button>
        <button
        onClick={() => !isTabDisabled("generate") && setActiveTab("generate")}
        className={getTabClass("generate")}
        >
        Generate
        </button>
        <button
        onClick={() => setActiveTab("link")}
        className={getTabClass("link")}
        >
        Flows
        </button>
    </div>
    </header>
);
};

export default Navigation;