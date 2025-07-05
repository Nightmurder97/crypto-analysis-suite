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
  return String(value);
};

const getColorForMetric = (value: number | null | undefined, metric: HeatmapMetric, allValuesForMetric: number[]): string => {
  if (value === null || value === undefined || isNaN(value)) return 'bg-slate-600';

  if (metric === 'total_volume' || metric === 'market_cap' || metric === 'current_price') {
    // Escala: top 33% verde oscuro, medio 33% naranja oscuro, bajo 33% rojo oscuro
    const sorted = [...allValuesForMetric].filter(v => v !== null && !isNaN(v)).sort((a, b) => a - b);
    const idx = sorted.findIndex(v => v === value);
    const tercio = Math.floor(sorted.length / 3);
    if (idx >= 2 * tercio) return '#166534'; // Verde oscuro (tailwind emerald-800)
    if (idx >= tercio) return '#b45309'; // Naranja oscuro (tailwind orange-700)
    return '#7f1d1d'; // Rojo oscuro (tailwind red-900)
  }

  // Para porcentajes, usa la escala de performance trends
  if (metric.includes('_percentage_')) {
    const intensity = Math.min(Math.abs(value) / 15, 1);
    if (value > 0.05) return `rgba(34, 197, 94, ${intensity * 0.7 + 0.3})`;
    if (value < -0.05) return `rgba(239, 68, 68, ${intensity * 0.7 + 0.3})`;
    return 'bg-yellow-600 opacity-80';
  }
  return 'bg-slate-600';
};

const ClassicLegend: React.FC<{ metric: HeatmapMetric }> = ({ metric }) => {
  const isPercentage = metric.includes('_percentage_');
  return (
    <div className="flex items-center justify-center space-x-4 my-3 text-xs text-slate-400">
      {isPercentage ? (
        <>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getColorForMetric(5, metric, [])}}></div> Strong Positive</div>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getColorForMetric(0, metric, [])}}></div> Neutral</div>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getColorForMetric(-5, metric, [])}}></div> Strong Negative</div>
        </>
      ) : (
         <>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getColorForMetric(1e12, metric, [1e6, 1e12])}}></div> High Value</div>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getColorForMetric(1e9, metric, [1e6, 1e12])}}></div> Mid Value</div>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: getColorForMetric(1e6, metric, [1e6, 1e12])}}></div> Low Value</div>
        </>
      )}
    </div>
  );
};


const ClassicHeatmapDisplay: React.FC<ClassicHeatmapDisplayProps> = ({ data, selectedMetric }) => {
  if (data.length === 0) {
    return <p className="text-slate-400 text-center py-8">No data available for this heatmap. Adjust filters or wait for data to load.</p>;
  }

  const allValuesForMetric = data.map(d => d[selectedMetric] as number).filter(v => v !== null && !isNaN(v));
  const itemsPerRow = 10; // For a 10x10 grid for 100 items

  return (
    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-sky-300 mb-3 text-center">
        {selectedMetric.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Heatmap
      </h3>
      <ClassicLegend metric={selectedMetric} />
      <div 
        className="grid gap-px bg-slate-900/50 border border-slate-700 rounded"
        style={{ gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))` }}
      >
        {data.map((coin) => {
          const value = coin[selectedMetric] as number | null;
          const displayValue = formatValueForDisplay(value, selectedMetric);
          const color = getColorForMetric(value, selectedMetric, allValuesForMetric);
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