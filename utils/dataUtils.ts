import Papa from 'papaparse';
import * as d3 from 'd3';
import { DataRow, ColumnStats, Dataset } from '../types';

export const parseCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn("CSV Parse Errors:", results.errors);
        }
        
        const rows = results.data as DataRow[];
        const columns = results.meta.fields || [];
        
        if (rows.length === 0 || columns.length === 0) {
          reject(new Error("No data found in CSV"));
          return;
        }

        const stats = calculateStats(rows, columns);

        resolve({
          name: file.name,
          rows,
          columns,
          stats
        });
      },
      error: (error) => reject(error)
    });
  });
};

const calculateStats = (rows: DataRow[], columns: string[]): ColumnStats[] => {
  return columns.map(col => {
    const values = rows.map(r => r[col]);
    const validValues = values.filter(v => v !== null && v !== undefined && v !== '');
    
    // Simple type detection
    let type: ColumnStats['type'] = 'unknown';
    const firstValid = validValues[0];
    if (typeof firstValid === 'number') type = 'number';
    else if (typeof firstValid === 'boolean') type = 'boolean';
    // Fix: cast to any because DataRow type definition doesn't explicitly include Date
    else if ((firstValid as any) instanceof Date) type = 'date';
    else if (typeof firstValid === 'string') type = 'string';

    const nullCount = values.length - validValues.length;
    const uniqueCount = new Set(validValues as any[]).size;

    let numStats = {};
    if (type === 'number') {
      const numbers = validValues as number[];
      numStats = {
        min: d3.min(numbers),
        max: d3.max(numbers),
        mean: d3.mean(numbers),
        median: d3.median(numbers)
      };
    }

    return {
      name: col,
      type,
      uniqueCount,
      nullCount,
      ...numStats
    };
  });
};

export const formatNumber = (num: number): string => {
  return d3.format(".2s")(num);
};

export const getSampleData = (dataset: Dataset, limit = 10): string => {
  // Create a condensed string representation for the AI
  const headers = dataset.columns.join(",");
  const rows = dataset.rows.slice(0, limit).map(row => 
    dataset.columns.map(col => row[col]).join(",")
  ).join("\n");
  
  const statsSummary = dataset.stats.map(s => {
    let statStr = `${s.name} (${s.type})`;
    if (s.type === 'number') {
      statStr += ` [Min: ${s.min}, Max: ${s.max}, Mean: ${s.mean?.toFixed(2)}]`;
    }
    return statStr;
  }).join("\n");

  return `
Data Schema & Stats:
${statsSummary}

First ${limit} rows:
${headers}
${rows}
`;
};