import React from 'react';
import { MarketStatistics } from '../types';

interface StatisticsViewProps {
  statistics?: MarketStatistics;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ statistics: _statistics }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">📈 Estadísticas del Mercado</h2>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold mb-2">Estadísticas Avanzadas</h3>
        <p className="text-gray-400 mb-4">
          Análisis estadístico completo del mercado de criptomonedas.
        </p>
        <div className="bg-gray-700 p-4 rounded-lg text-sm">
          <p>📊 Distribución de rendimientos</p>
          <p>📈 Análisis de volatilidad</p>
          <p>🎯 Métricas de correlación</p>
          <p>📉 Estadísticas descriptivas</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
