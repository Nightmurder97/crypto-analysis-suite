import React, { useMemo, useEffect, useState } from 'react';
import { CryptoData } from '../types';
import { 
  getCategoriesStatistics,
  loadCryptoCategoriesData
} from '../utils/csvCategoriesService';

interface SectorHeatmapViewProps {
  data: (CryptoData & { category: string })[];
}

// 🏢 Interfaz para datos de sector enriquecidos
interface SectorData {
  name: string;
  count: number;
  avgChange: number;
  totalMarketCap: number;
  totalVolume: number;
  topPerformers: (CryptoData & { category: string })[];
  worstPerformers: (CryptoData & { category: string })[];
  cryptos: (CryptoData & { category: string })[];
  csvInfo?: {
    originalCategories: string[];
    avgPrice: number;
    totalSupply: number;
  };
}

const SectorHeatmapView: React.FC<SectorHeatmapViewProps> = ({ data: enrichedData }) => {
  const [csvStats, setCsvStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Cargar estadísticas del CSV
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const csvData = await loadCryptoCategoriesData();
        if (csvData.length > 0) {
          const stats = getCategoriesStatistics(csvData);
          setCsvStats(stats);
        }
      } catch (err: any) {
        console.error('Error al cargar estadísticas CSV:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  // 📊 Análisis sectorial basado en datos enriquecidos
  const sectorAnalysis = useMemo(() => {
    if (enrichedData.length === 0) return [];

    // Agrupar por categorías reales del CSV
    const sectorGroups: { [key: string]: (CryptoData & { category: string })[] } = {};
    
    enrichedData.forEach(crypto => {
      const category = crypto.category || 'Others';
      if (!sectorGroups[category]) {
        sectorGroups[category] = [];
      }
      sectorGroups[category].push(crypto);
    });

    // Calcular métricas para cada sector
    const sectors: SectorData[] = Object.entries(sectorGroups)
      .map(([sectorName, cryptos]) => {
        const validCryptos = cryptos.filter(c => c.price_change_percentage_24h !== null);
        
        if (validCryptos.length === 0) {
          return {
            name: sectorName,
            count: cryptos.length,
            avgChange: 0,
            totalMarketCap: 0,
            totalVolume: 0,
            topPerformers: [],
            worstPerformers: [],
            cryptos: cryptos
          };
        }

        // Cálculos de métricas
        const avgChange = validCryptos.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / validCryptos.length;
        const totalMarketCap = validCryptos.reduce((sum, c) => sum + (c.market_cap || 0), 0);
        const totalVolume = validCryptos.reduce((sum, c) => sum + (c.total_volume || 0), 0);
        
        // Ordenar por rendimiento
        const sortedByPerformance = [...validCryptos]
          .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
        
        const topPerformers = sortedByPerformance.slice(0, 5);
        const worstPerformers = sortedByPerformance.slice(-3).reverse();

        return {
          name: sectorName,
          count: cryptos.length,
          avgChange,
          totalMarketCap,
          totalVolume,
          topPerformers,
          worstPerformers,
          cryptos: cryptos
        };
      })
      .filter(sector => sector.count > 0)  // Solo sectores con datos
      .sort((a, b) => b.avgChange - a.avgChange);  // Ordenar por rendimiento

    return sectors;
  }, [enrichedData]);

  // 🎨 Función para obtener colores de sector mejorados
  const getSectorColor = (avgChange: number): string => {
    if (avgChange > 10) return 'from-emerald-400 via-green-500 to-emerald-600';
    if (avgChange > 5) return 'from-green-400 via-green-500 to-green-600';
    if (avgChange > 2) return 'from-green-300 via-green-400 to-green-500';
    if (avgChange > 0) return 'from-yellow-300 via-green-400 to-green-500';
    if (avgChange > -2) return 'from-yellow-400 via-orange-400 to-yellow-500';
    if (avgChange > -5) return 'from-orange-400 via-red-400 to-orange-500';
    if (avgChange > -10) return 'from-red-400 via-red-500 to-red-600';
    return 'from-red-500 via-red-600 to-red-700';
  };

  // 📈 Función para formatear números grandes
  const formatBigNumber = (value: number): string => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  // 🔄 Estados de carga y error
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-gray-300">Cargando análisis sectorial...</p>
        <p className="text-gray-500 text-sm">Procesando categorías del CSV</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500 text-red-300 p-6 rounded-lg">
        <h3 className="font-semibold text-red-200 text-xl mb-2">Error en análisis sectorial</h3>
        <p>{error}</p>
        <p className="text-sm mt-2 text-red-400">
          Usando clasificación manual como respaldo
        </p>
      </div>
    );
  }

  if (sectorAnalysis.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No hay datos disponibles para análisis sectorial</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del CSV */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">
              🏢 Análisis Sectorial Avanzado
            </h2>
            <p className="text-gray-300">
              Análisis de {enrichedData.length} criptomonedas usando categorías reales del CSV
            </p>
            {csvStats && (
              <p className="text-gray-400 text-sm mt-1">
                {csvStats.totalCategories} categorías únicas • 
                Datos actualizados en tiempo real
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="bg-green-900/30 px-3 py-1 rounded-lg text-green-300 text-sm">
              ✅ CSV Integrado
            </div>
            <div className="bg-blue-900/30 px-3 py-1 rounded-lg text-blue-300 text-sm">
              📊 {sectorAnalysis.length} Sectores
            </div>
          </div>
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">
            {sectorAnalysis.filter(s => s.avgChange > 0).length}
          </div>
          <div className="text-gray-400 text-sm">Sectores en verde</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">
            {sectorAnalysis.filter(s => s.avgChange < 0).length}
          </div>
          <div className="text-gray-400 text-sm">Sectores en rojo</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {sectorAnalysis.length}
          </div>
          <div className="text-gray-400 text-sm">Total sectores</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-400">
            {formatBigNumber(sectorAnalysis.reduce((sum, s) => sum + s.totalMarketCap, 0))}
          </div>
          <div className="text-gray-400 text-sm">Cap. total</div>
        </div>
      </div>

      {/* Ranking de sectores */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">🏆 Ranking de Sectores (24h)</h3>
        <div className="space-y-2">
          {sectorAnalysis.slice(0, 10).map((sector, index) => (
            <div key={sector.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-mono text-sm w-6">#{index + 1}</span>
                <span className="font-semibold text-white">{sector.name}</span>
                <span className="text-gray-400 text-sm">({sector.count} activos)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">{formatBigNumber(sector.totalMarketCap)}</span>
                <span className={`font-bold text-lg ${sector.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid detallado de sectores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sectorAnalysis.map((sector) => (
          <div 
            key={sector.name} 
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {/* Header del sector con gradiente dinámico */}
            <div className={`bg-gradient-to-r ${getSectorColor(sector.avgChange)} p-4`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{sector.name}</h3>
                  <p className="text-white/90 text-sm">{sector.count} activos</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
                  </div>
                  <div className="text-white/75 text-xs">Promedio 24h</div>
                </div>
              </div>
            </div>
            
            {/* Métricas del sector */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">Market Cap:</span>
                  <span className="font-semibold text-white">
                    {formatBigNumber(sector.totalMarketCap)}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400 block">Volumen 24h:</span>
                  <span className="font-semibold text-white">
                    {formatBigNumber(sector.totalVolume)}
                  </span>
                </div>
              </div>
              
              {/* Top performers del sector */}
              {sector.topPerformers.length > 0 && (
                <div className="border-t border-gray-700 pt-3">
                  <h4 className="text-sm font-semibold text-green-300 mb-2">
                    🚀 Top Performers:
                  </h4>
                  <div className="space-y-1">
                    {sector.topPerformers.slice(0, 3).map((crypto) => (
                      <div key={crypto.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 truncate flex-1">
                          {crypto.name} ({crypto.symbol.toUpperCase()})
                        </span>
                        <span className="font-bold text-green-400 ml-2">
                          +{(crypto.price_change_percentage_24h || 0).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Worst performers del sector */}
              {sector.worstPerformers.length > 0 && sector.avgChange < 0 && (
                <div className="border-t border-gray-700 pt-3">
                  <h4 className="text-sm font-semibold text-red-300 mb-2">
                    📉 Peores:
                  </h4>
                  <div className="space-y-1">
                    {sector.worstPerformers.slice(0, 2).map((crypto) => (
                      <div key={crypto.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 truncate flex-1">
                          {crypto.symbol.toUpperCase()}
                        </span>
                        <span className="font-bold text-red-400 ml-2">
                          {(crypto.price_change_percentage_24h || 0).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Insights del mercado */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-cyan-300 mb-4">🧠 Insights del Mercado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-cyan-300 mb-2">📈 Mejor Sector:</h4>
            <p className="text-gray-300">
              <strong>{sectorAnalysis[0]?.name}</strong> lidera con{' '}
              <span className="text-green-400 font-bold">
                +{sectorAnalysis[0]?.avgChange.toFixed(2)}%
              </span>
              {' '}promedio ({sectorAnalysis[0]?.count} activos)
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-300 mb-2">� Peor Sector:</h4>
            <p className="text-gray-300">
              <strong>{sectorAnalysis[sectorAnalysis.length - 1]?.name}</strong> con{' '}
              <span className="text-red-400 font-bold">
                {sectorAnalysis[sectorAnalysis.length - 1]?.avgChange.toFixed(2)}%
              </span>
              {' '}promedio
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-300 mb-2">💰 Mayor Capitalización:</h4>
            <p className="text-gray-300">
              <strong>
                {sectorAnalysis.sort((a, b) => b.totalMarketCap - a.totalMarketCap)[0]?.name}
              </strong>{' '}
              con {formatBigNumber(sectorAnalysis.sort((a, b) => b.totalMarketCap - a.totalMarketCap)[0]?.totalMarketCap)}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-300 mb-2">🔥 Mayor Actividad:</h4>
            <p className="text-gray-300">
              <strong>
                {sectorAnalysis.sort((a, b) => b.totalVolume - a.totalVolume)[0]?.name}
              </strong>{' '}
              con {formatBigNumber(sectorAnalysis.sort((a, b) => b.totalVolume - a.totalVolume)[0]?.totalVolume)} en volumen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorHeatmapView;
