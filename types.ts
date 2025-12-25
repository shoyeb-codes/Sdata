export interface DataRow {
  [key: string]: string | number | boolean | null;
}

export interface ColumnStats {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'unknown';
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  uniqueCount: number;
  nullCount: number;
}

export interface Dataset {
  name: string;
  rows: DataRow[];
  columns: string[];
  stats: ColumnStats[];
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'scatter' | 'area' | 'pie';
  xAxis: string;
  yAxis: string;
  title: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  chartConfig?: ChartConfig;
  timestamp: number;
  isThinking?: boolean;
}

export interface AnalysisResponse {
  answer: string;
  chart?: ChartConfig;
}
