// src/components/SectorHeatmapView.tsx - Análisis dinámico por sectores

import React, { useMemo } from 'react';
import { CryptoData } from '../types';

interface SectorHeatmapViewProps {
  data: CryptoData[];
}

// 🏢 Clasificación de sectores basada en datos reales
const classifyCryptosBySector = (cryptos: CryptoData[]) => {
  const sectors: { [key: string]: CryptoData[] } = {
    'Layer 1': [],
    'DeFi': [],
    'Layer 2': [],
    'AI & Big Data': [],
    'Gaming & Metaverse': [],
    'Meme Coins': [],
    'Infrastructure': [],
    'Stablecoins': [],
    'Exchange Tokens': [],
    'Others': []
  };

  cryptos.forEach(crypto => {
    const name = crypto.name.toLowerCase();
    const symbol = crypto.symbol.toLowerCase();

    // Layer 1 Blockchains
    if (['bitcoin', 'ethereum', 'cardano', 'solana', 'avalanche', 'polkadot', 'near', 'cosmos', 'algorand', 'tezos'].some(term => name.includes(term)) ||
        ['btc', 'eth', 'ada', 'sol', 'avax', 'dot', 'near', 'atom', 'algo', 'xtz'].includes(symbol)) {
      sectors['Layer 1'].push(crypto);
    }
    // DeFi
    else if (['uniswap', 'chainlink', 'aave', 'compound', 'makerdao', 'curve', 'sushiswap', 'pancakeswap', 'yearn'].some(term => name.includes(term)) ||
             ['uni', 'link', 'aave', 'comp', 'mkr', 'crv', 'sushi', 'cake', 'yfi'].includes(symbol)) {
      sectors['DeFi'].push(crypto);
    }
    // Layer 2
    else if (['polygon', 'arbitrum', 'optimism', 'loopring', 'immutable'].some(term => name.includes(term)) ||
             ['matic', 'arb', 'op', 'lrc', 'imx'].includes(symbol)) {
      sectors['Layer 2'].push(crypto);
    }
    // AI & Big Data
    else if (['fetch', 'singularitynet', 'ocean', 'render', 'akash', 'artificial'].some(term => name.includes(term)) ||
             ['fet', 'agix', 'ocean', 'rndr', 'akt'].includes(symbol)) {
      sectors['AI & Big Data'].push(crypto);
    }
    // Gaming & Metaverse
    else if (['axie', 'decentraland', 'sandbox', 'gala', 'enjin', 'immutable', 'gaming'].some(term => name.includes(term)) ||
             ['axs', 'mana', 'sand', 'gala', 'enj', 'imx'].includes(symbol)) {
      sectors['Gaming & Metaverse'].push(crypto);
    }
    // Meme Coins
    else if (['dogecoin', 'shiba', 'pepe', 'floki', 'doge', 'meme'].some(term => name.includes(term)) ||
             ['doge', 'shib', 'pepe', 'floki'].includes(symbol)) {
      sectors['Meme Coins'].push(crypto);
    }
    // Infrastructure
    else if (['filecoin', 'helium', 'arweave', 'storj', 'theta'].some(term => name.includes(term)) ||
             ['fil', 'hnt', 'ar', 'storj', 'theta'].includes(symbol)) {
      sectors['Infrastructure'].push(crypto);
    }
    // Stablecoins
    else if (['tether', 'usdc', 'busd', 'dai', 'usdt', 'stable'].some(term => name.includes(term)) ||
             ['usdt', 'usdc', 'busd', 'dai', 'tusd'].includes(symbol)) {
      sectors['Stablecoins'].push(crypto);
    }
    // Exchange Tokens
    else if (['binance', 'kucoin', 'huobi', 'okx', 'ftx', 'exchange'].some(term => name.includes(term)) ||
             ['bnb', 'kcs', 'ht', 'okb', 'ftt'].includes(symbol)) {
      sectors['Exchange Tokens'].push(crypto);
    }
    else {
      sectors['Others'].push(crypto);
    }
  });

  return sectors;
};

const SectorHeatmapView: React.FC<SectorHeatmapViewProps> = ({ data }) => {
  const sectorAnalysis = useMemo(() => {
    const sectors = classifyCryptosBySector(data);
    
    return Object.entries(sectors)
      .filter(([_, cryptos]) => cryptos.length > 0)
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
            cryptos: cryptos
          };
        }

        const avgChange = validCryptos.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / validCryptos.length;
        const totalMarketCap = validCryptos.reduce((sum, c) => sum + (c.market_cap || 0), 0);
        const totalVolume = validCryptos.reduce((sum, c) => sum + (c.total_volume || 0), 0);
        
        const topPerformers = [...validCryptos]
          .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
          .slice(0, 3);

        return {
          name: sectorName,
          count: cryptos.length,
          avgChange,
          totalMarketCap,
          totalVolume,
          topPerformers,
          cryptos: cryptos
        };
      })
      .sort((a, b) => b.avgChange - a.avgChange);
  }, [data]);

  const getSectorColor = (avgChange: number): string => {
    if (avgChange > 5) return 'from-green-500 to-emerald-600';
    if (avgChange > 0) return 'from-green-400 to-green-500';
    if (avgChange > -5) return 'from-yellow-400 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  const formatBigNumber = (value: number): string => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No hay datos disponibles para análisis sectorial</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">🏢 Análisis Sectorial</h2>
        <p className="text-gray-400">
          Análisis dinámico de {data.length} criptomonedas agrupadas por sectores • 
          Actualizado con datos en tiempo real
        </p>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">
            {sectorAnalysis.filter(s => s.avgChange > 0).length}
          </div>
          <div className="text-gray-400">Sectores en verde</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">
            {sectorAnalysis.filter(s => s.avgChange < 0).length}
          </div>
          <div className="text-gray-400">Sectores en rojo</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {sectorAnalysis.length}
          </div>
          <div className="text-gray-400">Sectores totales</div>
        </div>
      </div>

      {/* Grid de sectores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sectorAnalysis.map((sector) => (
          <div 
            key={sector.name} 
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Header del sector con gradiente */}
            <div className={`bg-gradient-to-r ${getSectorColor(sector.avgChange)} p-4`}>
              <h3 className="text-lg font-bold text-white">{sector.name}</h3>
              <p className="text-white/80 text-sm">{sector.count} activos</p>
            </div>
            
            {/* Métricas del sector */}
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Cambio promedio 24h:</span>
                <span className={`font-bold ${sector.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Cap:</span>
                <span className="font-semibold text-white">
                  {formatBigNumber(sector.totalMarketCap)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Volumen 24h:</span>
                <span className="font-semibold text-white">
                  {formatBigNumber(sector.totalVolume)}
                </span>
              </div>
              
              {/* Top performers del sector */}
              {sector.topPerformers.length > 0 && (
                <div className="border-t border-gray-700 pt-3">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Performers:</h4>
                  <div className="space-y-1">
                    {sector.topPerformers.map((crypto) => (
                      <div key={crypto.id} className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 truncate">
                          {crypto.symbol.toUpperCase()}
                        </span>
                        <span className={`font-bold ${(crypto.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(crypto.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
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

      {/* Análisis temporal */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">📊 Análisis Comparativo</h3>
        <div className="space-y-3">
          <div>
            <strong className="text-green-400">Mejor sector (24h): </strong>
            {sectorAnalysis[0]?.name} (+{sectorAnalysis[0]?.avgChange.toFixed(2)}%)
          </div>
          <div>
            <strong className="text-red-400">Peor sector (24h): </strong>
            {sectorAnalysis[sectorAnalysis.length - 1]?.name} ({sectorAnalysis[sectorAnalysis.length - 1]?.avgChange.toFixed(2)}%)
          </div>
          <div>
            <strong className="text-cyan-400">Sector más activo (volumen): </strong>
            {sectorAnalysis.sort((a, b) => b.totalVolume - a.totalVolume)[0]?.name} 
            ({formatBigNumber(sectorAnalysis.sort((a, b) => b.totalVolume - a.totalVolume)[0]?.totalVolume)})
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorHeatmapView;