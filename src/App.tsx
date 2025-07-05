import { useState, useEffect, useCallback, useMemo } from 'react';
import CryptoTable from './components/CryptoTable';
import AnalysisSection from './components/AnalysisSection';
import PaginationControls from './components/PaginationControls';
import HeatmapView from './components/HeatmapView';
import ClassicHeatmapView from './components/ClassicHeatmapView';
import SectorHeatmapView from './components/SectorHeatmapView';
import StatisticsView from './components/StatisticsView';
import SimulatorView from './components/SimulatorView';
import ReportsView from './components/ReportsView';
import { CryptoData, ActiveTab } from './types';
import { useCryptoData } from './utils/apiClient';
import { enrichCryptoDataWithCategories } from './utils/csvCategoriesService';

// 🔥 CAMBIO CRÍTICO: Ahora mostramos TODOS los elementos sin paginación
// const HEATMAP_ITEMS_PER_PAGE = 1000;  // ✅ Era 50, ahora todos
// const CLASSIC_HEATMAP_ITEMS_PER_PAGE = 1000;  // ✅ Era 100, ahora todos

const STABLECOIN_KEYWORDS = ['stablecoin', 'usd', 'dai', 'tether', 'busd', 'usdc', 'fdusd', 'usdt', 'usdp', 'pyusd', 'tusd', 'eurc', 'eurs'];

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCryptoForAnalysis, setSelectedCryptoForAnalysis] = useState<CryptoData[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [excludeStablecoins, setExcludeStablecoins] = useState(false);
  const [allCryptoData, setAllCryptoData] = useState<CryptoData[]>([]);
  const [enrichedData, setEnrichedData] = useState<(CryptoData & { category: string })[]>([]);
  // const [currentHeatmapPage, setCurrentHeatmapPage] = useState(1);
  // const [currentClassicHeatmapPage, setCurrentClassicHeatmapPage] = useState(1);

  // 🚀 Cargar datos de las primeras 1000 criptomonedas
  const { data: cryptoData, isLoading, error } = useCryptoData(1);

  // Actualizar datos cuando se cargan
  useEffect(() => {
    if (cryptoData) {
      setAllCryptoData(cryptoData);
      
      // Enriquecer datos con categorías CSV
      enrichCryptoDataWithCategories(cryptoData)
        .then(enriched => {
          setEnrichedData(enriched);
        })
        .catch(err => {
          console.error('Error al enriquecer datos:', err);
          setEnrichedData(cryptoData.map(crypto => ({ ...crypto, category: 'Others' })));
        });
    }
  }, [cryptoData]);

  // Filtrar datos (excluir stablecoins si está habilitado)
  const filteredCryptoData = useMemo(() => {
    if (!excludeStablecoins) return allCryptoData;
    
    return allCryptoData.filter(crypto => {
      const name = crypto.name.toLowerCase();
      const symbol = crypto.symbol.toLowerCase();
      return !STABLECOIN_KEYWORDS.some(keyword => 
        name.includes(keyword) || symbol.includes(keyword)
      );
    });
  }, [allCryptoData, excludeStablecoins]);

  // Datos paginados para la tabla principal
  const paginatedTableData = useMemo(() => {
    const itemsPerPage = 50; // Para la tabla mantenemos 50 por página
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCryptoData.slice(startIndex, endIndex);
  }, [filteredCryptoData, currentPage]);

  // Datos para heatmaps (TODOS los elementos, sin paginación)
  const paginatedHeatmapData = useMemo(() => {
    return filteredCryptoData;
  }, [filteredCryptoData]);

  const paginatedClassicHeatmapData = useMemo(() => {
    return filteredCryptoData;
  }, [filteredCryptoData]);

  // Cálculo de páginas totales
  const totalPages = useMemo(() => {
    const itemsPerPage = 50;
    return Math.max(1, Math.ceil(filteredCryptoData.length / itemsPerPage));
  }, [filteredCryptoData]);

  // Ya no necesitamos páginas para heatmaps

  // Función para descargar datos
  const handleDownloadData = useCallback((section: string) => {
    const dataToDownload = section === 'heatmap' ? paginatedHeatmapData : filteredCryptoData;
    const csvContent = [
      ['Name', 'Symbol', 'Price', 'Market Cap', 'Volume', '24h Change', 'Category'].join(','),
      ...dataToDownload.map(crypto => [
        crypto.name,
        crypto.symbol,
        crypto.current_price || 0,
        crypto.market_cap || 0,
        crypto.total_volume || 0,
        crypto.price_change_percentage_24h || 0,
        (crypto as any).category || 'Others'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto_${section}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [paginatedHeatmapData, filteredCryptoData]);

  const renderTabContent = () => {
    if (isLoading && allCryptoData.length === 0) { 
      return (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-xl text-gray-300">Cargando datos del mercado...</p>
          <p className="text-sm text-gray-500 mt-2">Obteniendo información de 1000 criptomonedas</p>
        </div>
      );
    }
    
    if (error && allCryptoData.length === 0) { 
      return (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="flex items-start">
            <div className="w-8 h-8 mr-4 flex-shrink-0 text-red-400">❌</div>
            <div>
              <h3 className="font-semibold text-red-200 text-xl mb-2">
                Error al cargar datos
              </h3>
              <p className="text-red-300">{error.message}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="w-full space-y-6">
            {/* Controles superiores */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <label className="flex items-center text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={excludeStablecoins}
                    onChange={(e) => setExcludeStablecoins(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  Excluir stablecoins
                </label>
                <span className="text-gray-400 text-sm">
                  {filteredCryptoData.length} criptomonedas mostradas
                </span>
              </div>
              
              <button 
                type="button" 
                onClick={() => handleDownloadData('overview')} 
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2" 
                disabled={filteredCryptoData.length === 0}
              >
                📥 Descargar CSV ({filteredCryptoData.length} filas)
              </button>
            </div>
            
            {/* Tabla principal con ancho completo */}
            <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <CryptoTable 
                data={paginatedTableData} 
                onSelectCrypto={setSelectedCryptoForAnalysis}
              />
              <div className="p-4 border-t border-gray-700">
                <PaginationControls 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            </div>

            {/* Sección de análisis */}
            <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6">
              <AnalysisSection selectedCryptos={selectedCryptoForAnalysis} allCryptoData={allCryptoData} />
            </div>
          </div>
        );
        
      case 'marketHeatmap':
        return (
          <div className="w-full space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-cyan-400">🔥 Heatmap de Mercado</h2>
                  <p className="text-gray-400">Vista completa sin paginación • {paginatedHeatmapData.length} elementos</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleDownloadData('heatmap')} 
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2" 
                  disabled={paginatedHeatmapData.length === 0}
                >
                  📥 Descargar datos del heatmap
                </button>
              </div>
              
              <HeatmapView data={paginatedHeatmapData} />
              
              {isLoading && (
                <p className="text-center text-cyan-400 text-sm mt-4 animate-pulse">
                  Actualizando datos...
                </p>
              )}
            </div>
          </div>
        );
        
      case 'classicHeatmap':
        return (
          <div className="w-full space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-cyan-400">🎯 Heatmap Clásico</h2>
                  <p className="text-gray-400">Grid completo • {paginatedClassicHeatmapData.length} elementos</p>
                </div>
              </div>
              
              <ClassicHeatmapView data={paginatedClassicHeatmapData} />
            </div>
          </div>
        );
        
      case 'sectorHeatmap':
        return (
          <div className="w-full space-y-6">
            <SectorHeatmapView data={enrichedData} />
          </div>
        );
        
      case 'statistics':
        return (
          <div className="w-full space-y-6">
            <StatisticsView data={allCryptoData} />
          </div>
        );
        
      case 'aiAnalysis':
        return (
          <div className="w-full space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">🤖 Análisis IA Avanzado</h2>
              <AnalysisSection selectedCryptos={allCryptoData.slice(0, 250)} allCryptoData={allCryptoData} />
            </div>
          </div>
        );
        
      case 'simulator':
        return <SimulatorView />;
        
      case 'reports':
        return <ReportsView />;
        
      default:
        return <div className="text-center text-gray-400">Sección en desarrollo</div>;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* Header mejorado con ancho completo */}
      <header className="w-full bg-gray-800 border-b border-gray-700 px-4 py-6">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-cyan-400">
                📈 Crypto Analysis Suite
              </h1>
              <p className="text-gray-400 mt-1">
                Análisis profesional del mercado de criptomonedas • {allCryptoData.length} criptomonedas
              </p>
            </div>
            
            {/* Métricas del mercado en header */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-4 text-sm">
              <div className="bg-gray-700 px-3 py-2 rounded-lg">
                <span className="text-gray-400">Total: </span>
                <span className="text-green-400 font-semibold">{allCryptoData.length}</span>
              </div>
              <div className="bg-gray-700 px-3 py-2 rounded-lg">
                <span className="text-gray-400">Cargando: </span>
                <span className="text-blue-400 font-semibold">{isLoading ? 'Sí' : 'No'}</span>
              </div>
              <div className="bg-gray-700 px-3 py-2 rounded-lg">
                <span className="text-gray-400">Filtrados: </span>
                <span className="text-yellow-400 font-semibold">{filteredCryptoData.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs mejorada */}
      <nav className="w-full bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-full mx-auto">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {[
              { key: 'overview', label: '📊 Resumen', icon: '📊' },
              { key: 'marketHeatmap', label: '🔥 Heatmap', icon: '🔥' },
              { key: 'classicHeatmap', label: '🎯 Heatmap Clásico', icon: '🎯' },
              { key: 'sectorHeatmap', label: '🏢 Sectores', icon: '🏢' },
              { key: 'statistics', label: '📈 Estadísticas', icon: '📈' },
              { key: 'aiAnalysis', label: '🤖 Análisis IA', icon: '🤖' },
              { key: 'simulator', label: '🎮 Simulador', icon: '🎮' },
              { key: 'reports', label: '📑 Reportes', icon: '📑' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as ActiveTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content con ancho completo */}
      <main className="w-full p-4 lg:p-6">
        <div className="max-w-full mx-auto">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer informativo */}
      <footer className="w-full bg-gray-800 border-t border-gray-700 px-4 py-4 mt-8">
        <div className="max-w-full mx-auto text-center text-gray-400 text-sm">
          <p>
            Datos proporcionados por CoinGecko API • Análisis IA por Google Gemini • 
            Actualización automática cada minuto
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
