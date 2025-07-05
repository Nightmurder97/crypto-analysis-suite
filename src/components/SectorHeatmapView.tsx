import React from 'react';
import { SectorAnalysisData } from '../types';

interface SectorHeatmapViewProps {
  data?: SectorAnalysisData[];
}

const SectorHeatmapView: React.FC<SectorHeatmapViewProps> = ({ data: _data = [] }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">🏢 Análisis Sectorial</h2>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-semibold mb-2">Heatmap Sectorial en Desarrollo</h3>
        <p className="text-gray-400 mb-4">
          Este componente mostrará el análisis sectorial basado en datos CSV.
        </p>
        <div className="bg-gray-700 p-4 rounded-lg text-sm">
          <p>📊 Análisis por sectores (DeFi, Layer 1, Gaming, etc.)</p>
          <p>🎯 Performance comparativa entre sectores</p>
          <p>📈 Distribución de capitalización de mercado</p>
          <p>🔥 Heatmap interactivo con gradientes RGB</p>
        </div>
      </div>
    </div>
  );
};

export default SectorHeatmapView;
