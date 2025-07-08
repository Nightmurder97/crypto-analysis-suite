import React, { useMemo } from 'react';
import { CryptoData } from '../types';

interface StatisticsViewProps {
  data: CryptoData[];
}

const STABLECOIN_KEYWORDS = ['stablecoin', 'usd', 'dai', 'tether', 'busd', 'usdc', 'fdusd', 'usdt', 'usdp', 'pyusd', 'tusd', 'eurc', 'eurs'];

// Volumen mínimo para ser considerado en los rankings (1 millón USD)
const MIN_VOLUME_USD = 1_000_000;

const StatisticsView: React.FC<StatisticsViewProps> = ({ data }) => {
  const statistics = useMemo(() => {
    const validData = data.filter(crypto => 
      crypto.price_change_percentage_24h !== null && 
      crypto.total_volume !== null &&
      crypto.market_cap !== null &&
      crypto.total_volume >= MIN_VOLUME_USD // Filtro de volumen mínimo
    );

    if (validData.length === 0) {
      return null;
    }

    // Excluir stablecoins para rankings de volumen
    const nonStablecoinData = validData.filter(crypto => {
      const name = crypto.name.toLowerCase();
      const symbol = crypto.symbol.toLowerCase();
      return !STABLECOIN_KEYWORDS.some(keyword => 
        name.includes(keyword) || symbol.includes(keyword)
      );
    });

    // Cálculos estadísticos
    const changes24h = validData.map(c => c.price_change_percentage_24h!);
    const volumes = nonStablecoinData.map(c => c.total_volume!); // Usar datos sin stablecoins
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

    // Rankings
    const topPerformers = [...validData]
      .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
      .slice(0, 10);

    const bottomPerformers = [...validData]
      .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
      .slice(0, 10);

    const topByVolume = [...nonStablecoinData]
      .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
      .slice(0, 10);

    const worstByVolume = [...nonStablecoinData]
      .filter(crypto => crypto.total_volume! >= MIN_VOLUME_USD) // Filtro adicional para worst by volume
      .sort((a, b) => (a.total_volume || 0) - (b.total_volume || 0))
      .slice(0, 10);

    return {
      total: validData.length,
      avg24h,
      median24h,
      stdDev,
      totalVolume: volumes.reduce((sum, val) => sum + val, 0),
      totalMarketCap: marketCaps.reduce((sum, val) => sum + val, 0),
      distribution,
      topPerformers,
      bottomPerformers,
      topByVolume,
      worstByVolume,
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
          Volumen mínimo: {formatBigNumber(MIN_VOLUME_USD)} •
          Datos actualizados en tiempo real
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className={`text-2xl font-bold ${statistics.avg24h >= 0 ? 'text-success' : 'text-danger'}`}>
            {statistics.avg24h.toFixed(2)}%
          </div>
          <div className="text-gray-400">Cambio promedio 24h</div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className={`text-2xl font-bold ${statistics.median24h >= 0 ? 'text-success' : 'text-danger'}`}>
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
      <div className="bg-neutral-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">📈 Distribución de Rendimientos</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            {[
              { label: 'Ganancia Extrema (>20%)', count: statistics.distribution.extremeGain, color: 'bg-green-500' },
              { label: 'Ganancia Fuerte (5-20%)', count: statistics.distribution.strongGain, color: 'bg-green-400' },
              { label: 'Ganancia Moderada (0-5%)', count: statistics.distribution.moderateGain, color: 'bg-green-300' },
              { label: 'Neutral (0%)', count: statistics.distribution.neutral, color: 'bg-gray-400' },
              { label: 'Pérdida Moderada (0 a -5%)', count: statistics.distribution.moderateLoss, color: 'bg-red-300' },
              { label: 'Pérdida Fuerte (-5 a -20%)', count: statistics.distribution.strongLoss, color: 'bg-red-400' },
              { label: 'Pérdida Extrema (<-20%)', count: statistics.distribution.extremeLoss, color: 'bg-red-500' },
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
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {formatBigNumber(statistics.totalMarketCap)}
            </div>
            <div className="text-gray-400">Capitalización total</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {((statistics.distribution.extremeGain + statistics.distribution.strongGain + statistics.distribution.moderateGain) / statistics.total * 100).toFixed(1)}%
            </div>
            <div className="text-gray-400">Activos en positivo</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {((statistics.distribution.moderateLoss + statistics.distribution.strongLoss + statistics.distribution.extremeLoss) / statistics.total * 100).toFixed(1)}%
            </div>
            <div className="text-gray-400">Activos en negativo</div>
          </div>
        </div>
      </div>

      {/* Rankings de Rendimiento - TAMAÑO REDUCIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 10 Performers */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-success mb-3">🚀 Top 10 Ganadores</h3>
          <div className="space-y-1">
            {statistics.topPerformers.map((crypto, index) => (
              <div key={crypto.id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-5 text-center">#{index + 1}</span>
                  <img src={crypto.image} alt={crypto.name} className="w-5 h-5 rounded-full flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm text-gray-100 truncate block">{crypto.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <span className="font-semibold text-sm text-success ml-2">
                  +{(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 10 Performers */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-danger mb-3">📉 Top 10 Perdedores</h3>
          <div className="space-y-1">
            {statistics.bottomPerformers.map((crypto, index) => (
              <div key={crypto.id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-5 text-center">#{index + 1}</span>
                  <img src={crypto.image} alt={crypto.name} className="w-5 h-5 rounded-full flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm text-gray-100 truncate block">{crypto.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <span className="font-semibold text-sm text-danger ml-2">
                  {(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings por Volumen - TAMAÑO REDUCIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 10 por Volumen */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-blue-400 mb-3">🔊 Top 10 por Volumen</h3>
          <div className="space-y-1">
            {statistics.topByVolume.map((crypto, index) => (
              <div key={crypto.id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-5 text-center">#{index + 1}</span>
                  <img src={crypto.image} alt={crypto.name} className="w-5 h-5 rounded-full flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm text-gray-100 truncate block">{crypto.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <span className="font-semibold text-sm text-blue-300 ml-2">
                  {formatBigNumber(crypto.total_volume || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Worst 10 por Volumen */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-purple-400 mb-3">🔇 Menor Volumen</h3>
          <div className="space-y-1">
            {statistics.worstByVolume.map((crypto, index) => (
              <div key={crypto.id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-5 text-center">#{index + 1}</span>
                  <img src={crypto.image} alt={crypto.name} className="w-5 h-5 rounded-full flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm text-gray-100 truncate block">{crypto.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <span className="font-semibold text-sm text-purple-300 ml-2">
                  {formatBigNumber(crypto.total_volume || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights automáticos */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-cyan-300 mb-4">🧠 Insights del Mercado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-cyan-300 mb-2">📊 Análisis de Volatilidad:</h4>
            <p className="text-gray-300">
              La desviación estándar del {statistics.stdDev.toFixed(2)}% indica una volatilidad {' '}
              {statistics.stdDev > 10 ? 'alta' : statistics.stdDev > 5 ? 'moderada' : 'baja'} en el mercado.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-300 mb-2">💡 Tendencia General:</h4>
            <p className="text-gray-300">
              {statistics.avg24h > 0 ? 'Mercado alcista' : 'Mercado bajista'} con promedio de {' '}
              <span className={statistics.avg24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                {statistics.avg24h.toFixed(2)}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
