import { SetupTabProps, UIFramework, CSSFramework, UILibrary, CodeLanguage } from "../types";

const SetupTab = ({
        figmaUrl,
        setFigmaUrl,
        uiFramework,
        setUiFramework,
        cssFramework,
        setCssFramework,
        uiLibrary,
        setUiLibrary,
        language,
        setLanguage,
        isProcessing,
        handleFigmaUrlSubmit,
        needInitialization,
        setNeedInitialization
    }: SetupTabProps) => {
    return (
        <div className="max-w-3xl mx-auto w-full">
        <div className="bg-dark-green rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Setup Figma to Code</h2>
            
            <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium mb-2">Figma Design URL</label>
                <input
                type="text"
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                placeholder="https://www.figma.com/file/..."
                className="w-full bg-dark rounded-lg p-3 border border-gray-700 focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="init-project"
                    checked={needInitialization}
                    onChange={(e) => setNeedInitialization(e.target.checked)}
                    className="accent-primary h-4 w-4 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <label htmlFor="init-project" className="text-sm font-medium text-white">
                    Do you need to initialize the project?
                </label>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                <label className="block text-sm font-medium mb-2">UI Framework</label>
                <select
                    value={uiFramework}
                    onChange={(e) => setUiFramework(e.target.value as UIFramework)}
                    className="w-full bg-dark text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-primary transition-colors"
                >
                    <option value="html">HTML</option>
                    <option value="react">React</option>
                    <option value="react-native">React Native</option>
                    <option value="nextjs">Next.js</option>
                    <option value="svelte">Svelte</option>
                </select>
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-2">CSS Framework</label>
                <select
                    value={cssFramework}
                    onChange={(e) => setCssFramework(e.target.value as CSSFramework)}
                    className="w-full bg-dark text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-primary transition-colors"
                >
                    <option value="tailwindcss">TailwindCSS</option>
                    <option value="bootstrap">Bootstrap</option>
                    <option value="scss">SCSS</option>
                    <option value="css">Plain CSS</option>
                </select>
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-2">UI Library</label>
                <select
                    value={uiLibrary}
                    onChange={(e) => setUiLibrary(e.target.value as UILibrary)}
                    className="w-full bg-dark text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-primary transition-colors"
                >
                    <option value="none">None</option>
                    <option value="mui">Material UI</option>
                    <option value="shadcn">ShadCN</option>
                    <option value="ant-design">Ant Design</option>
                </select>
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
                    className="w-full bg-dark text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-primary transition-colors"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                </select>
                </div>
            </div>
            
            <div className="pt-2">
                <button
                onClick={handleFigmaUrlSubmit}
                disabled={!figmaUrl || isProcessing}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${!figmaUrl || isProcessing ? "bg-gray-700 cursor-not-allowed opacity-70" : "bg-primary text-dark hover:bg-opacity-90"}`}
                >
                {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                    </div>
                ) : "Start Extraction"}
                </button>
            </div>
            </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
            <p className="mb-2">💡 <strong>Pro Tip:</strong> For best results, mark your Figma frames that are ready for development with "Ready for Dev" tag.</p>
            <p>This extension will extract and process all frames marked with this tag automatically.</p>
        </div>
        </div>
    );
};

export default SetupTab;