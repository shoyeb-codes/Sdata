import React, { useState } from 'react';
import { Key, Lock, X } from 'lucide-react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  onClose: () => void;
  canClose: boolean;
  currentKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, onClose, canClose, currentKey }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        {canClose && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-full mx-auto mb-4">
          <Key className="w-6 h-6 text-blue-400" />
        </div>
        
        <h2 className="text-xl font-bold text-white text-center mb-2">
          {currentKey ? 'Update API Key' : 'API Key Required'}
        </h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          {currentKey 
            ? 'Enter a new API Key to replace the current one.' 
            : 'To use the Smart AI Analyst features, please enter your Google Gemini API key.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your Gemini API Key"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentKey ? 'Update Key' : 'Start Analyzing'}
          </button>
        </form>
        
        <p className="mt-4 text-xs text-center text-slate-500">
          Your key is stored locally in your browser.
          <br/>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline mt-1 inline-block">Get API Key from Google AI Studio</a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;
