import React from 'react';
import { PortfolioSimulation } from '../types';

interface SimulatorViewProps {
  portfolio?: PortfolioSimulation;
}

const SimulatorView: React.FC<SimulatorViewProps> = ({ portfolio: _portfolio }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">🎮 Simulador de Portafolio</h2>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold mb-2">Simulador de Inversiones</h3>
        <p className="text-gray-400 mb-4">
          Simula diferentes estrategias de inversión y analiza riesgos.
        </p>
        <div className="bg-gray-700 p-4 rounded-lg text-sm">
          <p>💰 Asignación de activos</p>
          <p>📊 Análisis de riesgo</p>
          <p>🎯 Backtesting histórico</p>
          <p>📈 Optimización de portafolio</p>
        </div>
      </div>
    </div>
  );
};

export default SimulatorView;
