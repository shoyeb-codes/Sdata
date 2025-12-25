import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { ChartConfig, DataRow } from '../types';

interface ChartRendererProps {
  data: DataRow[];
  config: ChartConfig;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ChartRenderer: React.FC<ChartRendererProps> = ({ data, config }) => {
  // Memoize data preparation if needed, but for now direct passing is okay for small datasets
  // Limit to 50 data points for readability in charts if data is huge
  const chartData = data.length > 200 ? data.slice(0, 200) : data;

  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={config.xAxis} stroke="#94a3b8" tick={{fontSize: 12}} />
            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
            <Bar dataKey={config.yAxis} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={config.xAxis} stroke="#94a3b8" tick={{fontSize: 12}} />
            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
            <Line type="monotone" dataKey={config.yAxis} stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey={config.xAxis} stroke="#94a3b8" tick={{fontSize: 12}} />
            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
            <Area type="monotone" dataKey={config.yAxis} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          </AreaChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
             <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey={config.xAxis} name={config.xAxis} stroke="#94a3b8" />
            <YAxis type="number" dataKey={config.yAxis} name={config.yAxis} stroke="#94a3b8" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            <Scatter name={`${config.xAxis} vs ${config.yAxis}`} data={chartData} fill="#8b5cf6" />
          </ScatterChart>
        );
      case 'pie':
        return (
          <PieChart>
             <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            />
            <Legend />
            <Pie
              data={chartData.slice(0, 10)} // Pie charts get messy with too many slices
              dataKey={config.yAxis}
              nameKey={config.xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.slice(0, 10).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return <div className="text-gray-500">Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full h-[300px] mt-4 bg-slate-900/50 rounded-lg border border-slate-700 p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-2">{config.title}</h3>
      <p className="text-xs text-slate-500 mb-4">{config.description}</p>
      <ResponsiveContainer width="100%" height="85%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;
