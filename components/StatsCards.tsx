import React from 'react';
import { ColumnStats } from '../types';
import { formatNumber } from '../utils/dataUtils';
import { Hash, Type, AlignJustify, Calendar, AlertCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: ColumnStats[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-sm hover:border-slate-600 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-slate-200 truncate pr-2" title={stat.name}>{stat.name}</h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-400 uppercase">
              {stat.type}
            </span>
          </div>
          
          <div className="space-y-1">
            {stat.type === 'number' && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Mean:</span>
                  <span className="text-slate-300 font-mono">{stat.mean !== undefined ? formatNumber(stat.mean) : '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Median:</span>
                  <span className="text-slate-300 font-mono">{stat.median !== undefined ? formatNumber(stat.median) : '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Min/Max:</span>
                  <span className="text-slate-300 font-mono">{stat.min} / {stat.max}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between text-sm pt-2 border-t border-slate-700/50 mt-2">
              <span className="text-slate-500">Unique:</span>
              <span className="text-slate-300">{stat.uniqueCount}</span>
            </div>
             <div className="flex justify-between text-sm">
              <span className="text-slate-500">Missing:</span>
              <span className={`font-mono ${stat.nullCount > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                {stat.nullCount}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
