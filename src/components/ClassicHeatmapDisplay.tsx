import React from 'react';
import { CryptoData, HeatmapMetric } from '../types';

interface ClassicHeatmapDisplayProps {
  data: CryptoData[]; // Paginated data (100 items)
  selectedMetric: HeatmapMetric;
}

const formatValueForDisplay = (value: number | null | undefined, metric: HeatmapMetric): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';

  if (metric.includes('_percentage_')) {
    return `${value.toFixed(1)}%`;
  }
  if (metric === 'market_cap' || metric === 'total_volume') {
    if (Math.abs(value) >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
    if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
  if (metric === 'current_price') {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: value < 0.01 ? 6 : 2 })}`;
  }
  // Fallback for other metric types if any, or could throw error for unhandled metric
  return String(value);
};

import { getAdvancedHeatmapColor, HeatmapMetricType } from '../utils/colorUtils'; // Import the new color utility

const ClassicHeatmapDisplay: React.FC<ClassicHeatmapDisplayProps> = ({ data, selectedMetric }) => {
  if (data.length === 0) {
    return <p className="text-slate-400 text-center py-8">No data available for this heatmap. Adjust filters or wait for data to load.</p>;
  }

  const allValuesForMetric = data.map(d => d[selectedMetric] as number).filter(v => v !== null && !isNaN(v));
  const minVal = Math.min(...allValuesForMetric);
  const maxVal = Math.max(...allValuesForMetric);

  const itemsPerRow = 10; // For a 10x10 grid for 100 items

  // Updated Legend to use getAdvancedHeatmapColor (simplified version)
  const ClassicLegend: React.FC<{ metric: HeatmapMetricType }> = ({ metric }) => {
    const isPercentage = (metric as string).includes('_percentage_');
    return (
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 my-3 text-xs text-slate-400">
        {isPercentage ? (
          <>
            <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getAdvancedHeatmapColor(10, metric)}}></div> Max Positivo</div>
            <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getAdvancedHeatmapColor(0, metric)}}></div> Neutral</div>
            <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getAdvancedHeatmapColor(-10, metric)}}></div> Max Negativo</div>
          </>
        ) : (
           <>
            <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getAdvancedHeatmapColor(maxVal, metric, minVal, maxVal)}}></div> Alto</div>
            <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getAdvancedHeatmapColor(minVal + (maxVal - minVal) / 2, metric, minVal, maxVal)}}></div> Medio</div>
            <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getAdvancedHeatmapColor(minVal, metric, minVal, maxVal)}}></div> Bajo</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-sky-300 mb-3 text-center">
        {selectedMetric.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Heatmap
      </h3>
      <ClassicLegend metric={selectedMetric as HeatmapMetricType} />
      <div 
        className="grid gap-px bg-slate-900/50 border border-slate-700 rounded"
        style={{ gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))` }}
      >
        {data.map((coin) => {
          const value = coin[selectedMetric] as number | null;
          const displayValue = formatValueForDisplay(value, selectedMetric);
          // Use new color function, passing min/max for non-percentage metrics
          const color = getAdvancedHeatmapColor(value, selectedMetric as HeatmapMetricType, minVal, maxVal);
          const titleText = `${coin.name} (${coin.symbol.toUpperCase()}): ${displayValue}`;

          return (
            <div
              key={coin.id}
              title={titleText}
              className="p-1.5 text-xs font-bold text-white overflow-hidden shadow-sm flex flex-col items-center justify-center aspect-square"
              style={{ backgroundColor: color }}
            >
              <span className="font-semibold truncate block text-center w-full">{coin.symbol.toUpperCase()}</span>
              <span className="truncate block text-center w-full">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassicHeatmapDisplay;