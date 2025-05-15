import { vscode } from "./utilities/vscode";
import { useState } from "react";
import "./App.css";

// Types
import { Frame, UIFramework, CSSFramework, UILibrary, CodeLanguage, Flow } from "./types";
import Navigation from "./components/navigation";
import SetupTab from "./components/setup-tab";
import ExtractTab from "./components/extract-tab";
import PreviewTab from "./components/preview-tab";
import GenerateTab from "./components/generate-tab";
import LinkTab from "./components/links-tab";
import { ExtractReadyForDevNodes } from "./api/figma";

const App: React.FC = () => {
  // State management
  console.log("App component mounted");
  const [activeTab, setActiveTab] = useState<"setup" | "extract" | "preview" | "generate" | "link">("setup");
  const [figmaUrl, setFigmaUrl] = useState<string>("");
  const [uiFramework, setUiFramework] = useState<UIFramework>("react");
  const [cssFramework, setCssFramework] = useState<CSSFramework>("tailwindcss");
  const [uiLibrary, setUiLibrary] = useState<UILibrary>("none");
  const [language, setLanguage] = useState<CodeLanguage>("javascript");
  const [needInitialization, setNeedInitialization] = useState<boolean>(false);
  const [extractedFrames, setExtractedFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [flows, setFlows] = useState<Flow[]>([]);
  
  // Handle Figma URL submission
  const handleFigmaUrlSubmit = async () => {
    if (!figmaUrl) return;

    vscode.postMessage({
      command : "showInfoMessage",
      text : "Starting to extract the frames..."
    })
    
    setIsProcessing(true);

    const response = await ExtractReadyForDevNodes(figmaUrl);
    console.log(response);

    if (response?.frames) {
      // Mock data for demo purposes
      setExtractedFrames(
        response?.frames?.map((frame : {
          id : string;
          image : string;
        }) => ({
          id: frame.id,
          name: frame.id,
          thumbnail: frame.image
        })) || []
      );      
      
      setIsProcessing(false);
      setActiveTab("extract");
      
      // Send message to VSCode extension
      vscode.postMessage({
        command: "fetchFigmaDesign",
        url: figmaUrl,
        settings: { uiFramework, cssFramework, uiLibrary, language }
      });
    }
  };
  
  // Handle frame selection
  const handleFrameSelect = (frame: Frame) => {
    setSelectedFrame(frame);
    setActiveTab("preview");
  };
  
  // Handle frame discard
  const handleFrameDiscard = (frameId: string) => {
    setExtractedFrames(extractedFrames.filter(frame => frame.id !== frameId));
  };
  
  // Handle code generation
  const handleGenerateCode = () => {
    if (!selectedFrame || !prompt || !fileName) return;
    
    setIsProcessing(true);
    
    // In a real implementation, this would call your API
    setTimeout(() => {
      // Send message to VSCode extension
      vscode.postMessage({
        command: "generateCode",
        frameId: selectedFrame.id,
        prompt: prompt,
        fileName: fileName,
        settings: { uiFramework, cssFramework, uiLibrary, language }
      });
      
      setIsProcessing(false);
      setActiveTab("link");
    }, 2000);
  };
  
  // Handle flow creation
  const handleAddFlow = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return; // Prevent self-referential flows
    
    setFlows([...flows, { source: sourceId, target: targetId }]);
    
    // Send message to VSCode extension
    vscode.postMessage({
      command: "createFlow",
      source: sourceId,
      target: targetId
    });
  };
  
  // Handle flow deletion
  const handleDeleteFlow = (index: number) => {
    const newFlows = [...flows];
    newFlows.splice(index, 1);
    setFlows(newFlows);
  };
  
  // Helper function to move to the next tab
  const handleNextTab = () => {
    const tabs = ["setup", "extract", "preview", "generate", "link"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1] as typeof activeTab);
    }
  };
  
  // Helper function to move to the previous tab
  const handlePreviousTab = () => {
    const tabs = ["setup", "extract", "preview", "generate", "link"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1] as typeof activeTab);
    }
  };

  // Check if we can move to the next tab
  const canMoveNext = (): boolean => {
    if (activeTab === "setup") return !!figmaUrl;
    if (activeTab === "extract") return extractedFrames.length > 0;
    if (activeTab === "preview") return !!selectedFrame;
    if (activeTab === "generate") return !!selectedFrame && !!prompt && !!fileName;
    return false; // For "link" tab, we're already at the end
  };

  return (
    <div className="bg-dark text-white w-full flex flex-col h-screen">
      {/* Header with Navigation */}
      <Navigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handlePreviousTab={handlePreviousTab}
        handleNextTab={handleNextTab}
        canMoveNext={canMoveNext()}
        extractedFrames={extractedFrames}
        selectedFrame={selectedFrame}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "setup" && (
          <SetupTab 
            figmaUrl={figmaUrl}
            setFigmaUrl={setFigmaUrl}
            uiFramework={uiFramework}
            setUiFramework={setUiFramework}
            cssFramework={cssFramework}
            setCssFramework={setCssFramework}
            uiLibrary={uiLibrary}
            setUiLibrary={setUiLibrary}
            language={language}
            setLanguage={setLanguage}
            isProcessing={isProcessing}
            handleFigmaUrlSubmit={handleFigmaUrlSubmit}
            needInitialization={needInitialization}
            setNeedInitialization={setNeedInitialization}
          />
        )}
        
        {activeTab === "extract" && (
          <ExtractTab 
            extractedFrames={extractedFrames}
            isProcessing={isProcessing}
            handleFrameSelect={handleFrameSelect}
            handleFrameDiscard={handleFrameDiscard}
          />
        )}
        
        {activeTab === "preview" && selectedFrame && (
          <PreviewTab 
            selectedFrame={selectedFrame}
            fileName={fileName}
            setFileName={setFileName}
            figmaUrl={figmaUrl}
          />
        )}
        
        {activeTab === "generate" && selectedFrame && (
          <GenerateTab
            selectedFrame={selectedFrame}
            uiFramework={uiFramework}
            cssFramework={cssFramework}
            uiLibrary={uiLibrary}
            language={language}
            prompt={prompt}
            setPrompt={setPrompt}
            fileName={fileName}
            setFileName={setFileName}
            isProcessing={isProcessing}
            handleGenerateCode={handleGenerateCode}
          />
        )}
        
        {activeTab === "link" && (
          <LinkTab 
            extractedFrames={extractedFrames}
            flows={flows}
            handleAddFlow={handleAddFlow}
            handleDeleteFlow={handleDeleteFlow}
          />
        )}
      </div>
    </div>
  );
}

export default App;