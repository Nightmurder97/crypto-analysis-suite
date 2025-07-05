import React from 'react';
import { AIAnalysisResult } from '../types';

interface ReportsViewProps {
  analysis?: AIAnalysisResult;
}

const ReportsView: React.FC<ReportsViewProps> = ({ analysis: _analysis }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">📑 Reportes y Análisis IA</h2>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-xl font-semibold mb-2">Análisis con Inteligencia Artificial</h3>
        <p className="text-gray-400 mb-4">
          Reportes profesionales generados con IA en español.
        </p>
        <div className="bg-gray-700 p-4 rounded-lg text-sm">
          <p>🤖 Análisis IA avanzado en español</p>
          <p>📊 Reportes ejecutivos</p>
          <p>💡 Recomendaciones de inversión</p>
          <p>📈 Análisis de sentimiento del mercado</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
