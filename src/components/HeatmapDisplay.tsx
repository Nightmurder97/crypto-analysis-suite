import React, { useMemo } from 'react';
import { CryptoData } from '../types';
import {
  createPerformanceColorScale,
  createSequentialLogColorScale,
  isColorLight,
} from '../utils/colorUtils';

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
    const rawValue = value as number | null;
    if (rawValue === null || rawValue === undefined || isNaN(rawValue)) {
        displayValue = 'N/A';
    } else if (typeof rawValue === 'number' && (metricKey as string).includes('_percentage_')) {
        displayValue = `${rawValue.toFixed(1)}%`;
    } else if (metricKey === 'total_volume') {
        displayValue = formatBigNumberConcise(rawValue);
    } else {
        displayValue = String(rawValue);
    }
    titleText = coin ? `${coin.name} (${String(coin.symbol).toUpperCase()}): ${displayValue}` : displayValue;
  }

  const textColorClass = useMemo(() => {
    if (isHeader || isName) {
      return 'text-gray-200 font-semibold'; // Texto claro para headers y nombres en tema oscuro
    }
    if (!color) {
      return 'text-gray-200';
    }
    return isColorLight(color) ? 'text-black font-semibold' : 'text-white font-semibold';
  }, [color, isHeader, isName]);

  return (
    <div
      title={titleText}
      className={`
        p-1.5 text-xs ${textColorClass} text-center 
        flex items-center justify-center border border-gray-500
        ${isHeader ? 'font-bold bg-gray-700' : ''}
        ${isName ? 'text-left justify-start font-medium bg-gray-600 pl-2' : ''}
        ${colSpan ? `col-span-${colSpan}` : ''}
      `}
      style={!isHeader && !isName && color ? { backgroundColor: color } : {}}
    >
      <span className={`truncate ${isName ? 'max-w-[120px] sm:max-w-[150px]' : 'max-w-full'}`}>
        {displayValue}
      </span>
    </div>
  );
};

const HeatmapDisplay: React.FC<HeatmapDisplayProps> = ({ data }) => {
  // --- ESCALAS DE COLOR DINÁMICAS ---
  const performanceColorScales = useMemo(() => {
    const scales: { [key: string]: (val: number | null | undefined) => string } = {};
    performanceMetrics.forEach(metric => {
      const metricData = data.map(coin => coin[metric.key] as number | null | undefined);
      scales[metric.key] = createPerformanceColorScale(metricData);
    });
    return scales;
  }, [data]);

  const volumeColorScale = useMemo(() => {
    const volumeData = data.map(coin => coin.total_volume);
    return createSequentialLogColorScale(volumeData);
  }, [data]);

  if (data.length === 0) {
    return <p className="text-gray-400 text-center py-8">No data available for heatmaps. Adjust filters or wait for data to load.</p>;
  }

  const Legend = () => (
    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg mb-4 text-xs text-gray-300 border border-gray-600 w-full max-w-lg">
      {/* Performance Legend */}
      <div className="flex flex-col space-y-2">
        <span className="font-bold text-gray-200">Rendimiento (%)</span>
        <div className="flex items-center space-x-2">
          <span className="text-red-400">Negativo</span>
          <div className="w-24 h-4 rounded border border-gray-600" style={{ background: 'linear-gradient(to right, #b91c1c, #ef4444, #f87171, #9ca3af, #86efac, #22c55e, #166534)' }}></div>
          <span className="text-green-400">Positivo</span>
        </div>
      </div>
      {/* Volume Legend */}
      <div className="flex flex-col space-y-2">
        <span className="font-bold text-gray-200">Volumen</span>
         <div className="flex items-center space-x-2">
            <span className="mr-1 text-gray-300">Bajo</span>
            <div className="w-24 h-4 rounded border border-gray-600" style={{ background: 'linear-gradient(to right, #93c5fd, #3b82f6, #1d4ed8)' }}></div>
            <span className="ml-1 text-gray-300">Alto</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-1 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Performance Heatmap */}
        <div className="flex-auto lg:w-2/3 bg-gray-800 p-4 rounded-lg border border-gray-600">
          <h3 className="text-lg font-semibold text-gray-200 mb-3 text-center">Performance Trends</h3>
          <div className="grid grid-cols-5 gap-px text-center bg-gray-700 border border-gray-500 rounded overflow-hidden">
            <HeatmapCell isHeader label="Name" />
            {performanceMetrics.map(metric => <HeatmapCell key={metric.key} isHeader label={metric.label} />)}

            {data.map(coin => (
              <React.Fragment key={`${coin.id}-perf`}>
                <HeatmapCell isName coin={coin} />
                {performanceMetrics.map(metric => {
                  const value = coin[metric.key] as number | null;
                  const color = performanceColorScales[metric.key](value);
                  return <HeatmapCell key={`${coin.id}-${metric.key}`} coin={coin} metricKey={metric.key} color={color} label={metric.label} />;
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 flex justify-center">
            <Legend />
          </div>
        </div>

        {/* Volume Heatmap */}
        <div className="flex-auto lg:w-1/3 bg-gray-800 p-4 rounded-lg border border-gray-600">
          <h3 className="text-lg font-semibold text-gray-200 mb-3 text-center">Volume (24h)</h3>
          <div className="grid grid-cols-1 gap-px text-center border border-gray-500 bg-gray-700 rounded overflow-hidden">
            {data.map(coin => {
              const color = volumeColorScale(coin.total_volume);
              return (
                <HeatmapCell
                  key={`${coin.id}-volume`}
                  coin={coin}
                  metricKey="total_volume"
                  label="Volume (24h)"
                  color={color}
                />
              )
            })}
          </div>
          <div className="mt-3 flex justify-center">
            <Legend />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapDisplay;
