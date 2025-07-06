import React from 'react';
import { CryptoData } from '../types';

interface HeatmapDisplayProps {
  data: CryptoData[]; // Paginated data
}

const formatBigNumberConcise = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  if (Math.abs(value) >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const performanceMetrics: { key: keyof CryptoData; label: string }[] = [
  { key: 'price_change_percentage_1h_in_currency', label: '1h %' },
  { key: 'price_change_percentage_24h', label: '24h %' },
  { key: 'price_change_percentage_7d_in_currency', label: '7d %' },
  { key: 'price_change_percentage_30d_in_currency', label: '30d %' },
];

// Las funciones getPerformanceColor y getVolumeColor serán reemplazadas por getAdvancedHeatmapColor
import { getAdvancedHeatmapColor, HeatmapMetricType } from '../utils/colorUtils'; // Import the new color utility

interface HeatmapCellProps {
  coin?: CryptoData; // Optional: not present for headers
  metricKey?: keyof CryptoData;
  value?: number | string | null;
  color?: string; // Optional: not present for headers or name cells
  isName?: boolean;
  isHeader?: boolean;
  colSpan?: number;
  label?: string;
}

const HeatmapCell: React.FC<HeatmapCellProps> = 
  ({ coin, metricKey, value, color, isName, isHeader, colSpan, label }) => {
  
  let displayValue: string;
  let titleText: string;

  if (isHeader) {
    displayValue = label || '';
    titleText = label || 'Header';
  } else if (isName && coin) {
    displayValue = `${coin.name} (${coin.symbol?.toUpperCase()})`;
    titleText = `${coin.name} (${coin.symbol?.toUpperCase()})`;
  } else if (metricKey && coin && label) {
    const rawValue = coin[metricKey] as number | null;
    if (rawValue === null || rawValue === undefined || isNaN(rawValue)) {
      displayValue = 'N/A';
    } else if (typeof rawValue === 'number' && (metricKey as string).includes('_percentage_')) {
      displayValue = `${rawValue.toFixed(1)}%`;
    } else if (metricKey === 'total_volume') {
      displayValue = formatBigNumberConcise(rawValue);
    } else {
      displayValue = String(rawValue);
    }
    titleText = `${coin.name} (${String(coin.symbol).toUpperCase()}): ${label} - ${displayValue}`;
  } else {
    // Fallback if other conditions are not met (e.g. 'value' prop is used directly)
    displayValue = (value !== undefined && value !== null) ? String(value) : 'N/A';
    titleText = coin ? `${coin.name} (${String(coin.symbol).toUpperCase()}): ${displayValue}` : displayValue;
  }

  return (
    <div
      title={titleText}
      className={`
        p-1.5 text-xs text-white/95 overflow-hidden text-center shadow-sm
        flex items-center justify-center 
        ${isHeader ? 'font-semibold bg-slate-700 text-slate-300' : ''}
        ${isName ? 'text-left justify-start font-medium text-slate-200 bg-slate-800 pl-2' : ''}
        ${colSpan ? `col-span-${colSpan}` : ''}
      `}
      style={!isHeader && !isName && color ? { backgroundColor: color } : {}}
    >
      <span className={`truncate ${isName ? 'max-w-[120px] sm:max-w-[150px]' : 'max-w-full'}`}>{displayValue}</span>
    </div>
  );
};

const Legend: React.FC<{ type: 'performance' | 'volume' }> = ({ type }) => {
  // This legend might need adjustment if getAdvancedHeatmapColor produces very different ranges
  // than the original getPerformanceColor and getVolumeColor.
  // For now, keeping it as is, but it's a point of potential refinement.
  const performanceExamplePos = getAdvancedHeatmapColor(5, 'price_change_percentage_24h');
  const performanceExampleNeut = getAdvancedHeatmapColor(0, 'price_change_percentage_24h');
  const performanceExampleNeg = getAdvancedHeatmapColor(-5, 'price_change_percentage_24h');

  // For volume, we need example values and min/max, or use fixed colors for legend
  const volumeExampleHigh = getAdvancedHeatmapColor(1e9, 'total_volume', 1e6, 1e9); // Example high
  const volumeExampleMid = getAdvancedHeatmapColor(5e8, 'total_volume', 1e6, 1e9);  // Example mid
  const volumeExampleLow = getAdvancedHeatmapColor(1e6, 'total_volume', 1e6, 1e9);   // Example low

  return (
    <div className="flex flex-col items-center space-y-1 text-xs text-slate-400">
      {type === 'performance' && (
        <>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: performanceExamplePos}}></div> Positivo Fuerte</div>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: performanceExampleNeut}}></div> Neutral</div>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: performanceExampleNeg}}></div> Negativo Fuerte</div>
        </>
      )}
      {type === 'volume' && (
        <>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: volumeExampleHigh}}></div> Volumen Alto</div>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: volumeExampleMid}}></div> Volumen Medio</div>
          <div className="flex items-center"><div className="w-3 h-3 mr-1.5 rounded-sm" style={{backgroundColor: volumeExampleLow}}></div> Volumen Bajo</div>
        </>
      )}
    </div>
  );
};

const HeatmapDisplay: React.FC<HeatmapDisplayProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-slate-400 text-center py-8">No data available for heatmaps. Adjust filters or wait for data to load.</p>;
  }

  // Calculate min/max for volume for color scaling
  const allVolumes = data.map(d => d.total_volume as number).filter(v => v !== null && !isNaN(v) && v > 0);
  const minVolume = Math.min(...allVolumes);
  const maxVolume = Math.max(...allVolumes);

  const performanceHeaderCols = ['Name', ...performanceMetrics.map(m => m.label)];
  const volumeHeaderCols = ['Name', 'Volume (24h)'];

  return (
    <div className="p-1 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Performance Heatmap */}
        <div className="flex-auto lg:w-2/3 bg-slate-800 p-3 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-sky-300 mb-3 text-center">Performance Trends</h3>
          <div className={`grid gap-px bg-slate-900/50 border border-slate-700 rounded`} style={{ gridTemplateColumns: `minmax(120px, 1.5fr) repeat(${performanceMetrics.length}, minmax(50px, 1fr))`}}>
            {/* Headers */}
            {performanceHeaderCols.map(label => <HeatmapCell key={`perf-header-${label}`} label={label} isHeader />)}
            {/* Data Rows */}
            {data.map((coin) => (
              <React.Fragment key={`perf-row-${coin.id}`}>
                <HeatmapCell coin={coin} isName />
                {performanceMetrics.map(metric => (
                  <HeatmapCell 
                    key={`${coin.id}-${metric.key}`} 
                    coin={coin} 
                    metricKey={metric.key} 
                    // Use new color function for performance
                    color={getAdvancedHeatmapColor(coin[metric.key] as number | null, metric.key as HeatmapMetricType)}
                    label={metric.label}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
           <div className="mt-3 flex justify-center">
            {/* Update Legend if necessary, or rely on intuitive colors */}
            <Legend type="performance" />
          </div>
        </div>

        {/* Volume Heatmap */}
        <div className="flex-auto lg:w-1/3 bg-slate-800 p-3 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-sky-300 mb-3 text-center">Volume (24h)</h3>
          <div className={`grid gap-px bg-slate-900/50 border border-slate-700 rounded`} style={{ gridTemplateColumns: `minmax(120px, 1.5fr) minmax(70px, 1fr)` }}>
            {/* Headers */}
            {volumeHeaderCols.map(label => <HeatmapCell key={`vol-header-${label}`} label={label} isHeader />)}
            {/* Data Rows */}
            {data.map((coin) => (
              <React.Fragment key={`vol-row-${coin.id}`}>
                <HeatmapCell coin={coin} isName />
                <HeatmapCell 
                  coin={coin} 
                  metricKey={'total_volume'} 
                  // Use new color function for volume, passing min/max
                  color={getAdvancedHeatmapColor(coin.total_volume, 'total_volume', minVolume, maxVolume)}
                  label="Volume (24h)"
                />
              </React.Fragment>
            ))}
          </div>
           <div className="mt-3 flex justify-center">
            {/* Update Legend if necessary */}
            <Legend type="volume" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapDisplay;
