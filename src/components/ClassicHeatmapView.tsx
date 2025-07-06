import React, { useState, useCallback } from 'react';
import ClassicHeatmapDisplay from './ClassicHeatmapDisplay';
import { HeatmapMetric, CryptoData } from '../types';
import { ArrowDownTrayIcon } from './IconComponents'; // Assuming IconComponents is in the same folder or adjust path

interface ClassicHeatmapViewProps {
  data: CryptoData[];
}

const ClassicHeatmapView: React.FC<ClassicHeatmapViewProps> = ({ data: cryptoData }) => {
  const [selectedMetric, setSelectedMetric] = useState<HeatmapMetric>('price_change_percentage_24h');

  // Tomar solo los primeros 100 para el heatmap clásico (10x10 grid)
  // This must be defined before useCallback that depends on it.
  const limitedData = useMemo(() => cryptoData.slice(0, 100), [cryptoData]);

  const handleDownloadClassicHeatmapData = useCallback(() => {
    if (limitedData.length === 0) {
      alert("No hay datos para descargar.");
      return;
    }
    const dataToDownload = limitedData; // Data already filtered to top 100
    const csvContent = [
      ['Name', 'Symbol', 'Price', 'Market Cap', 'Volume', '24h Change', '1h Change', '7d Change', '30d Change', 'Category'].join(','),
      ...dataToDownload.map(crypto => [
        crypto.name,
        crypto.symbol,
        crypto.current_price || 0,
        crypto.market_cap || 0,
        crypto.total_volume || 0,
        crypto.price_change_percentage_24h || 0,
        crypto.price_change_percentage_1h_in_currency || 0,
        crypto.price_change_percentage_7d_in_currency || 0,
        crypto.price_change_percentage_30d_in_currency || 0,
        (crypto as any).category || 'Others' // Assuming category might be added
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0,19).replace(/:/g,'-');
    a.download = `crypto_classic_heatmap_${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [limitedData]);

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

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-2xl font-semibold text-cyan-400">🎯 Heatmap Clásico</h2>
          <button
            type="button"
            onClick={handleDownloadClassicHeatmapData}
            className="mt-2 sm:mt-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2"
            disabled={limitedData.length === 0}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Descargar CSV (Top 100)
          </button>
        </div>
        
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