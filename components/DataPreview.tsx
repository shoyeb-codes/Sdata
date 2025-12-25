import React, { useState } from 'react';
import { Dataset } from '../types';

interface DataPreviewProps {
  dataset: Dataset;
}

const DataPreview: React.FC<DataPreviewProps> = ({ dataset }) => {
  const [page, setPage] = useState(0);
  const pageSize = 50;
  
  const totalPages = Math.ceil(dataset.rows.length / pageSize);
  const currentData = dataset.rows.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
        <h3 className="font-semibold text-slate-200">Raw Data Preview</h3>
        <span className="text-sm text-slate-400">
          {dataset.rows.length} rows, {dataset.columns.length} columns
        </span>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 sticky top-0">
            <tr>
              {dataset.columns.map(col => (
                <th key={col} className="px-6 py-3 border-b border-slate-700 font-medium whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {currentData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                {dataset.columns.map(col => (
                  <td key={`${i}-${col}`} className="px-6 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {row[col]?.toString() || <span className="text-slate-600 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-slate-700 bg-slate-800 flex justify-between items-center">
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 disabled:opacity-50 text-xs"
        >
          Previous
        </button>
        <span className="text-xs text-slate-400">
          Page {page + 1} of {totalPages}
        </span>
        <button 
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 disabled:opacity-50 text-xs"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataPreview;
