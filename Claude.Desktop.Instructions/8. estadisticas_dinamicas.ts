// src/components/StatisticsView.tsx - Estadísticas dinámicas con gráficos

import React, { useMemo } from 'react';
import { CryptoData } from '../types';

interface StatisticsViewProps {
  data: CryptoData[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ data }) => {
  const statistics = useMemo(() => {
    const validData = data.filter(crypto => 
      crypto.price_change_percentage_24h !== null &&
      crypto.total_volume !== null &&
      crypto.market_cap !== null
    );

    if (validData.length === 0) {
      return null;
    }

    // Cálculos estadísticos
    const changes24h = validData.map(c => c.price_change_percentage_24h!);
    const volumes = validData.map(c => c.total_volume!);
    const marketCaps = validData.map(c => c.market_cap!);

    // Estadísticas básicas
    const avg24h = changes24h.reduce((sum, val) => sum + val, 0) / changes24h.length;
    const median24h = [...changes24h].sort((a, b) => a - b)[Math.floor(changes24h.length / 2)];
    
    // Desviación estándar
    const variance = changes24h.reduce((sum, val) => sum + Math.pow(val - avg24h, 2), 0) / changes24h.length;
    const stdDev = Math.sqrt(variance);

    // Distribución por rangos
    const distribution = {
      extremeGain: changes24h.filter(c => c > 20).length,
      strongGain: changes24h.filter(c => c > 5 && c <= 20).length,
      moderateGain: changes24h.filter(c => c > 0 && c <= 5).length,
      neutral: changes24h.filter(c => c === 0).length,
      moderateLoss: changes24h.filter(c => c < 0 && c >= -5).length,
      strongLoss: changes24h.filter(c => c < -5 && c >= -20).length,
      extremeLoss: changes24h.filter(c => c < -20).length,
    };

    // Análisis de volumen
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
    const avgVolume = totalVolume / volumes.length;
    const highVolumeThreshold = avgVolume * 10;
    const highVolumeAssets = validData.filter(c => c.total_volume! > highVolumeThreshold);

    // Top y bottom performers
    const sortedByChange = [...validData].sort((a, b) => 
      (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    );

    const topPerformers = sortedByChange.slice(0, 10);
    const bottomPerformers = sortedByChange.slice(-10).reverse();

    // Análisis de capitalización
    const totalMarketCap = marketCaps.reduce((sum, cap) => sum + cap, 0);
    const largeCapThreshold = 10_000_000_000; // $10B
    const midCapThreshold = 1_000_000_000;   // $1B
    
    const largeCap = validData.filter(c => c.market_cap! >= largeCapThreshold);
    const midCap = validData.filter(c => c.market_cap! >= midCapThreshold && c.market_cap! < largeCapThreshold);
    const smallCap = validData.filter(c => c.market_cap! < midCapThreshold);

    return {
      total: validData.length,
      avg24h,
      median24h,
      stdDev,
      distribution,
      totalVolume,
      avgVolume,
      highVolumeAssets,
      topPerformers,
      bottomPerformers,
      totalMarketCap,
      largeCap,
      midCap,
      smallCap,
      validData
    };
  }, [data]);

  const formatBigNumber = (value: number): string => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getDistributionPercentage = (count: number, total: number): number => {
    return (count / total) * 100;
  };

  if (!statistics) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No hay datos suficientes para generar estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">📊 Estadísticas del Mercado</h2>
        <p className="text-gray-400">
          Análisis estadístico de {statistics.total} criptomonedas • 
          Datos actualizados en tiempo real
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {statistics.avg24h.toFixed(2)}%
          </div>
          <div className="text-gray-400">Cambio promedio 24h</div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">
            {statistics.median24h.toFixed(2)}%
          </div>
          <div className="text-gray-400">Cambio mediano 24h</div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-400">
            {statistics.stdDev.toFixed(2)}%
          </div>
          <div className="text-gray-400">Desviación estándar</div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">
            {formatBigNumber(statistics.totalVolume)}
          </div>
          <div className="text-gray-400">Volumen total 24h</div>
        </div>
      </div>

      {/* Distribución de rendimientos */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">📈 Distribución de Rendimientos 24h</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de barras simple */}
          <div className="space-y-3">
            {[
              { label: 'Ganancia extrema (>20%)', count: statistics.distribution.extremeGain, color: 'bg-emerald-500' },
              { label: 'Ganancia fuerte (5-20%)', count: statistics.distribution.strongGain, color: 'bg-green-500' },
              { label: 'Ganancia moderada (0-5%)', count: statistics.distribution.moderateGain, color: 'bg-green-400' },
              { label: 'Neutral (0%)', count: statistics.distribution.neutral, color: 'bg-yellow-500' },
              { label: 'Pérdida moderada (0 a -5%)', count: statistics.distribution.moderateLoss, color: 'bg-orange-500' },
              { label: 'Pérdida fuerte (-5 a -20%)', count: statistics.distribution.strongLoss, color: 'bg-red-500' },
              { label: 'Pérdida extrema (<-20%)', count: statistics.distribution.extremeLoss, color: 'bg-red-600' },
            ].map((item) => {
              const percentage = getDistributionPercentage(item.count, statistics.total);
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-gray-300 truncate">{item.label}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-300">
                    {item.count} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Resumen visual */}
          <div className="flex flex-col justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {statistics.distribution.extremeGain + statistics.distribution.strongGain + statistics.distribution.moderateGain}
              </div>
              <div className="text-gray-400 mb-4">Activos en verde</div>
              
              <div className="text-4xl font-bold text-red-400 mb-2">
                {statistics.distribution.moderateLoss + statistics.distribution.strongLoss + statistics.distribution.extremeLoss}
              </div>
              <div className="text-gray-400">Activos en rojo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis por capitalización */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">💰 Análisis por Capitalización</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400">{statistics.largeCap.length}</div>
            <div className="text-gray-400 text-sm">Large Cap (>$10B)</div>
            <div className="text-xs text-gray-500 mt-1">
              {formatBigNumber(statistics.largeCap.reduce((sum, c) => sum + (c.market_cap || 0), 0))}
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{statistics.midCap.length}</div>
            <div className="text-gray-400 text-sm">Mid Cap ($1B-$10B)</div>
            <div className="text-xs text-gray-500 mt-1">
              {formatBigNumber(statistics.midCap.reduce((sum, c) => sum + (c.market_cap || 0), 0))}
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{statistics.smallCap.length}</div>
            <div className="text-gray-400 text-sm">Small Cap (<$1B)</div>
            <div className="text-xs text-gray-500 mt-1">
              {formatBigNumber(statistics.smallCap.reduce((sum, c) => sum + (c.market_cap || 0), 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Top/Bottom performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performers */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-green-400 mb-4">🚀 Top 10 Performers</h3>
          <div className="space-y-2">
            {statistics.topPerformers.map((crypto, index) => (
              <div key={crypto.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                  <span className="font-semibold text-white">{crypto.symbol.toUpperCase()}</span>
                  <span className="text-gray-400 text-sm truncate">{crypto.name}</span>
                </div>
                <span className="font-bold text-green-400">
                  +{(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom performers */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-red-400 mb-4">📉 Bottom 10 Performers</h3>
          <div className="space-y-2">
            {statistics.bottomPerformers.map((crypto, index) => (
              <div key={crypto.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                  <span className="font-semibold text-white">{crypto.symbol.toUpperCase()}</span>
                  <span className="text-gray-400 text-sm truncate">{crypto.name}</span>
                </div>
                <span className="font-bold text-red-400">
                  {(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights automáticos */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-cyan-300 mb-4">🧠 Insights Automáticos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-cyan-300">Volatilidad del mercado:</strong>
            <p className="text-gray-300 mt-1">
              {statistics.stdDev > 15 ? 'Alta volatilidad' : 
               statistics.stdDev > 8 ? 'Volatilidad moderada' : 'Baja volatilidad'} 
              con una desviación estándar de {statistics.stdDev.toFixed(2)}%
            </p>
          </div>
          
          <div>
            <strong className="text-cyan-300">Sentimiento del mercado:</strong>
            <p className="text-gray-300 mt-1">
              {statistics.avg24h > 2 ? 'Muy alcista' :
               statistics.avg24h > 0 ? 'Alcista' :
               statistics.avg24h > -2 ? 'Bajista' : 'Muy bajista'} 
              con un cambio promedio de {statistics.avg24h.toFixed(2)}%
            </p>
          </div>
          
          <div>
            <strong className="text-cyan-300">Actividad de trading:</strong>
            <p className="text-gray-300 mt-1">
              {statistics.highVolumeAssets.length} activos con volumen excepcional 
              (>{formatBigNumber(statistics.avgVolume * 10)})
            </p>
          </div>
          
          <div>
            <strong className="text-cyan-300">Distribución de caps:</strong>
            <p className="text-gray-300 mt-1">
              {((statistics.largeCap.length / statistics.total) * 100).toFixed(1)}% large-cap, 
              {((statistics.midCap.length / statistics.total) * 100).toFixed(1)}% mid-cap, 
              {((statistics.smallCap.length / statistics.total) * 100).toFixed(1)}% small-cap
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;