import React, { useCallback, useRef } from 'react';
import { Upload, FileType } from 'lucide-react';
import { parseCSV } from '../utils/dataUtils';
import { Dataset } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: Dataset) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, isLoading, setLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const dataset = await parseCSV(file);
      onDataLoaded(dataset);
    } catch (error) {
      console.error("Failed to parse file", error);
      alert("Error parsing CSV file. Please check the format.");
    } finally {
      setLoading(false);
      // Reset input value to allow uploading the same file again if needed
      if (event.target) {
        event.target.value = '';
      }
    }
  }, [onDataLoaded, setLoading]);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all p-10 text-center">
      <div className="bg-blue-600/20 p-6 rounded-full mb-6">
        <Upload className="w-12 h-12 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Upload your Dataset</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        Drag and drop your CSV file here, or click to browse. 
        We'll profile your data automatically.
      </p>
      
      <button 
        onClick={handleButtonClick}
        disabled={isLoading}
        className="relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center">
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <>
            <FileType className="w-5 h-5 mr-2" />
            <span>Select CSV File</span>
          </>
        )}
      </button>
      
      <input 
        ref={inputRef}
        type="file" 
        accept=".csv" 
        onChange={handleFileChange} 
        className="hidden" 
        disabled={isLoading}
      />
      <p className="mt-4 text-sm text-slate-500">Supported format: .csv</p>
    </div>
  );
};

export default FileUpload;
