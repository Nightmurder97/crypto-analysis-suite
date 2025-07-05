import React from 'react';
import { HeatmapMetric } from '../types';

interface HeatmapControlsProps {
  selectedMetric: HeatmapMetric;
  onMetricChange: (metric: HeatmapMetric) => void;
}

const metricOptions: { value: HeatmapMetric; label: string }[] = [
  { value: 'price_change_percentage_1h_in_currency', label: '1h % Change' },
  { value: 'price_change_percentage_24h', label: '24h % Change' },
  { value: 'price_change_percentage_7d_in_currency', label: '7d % Change' },
  { value: 'price_change_percentage_30d_in_currency', label: '30d % Change' },
  { value: 'market_cap', label: 'Market Cap' },
  { value: 'total_volume', label: 'Volume (24h)' },
  { value: 'current_price', label: 'Current Price' },
];

const HeatmapControls: React.FC<HeatmapControlsProps> = ({ selectedMetric, onMetricChange }) => {
  return (
    <div className="mb-4 p-4 bg-slate-700 rounded-lg shadow flex items-center justify-center">
      <label htmlFor="heatmapMetricSelect" className="mr-3 text-sm font-medium text-slate-300">
        Select Heatmap Metric:
      </label>
      <select
        id="heatmapMetricSelect"
        value={selectedMetric}
        onChange={(e) => onMetricChange(e.target.value as HeatmapMetric)}
        className="bg-slate-600 border border-slate-500 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 p-2.5 shadow-sm"
      >
        {metricOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HeatmapControls;