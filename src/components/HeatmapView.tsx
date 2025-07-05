import React from 'react';
import { CryptoData } from '../types';
import HeatmapDisplay from './HeatmapDisplay';

interface HeatmapViewProps {
  data: CryptoData[];
}

const HeatmapView: React.FC<HeatmapViewProps> = ({ data: cryptoData }) => {
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
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">🔥 Heatmap del Mercado</h2>
        <p className="text-gray-400 mb-4">
          Mostrando {cryptoData.length} criptomonedas con rendimiento y volumen en tiempo real
        </p>
        <HeatmapDisplay data={cryptoData} />
      </div>
    </div>
  );
};

export default HeatmapView;