import React, { useState } from 'react';
import ClassicHeatmapDisplay from './ClassicHeatmapDisplay';
import { HeatmapMetric, CryptoData } from '../types';

interface ClassicHeatmapViewProps {
  data: CryptoData[];
}

const ClassicHeatmapView: React.FC<ClassicHeatmapViewProps> = ({ data: cryptoData }) => {
  const [selectedMetric, setSelectedMetric] = useState<HeatmapMetric>('price_change_percentage_24h');

  const metrics: { key: HeatmapMetric; label: string }[] = [
    { key: 'price_change_percentage_1h_in_currency', label: 'Cambio 1h' },
    { key: 'price_change_percentage_24h', label: 'Cambio 24h' },
    { key: 'price_change_percentage_7d_in_currency', label: 'Cambio 7d' },
    { key: 'price_change_percentage_30d_in_currency', label: 'Cambio 30d' },
    { key: 'market_cap', label: 'Capitalización' },
    { key: 'total_volume', label: 'Volumen 24h' },
    { key: 'current_price', label: 'Precio Actual' },
  ];

  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No hay datos disponibles para el heatmap</p>
      </div>
    );
  }

  // Tomar solo los primeros 100 para el heatmap clásico (10x10 grid)
  const limitedData = cryptoData.slice(0, 100);

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">🎯 Heatmap Clásico</h2>
        
        {/* Selector de métrica */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Métrica a visualizar:
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as HeatmapMetric)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full max-w-xs p-2.5"
          >
            {metrics.map(metric => (
              <option key={metric.key} value={metric.key}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-gray-400 mb-4">
          Mostrando top 100 criptomonedas en formato grid 10x10
        </p>
        
        <ClassicHeatmapDisplay data={limitedData} selectedMetric={selectedMetric} />
      </div>
    </div>
  );
};

export default ClassicHeatmapView;