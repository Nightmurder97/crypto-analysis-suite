import React from 'react';
import { CryptoData } from './src/types';
import styles from './HeatmapDisplay.module.css';

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

const getPerformanceColor = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return 'bg-slate-600'; // Neutral for N/A
  const intensity = Math.min(Math.abs(value) / 15, 1); // Normalize for pct, cap at +/-15% for full intensity
  
  if (value > 0.05) return `rgba(34, 197, 94, ${intensity * 0.7 + 0.3})`; // Emerald-500 base
  if (value < -0.05) return `rgba(239, 68, 68, ${intensity * 0.7 + 0.3})`; // Red-500 base
  return 'bg-yellow-600 opacity-80'; // Near zero (yellowish, less intense)
};

const getVolumeColor = (value: number | null | undefined, allVolumes: number[]): string => {
  if (value === null || value === undefined || isNaN(value)) return 'bg-slate-600';
  if (allVolumes.length === 0) return 'bg-slate-600';

  // Ordenar y dividir en tercios
  const sorted = [...allVolumes].filter(v => v !== null && !isNaN(v)).sort((a, b) => a - b);
  const idx = sorted.findIndex(v => v === value);
  const tercio = Math.floor(sorted.length / 3);
  if (idx >= 2 * tercio) return '#166534'; // Verde oscuro (alto)
  if (idx >= tercio) return '#b45309'; // Naranja oscuro (medio)
  return '#7f1d1d'; // Rojo oscuro (bajo)
};

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
    displayValue = `${coin.name} (${coin.symbol.toUpperCase()})`;
    titleText = `${coin.name} (${coin.symbol.toUpperCase()})`;
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
    titleText = `${coin.name} (${coin.symbol.toUpperCase()}): ${label} - ${displayValue}`;
  } else {
    // Fallback if other conditions are not met (e.g. 'value' prop is used directly)
    displayValue = (value !== undefined && value !== null) ? String(value) : 'N/A';
    titleText = coin ? `${coin.name} (${coin.symbol.toUpperCase()}): ${displayValue}` : displayValue;
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
      {...(!isHeader && !isName && color ? { style: { backgroundColor: color } } : {})}
    >
      <span className={`truncate ${isName ? 'max-w-[120px] sm:max-w-[150px]' : 'max-w-full'}`}>{displayValue}</span>
    </div>
  );
};

const Legend: React.FC<{ type: 'performance' | 'volume' }> = ({ type }) => {
  return (
    <div className="flex flex-col items-center space-y-1 text-xs text-slate-400">
      {type === 'performance' && (
        <>
          <div className="flex items-center"><div className={`${styles.legendIcon} ${styles.performancePositive}`}></div> Strong Positive</div>
          <div className="flex items-center"><div className={`${styles.legendIcon} ${styles.performanceNeutral}`}></div> Neutral</div>
          <div className="flex items-center"><div className={`${styles.legendIcon} ${styles.performanceNegative}`}></div> Strong Negative</div>
        </>
      )}
      {type === 'volume' && (
        <>
          <div className="flex items-center"><div className={`${styles.legendIcon} ${styles.volumeHigh}`}></div> High Volume</div>
          <div className="flex items-center"><div className={`${styles.legendIcon} ${styles.volumeMid}`}></div> Mid Volume</div>
          <div className="flex items-center"><div className={`${styles.legendIcon} ${styles.volumeLow}`}></div> Low Volume</div>
        </>
      )}
    </div>
  );
};


const HeatmapDisplay: React.FC<HeatmapDisplayProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-slate-400 text-center py-8">No data available for heatmaps. Adjust filters or wait for data to load.</p>;
  }

  const allVolumes = data.map(d => d.total_volume as number).filter(v => v !== null && !isNaN(v) && v > 0);

  const performanceHeaderCols = ['Name', ...performanceMetrics.map(m => m.label)];
  const volumeHeaderCols = ['Name', 'Volume (24h)'];

  return (
    <div className="p-1 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Performance Heatmap */}
        <div className="flex-auto lg:w-2/3 bg-slate-800 p-3 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-sky-300 mb-3 text-center">Performance Trends</h3>
          <div className={`grid gap-px bg-slate-900/50 border border-slate-700 rounded ${styles.performanceGrid}`}>
            {/* Headers */}
            {performanceHeaderCols.map(label => <HeatmapCell key={`perf-header-${label}`} label={label} isHeader />)}
            {/* Data Rows */}
            {data.map((coin) => (
              <React.Fragment key={`perf-row-${coin.id}`}>
                <HeatmapCell coin={coin} isName />
                {performanceMetrics.map(metric => (
                  <HeatmapCell 
                    key={`${String(coin.id)}-${String(metric.key)}`} 
                    coin={coin} 
                    metricKey={metric.key} 
                    color={getPerformanceColor(coin[metric.key] as number | null)}
                    label={metric.label}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
           <div className="mt-3 flex justify-center">
            <Legend type="performance" />
          </div>
        </div>

        {/* Volume Heatmap */}
        <div className="flex-auto lg:w-1/3 bg-slate-800 p-3 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-sky-300 mb-3 text-center">Volume (24h)</h3>
          <div className={`grid gap-px bg-slate-900/50 border border-slate-700 rounded ${styles.volumeGrid}`}>
            {/* Headers */}
            {volumeHeaderCols.map(label => <HeatmapCell key={`vol-header-${label}`} label={label} isHeader />)}
            {/* Data Rows */}
            {data.map((coin) => (
              <React.Fragment key={`vol-row-${coin.id}`}>
                <HeatmapCell coin={coin} isName />
                <HeatmapCell 
                  coin={coin} 
                  metricKey={'total_volume'} 
                  color={getVolumeColor(coin.total_volume, allVolumes)}
                  label="Volume (24h)"
                />
              </React.Fragment>
            ))}
          </div>
           <div className="mt-3 flex justify-center">
            <Legend type="volume" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapDisplay;