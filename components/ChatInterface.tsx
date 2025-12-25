import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, BarChart2 } from 'lucide-react';
import { Dataset, ChatMessage } from '../types';
import { analyzeData } from '../services/geminiService';
import ChartRenderer from './ChartRenderer';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  dataset: Dataset;
  apiKey: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ dataset, apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I've analyzed **${dataset.name}**. I'm ready to answer your questions or create visualizations. Try asking: "What are the key trends?" or "Plot the distribution of [column]."`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for context
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      
      const response = await analyzeData(dataset, userMessage.content, history, apiKey);
      
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.answer,
        chartConfig: response.chart,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I encountered an error processing your request.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
      <div className="p-4 border-b border-slate-800 bg-slate-900 shadow-md z-10">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          AI Analyst
        </h3>
        <p className="text-xs text-slate-400">Powered by Gemini 3 Pro</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[85%] rounded-2xl p-4
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}
            `}>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              
              {msg.chartConfig && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
                    <BarChart2 size={14} />
                    Generated Visualization
                  </div>
                  <ChartRenderer data={dataset.rows} config={msg.chartConfig} />
                </div>
              )}
              
              <div className="text-[10px] opacity-50 mt-2 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
               <Bot size={16} />
             </div>
             <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 border border-slate-700">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                </div>
                <span className="text-xs text-slate-500 mt-2 block">Analyzing data...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about your data..."
            className="w-full bg-slate-800 text-white rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-slate-700 placeholder-slate-500"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
