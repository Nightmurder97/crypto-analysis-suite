import React, { useMemo } from 'react';
import { CryptoData, HeatmapMetric } from '../types';
import {
  createPerformanceColorScale,
  createSequentialLogColorScale,
} from '../utils/colorUtils';

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

const ClassicHeatmapDisplay: React.FC<ClassicHeatmapDisplayProps> = ({ data, selectedMetric }) => {
  // --- Lógica de Color Dinámica ---
  const colorScale = useMemo(() => {
    const values = data.map(d => d[selectedMetric] as number);
    const isPercentage = (selectedMetric as string).includes('_percentage_');

    if (isPercentage) {
      return createPerformanceColorScale(values);
    } else {
      return createSequentialLogColorScale(values);
    }
  }, [data, selectedMetric]);

  if (data.length === 0) {
    return <p className="text-gray-400 text-center py-8">No data available for this heatmap. Adjust filters or wait for data to load.</p>;
  }

  // --- Leyenda Dinámica ---
  const ClassicLegend: React.FC = () => {
    const isPercentage = (selectedMetric as string).includes('_percentage_');
    const performanceGradient = 'linear-gradient(to right, #b91c1c, #ef4444, #f87171, #9ca3af, #86efac, #22c55e, #166534)';
    const volumeGradient = 'linear-gradient(to right, #93c5fd, #3b82f6, #1d4ed8)';
    const gradient = isPercentage ? performanceGradient : volumeGradient;

    return (
      <div className="flex flex-col items-center space-y-1 my-3 text-xs text-gray-300">
        <div className="w-full max-w-xs h-3 rounded border border-gray-600" style={{ background: gradient }}></div>
        <div className="flex justify-between w-full max-w-xs px-1">
          <span className="text-gray-300">{isPercentage ? 'Negativo' : 'Bajo'}</span>
          <span className="text-gray-300">{isPercentage ? 'Positivo' : 'Alto'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
      <h3 className="text-lg font-semibold text-gray-200 mb-3 text-center">
        {selectedMetric.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Heatmap
      </h3>
      <ClassicLegend />
      <div
        className="grid gap-px bg-gray-700 border border-gray-500 rounded overflow-hidden"
        style={{ gridTemplateColumns: `repeat(10, minmax(0, 1fr))` }} // 10x10 grid
      >
        {data.map((coin) => {
          const value = coin[selectedMetric] as number | null;
          const displayValue = formatValueForDisplay(value, selectedMetric);
          const color = colorScale(value); // Usar la nueva escala de color
          const titleText = `${coin.name} (${coin.symbol.toUpperCase()}): ${displayValue}`;

          return (
            <div
              key={coin.id}
              title={titleText}
              className="p-1.5 text-xs font-bold text-center overflow-hidden flex flex-col items-center justify-center aspect-square border border-gray-500"
              style={{ backgroundColor: color, color: 'white' }}
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