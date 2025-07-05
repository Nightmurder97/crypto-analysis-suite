import React, { useState } from 'react';
import { useCryptoData } from '../utils/apiClient';
import HeatmapDisplay from './HeatmapDisplay';

const HeatmapView: React.FC = () => {
  const { data: cryptoData, isLoading, error } = useCryptoData(1); // Obtener los primeros 1000

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <span className="ml-3 text-slate-300">Cargando datos para heatmap...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-700/30 border border-red-500 text-red-300 p-4 rounded-lg">
        <h3 className="font-semibold">Error al cargar datos del heatmap</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

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