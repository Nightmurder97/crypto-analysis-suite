// src/components/HeatmapDisplay.tsx - Versión con gradientes mejorados

import React from 'react';
import { CryptoData } from '../types';

interface HeatmapDisplayProps {
  data: CryptoData[]; // Todos los datos, sin paginación
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

// 🎨 NUEVA FUNCIÓN: Gradientes suaves y precisos
const getPerformanceColorWithGradient = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return 'rgb(100, 116, 139)'; // slate-500
  
  // Normalizar el valor para un gradiente suave
  const maxIntensity = 20; // Máximo 20% para intensidad completa
  const normalizedValue = Math.max(-maxIntensity, Math.min(maxIntensity, value)) / maxIntensity;
  
  if (value > 0.1) {
    // Gradiente verde: de verde claro a verde intenso
    const intensity = Math.abs(normalizedValue);
    const red = Math.floor(34 * (1 - intensity) + 0 * intensity);  // 34 -> 0
    const green = Math.floor(197 * (1 - intensity) + 255 * intensity);  // 197 -> 255
    const blue = Math.floor(94 * (1 - intensity) + 0 * intensity);  // 94 -> 0
    return `rgb(${red}, ${green}, ${blue})`;
  } else if (value < -0.1) {
    // Gradiente rojo: de rojo claro a rojo intenso
    const intensity = Math.abs(normalizedValue);
    const red = Math.floor(239 * (1 - intensity) + 255 * intensity);  // 239 -> 255
    const green = Math.floor(68 * (1 - intensity) + 0 * intensity);  // 68 -> 0
    const blue = Math.floor(68 * (1 - intensity) + 0 * intensity);  // 68 -> 0
    return `rgb(${red}, ${green}, ${blue})`;
  } else {
    // Neutral: gradiente amarillo suave
    const intensity = 0.3 + Math.abs(normalizedValue) * 0.4;
    return `rgba(245, 158, 11, ${intensity})`; // amber-500 con opacidad variable
  }
};

// 🎨 NUEVA FUNCIÓN: Gradientes para volumen
const getVolumeColorWithGradient = (value: number | null | undefined, allVolumes: number[]): string => {
  if (value === null || value === undefined || isNaN(value)) return 'rgb(100, 116, 139)';
  if (allVolumes.length === 0) return 'rgb(100, 116, 139)';

  // Calcular percentiles para gradiente suave
  const sorted = [...allVolumes].filter(v => v !== null && !isNaN(v)).sort((a, b) => a - b);
  const valueIndex = sorted.findIndex(v => v >= value);
  const percentile = valueIndex / sorted.length;
  
  // Gradiente de azul (bajo) a verde (alto) pasando por amarillo (medio)
  if (percentile <= 0.33) {
    // Bajo volumen: azul a cyan
    const intensity = percentile / 0.33;
    const red = Math.floor(59 + (34 - 59) * intensity);    // 59 -> 34 (blue-600 -> cyan-600)
    const green = Math.floor(130 + (197 - 130) * intensity); // 130 -> 197
    const blue = Math.floor(246 + (94 - 246) * intensity);   // 246 -> 94
    return `rgb(${red}, ${green}, ${blue})`;
  } else if (percentile <= 0.66) {
    // Volumen medio: cyan a amarillo
    const intensity = (percentile - 0.33) / 0.33;
    const red = Math.floor(34 + (245 - 34) * intensity);    // 34 -> 245 (cyan -> yellow)
    const green = Math.floor(197 + (158 - 197) * intensity); // 197 -> 158
    const blue = Math.floor(94 + (11 - 94) * intensity);    // 94 -> 11
    return `rgb(${red}, ${green}, ${blue})`;
  } else {
    // Alto volumen: amarillo a verde
    const intensity = (percentile - 0.66) / 0.34;
    const red = Math.floor(245 + (34 - 245) * intensity);   // 245 -> 34 (yellow -> green)
    const green = Math.floor(158 + (197 - 158) * intensity); // 158 -> 197
    const blue = Math.floor(11 + (94 - 11) * intensity);    // 11 -> 94
    return `rgb(${red}, ${green}, ${blue})`;
  }
};

interface HeatmapCellProps {
  coin?: CryptoData;
  metricKey?: keyof CryptoData;
  value?: number | string | null;
  color?: string;
  isName?: boolean;
  isHeader?: boolean;
  colSpan?: number;
  label?: string;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({ 
  coin, metricKey, value, color, isName, isHeader, colSpan, label 
}) => {
  const cellStyle: React.CSSProperties = {
    backgroundColor: color,
    color: isHeader ? '#e2e8f0' : '#ffffff',
    fontWeight: isHeader || isName ? 'bold' : 'normal',
    fontSize: isHeader ? '14px' : '12px',
    textShadow: isHeader ? 'none' : '1px 1px 2px rgba(0,0,0,0.8)',
  };

  const displayValue = isName && coin ? coin.name : 
                      isHeader ? label : 
                      (typeof value === 'number' ? 
                        (metricKey?.includes('percentage') ? `${value.toFixed(1)}%` : 
                         metricKey === 'total_volume' || metricKey === 'market_cap' ? formatBigNumberConcise(value) :
                         value.toLocaleString()) : 
                        String(value));

  return (
    <div 
      className="p-2 text-center border border-gray-700/30 flex flex-col justify-center items-center min-h-[60px] transition-all duration-200 hover:scale-105 hover:z-10 relative"
      style={cellStyle}
      title={coin ? `${coin.name} (${coin.symbol.toUpperCase()})` : label}
      colSpan={colSpan}
    >
      {isName && coin && (
        <div className="text-xs opacity-75 mb-1">{coin.symbol.toUpperCase()}</div>
      )}
      <div className="font-semibold truncate w-full text-center">
        {displayValue}
      </div>
    </div>
  );
};

const HeatmapDisplay: React.FC<HeatmapDisplayProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg">
        <p className="text-slate-400 text-lg">No hay datos disponibles para el heatmap</p>
        <p className="text-slate-500 text-sm">Ajusta los filtros o espera a que se carguen los datos</p>
      </div>
    );
  }

  const allVolumes = data.map(d => d.total_volume).filter(v => v !== null && !isNaN(v)) as number[];

  // Grid responsivo que se adapta al número de elementos
  const getGridColumns = () => {
    if (data.length <= 100) return 10;
    if (data.length <= 400) return 20;
    if (data.length <= 900) return 30;
    return 40; // Para 1000 elementos
  };

  const gridCols = getGridColumns();

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-cyan-400 mb-2">
          🔥 Heatmap de Mercado - Performance vs Volumen
        </h3>
        <p className="text-sm text-gray-400">
          Mostrando {data.length} criptomonedas con gradientes suaves
        </p>
      </div>

      {/* Leyenda de colores */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{backgroundColor: 'rgb(34, 197, 94)'}}></div>
          <span>Fuerte Alza</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{backgroundColor: 'rgba(245, 158, 11, 0.7)'}}></div>
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{backgroundColor: 'rgb(239, 68, 68)'}}></div>
          <span>Fuerte Baja</span>
        </div>
      </div>

      {/* Grid principal del heatmap */}
      <div 
        className="grid gap-1 overflow-x-auto"
        style={{ 
          gridTemplateColumns: `repeat(${gridCols}, minmax(60px, 1fr))`,
          maxHeight: '70vh',
          overflowY: 'auto'
        }}
      >
        {data.map((coin, index) => {
          // Alternar entre mostrar performance (24h) y volumen
          const showPerformance = index % 2 === 0;
          
          if (showPerformance) {
            const performanceValue = coin.price_change_percentage_24h;
            const color = getPerformanceColorWithGradient(performanceValue);
            return (
              <HeatmapCell
                key={`${coin.id}-performance`}
                coin={coin}
                metricKey="price_change_percentage_24h"
                value={performanceValue}
                color={color}
              />
            );
          } else {
            const volumeValue = coin.total_volume;
            const color = getVolumeColorWithGradient(volumeValue, allVolumes);
            return (
              <HeatmapCell
                key={`${coin.id}-volume`}
                coin={coin}
                metricKey="total_volume"
                value={volumeValue}
                color={color}
              />
            );
          }
        })}
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        Heatmap completo • Sin paginación • Con gradientes suaves
      </div>
    </div>
  );
};

export default HeatmapDisplay;