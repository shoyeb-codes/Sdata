import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Database, KeyRound, Settings } from 'lucide-react';
import FileUpload from './components/FileUpload';
import StatsCards from './components/StatsCards';
import ChatInterface from './components/ChatInterface';
import DataPreview from './components/DataPreview';
import ApiKeyModal from './components/ApiKeyModal';
import { Dataset } from './types';

function App() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'data'>('overview');
  
  // Try to get key from env, then localStorage, or empty
  const [apiKey, setApiKey] = useState<string>(() => {
    return process.env.API_KEY || localStorage.getItem('gemini_api_key') || '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    // Only force show modal if NO key is present at all
    if (!apiKey) {
      setShowKeyModal(true);
    }
  }, [apiKey]);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowKeyModal(false);
  };

  const handleOpenKeyModal = () => {
    setShowKeyModal(true);
  };
  
  const handleCloseKeyModal = () => {
    // Only allow closing if we already have a key
    if (apiKey) {
      setShowKeyModal(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to upload a new dataset? Current progress will be lost.")) {
      setDataset(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row overflow-hidden relative">
      {/* API Key Modal Overlay */}
      {showKeyModal && (
        <ApiKeyModal 
          onSave={handleSaveKey} 
          onClose={handleCloseKeyModal}
          canClose={!!apiKey}
          currentKey={apiKey}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col h-screen overflow-hidden transition-opacity duration-200 ${showKeyModal ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100'}`}>
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
               <LayoutDashboard className="w-5 h-5 text-white" />
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hidden sm:block">
               Smart Data Analyst
             </h1>
             <h1 className="text-xl font-bold text-blue-400 sm:hidden">
               SDA
             </h1>
          </div>
          
          <div className="flex items-center gap-3">
             {dataset && (
                 <button 
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-red-500/20 hover:border-red-500/50 border border-slate-700 rounded-md transition-all mr-2"
                >
                  <Database className="w-3 h-3 inline mr-1.5" />
                  New Dataset
                </button>
             )}
             
             {/* API Key Settings Button */}
             <button 
                onClick={handleOpenKeyModal}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  apiKey 
                  ? 'text-slate-300 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white' 
                  : 'text-amber-300 bg-amber-500/10 border-amber-500/50 hover:bg-amber-500/20'
                }`}
                title="Manage API Key"
             >
                <KeyRound size={14} />
                <span className="hidden sm:inline">{apiKey ? 'API Key Configured' : 'Set API Key'}</span>
             </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden relative">
          {!dataset ? (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-950">
              <div className="max-w-xl w-full animate-fade-in-up">
                <FileUpload 
                  onDataLoaded={setDataset} 
                  isLoading={isLoading} 
                  setLoading={setIsLoading} 
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col md:flex-row">
              {/* Left Panel: Dashboard / Data */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {/* Tabs */}
                <div className="flex gap-6 mb-6 border-b border-slate-800">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 px-2 text-sm font-medium transition-all border-b-2 ${
                      activeTab === 'overview' 
                      ? 'border-blue-500 text-blue-400' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('data')}
                    className={`pb-3 px-2 text-sm font-medium transition-all border-b-2 ${
                      activeTab === 'data' 
                      ? 'border-blue-500 text-blue-400' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Raw Data
                  </button>
                </div>

                {activeTab === 'overview' ? (
                  <div className="space-y-6 animate-fade-in">
                    <section>
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        Data Overview
                      </h2>
                      <StatsCards stats={dataset.stats} />
                    </section>
                    
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                      <div className="inline-block p-3 bg-slate-800 rounded-full mb-3">
                         <ChatInterfaceIcon />
                      </div>
                      <h3 className="text-slate-200 font-medium mb-2">Detailed Analysis</h3>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        Your data is ready. Use the AI Analyst panel on the right (or below on mobile) to generate insights and charts.
                      </p>
                    </div>
                  </div>
                ) : (
                  <DataPreview dataset={dataset} />
                )}
              </div>

              {/* Right Panel: Chat Interface */}
              <div className="w-full md:w-[450px] lg:w-[500px] h-[600px] md:h-full flex-shrink-0 shadow-2xl border-l border-slate-800 z-10 bg-slate-900">
                <ChatInterface dataset={dataset} apiKey={apiKey} key={dataset.name} /> 
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Simple icon component for the placeholder
const ChatInterfaceIcon = () => (
  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

export default App;
