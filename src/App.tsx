import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { analyzeCryptoData } from './services/geminiService'; // Asumiendo que esta función existe y está adaptada
import { fetchCryptoData } from './utils/apiClient';
import { exportDataToCsv } from './utils/csvExporter';
import { CryptoData, HeatmapMetric } from './types';

// Importación de todos los componentes de vista
import CryptoTable from './components/CryptoTable';
import HeatmapDisplay from './components/HeatmapDisplay';
import ClassicHeatmapDisplay from './components/ClassicHeatmapDisplay';
import SectorHeatmapView from './components/SectorHeatmapView';
import StatisticsView from './components/StatisticsView';
import AnalysisSection from './components/AnalysisSection';
import ReportsView from './components/ReportsView';
import PaginationControls from './components/PaginationControls';
import HeatmapControls from './components/HeatmapControls';

// Importación de iconos
import {
  TableCellsIcon, ChartBarIcon, SquaresPlusIcon, PresentationChartLineIcon,
  DocumentTextIcon, LightBulbIcon, ChartPieIcon, LoadingIcon, ErrorIcon, ArrowDownTrayIcon
} from './components/IconComponents';

type ActiveTab = 'overview' | 'marketHeatmap' | 'classicHeatmap' | 'sectorHeatmap' | 'statistics' | 'aiAnalysis' | 'reports';

const STABLECOIN_KEYWORDS = ['stablecoin', 'usd', 'dai', 'tether', 'busd', 'usdc', 'fdusd', 'usdt', 'usdp', 'pyusd', 'tusd', 'eurc', 'eurs'];
const HEATMAP_ITEMS_PER_PAGE = 250;
const CLASSIC_HEATMAP_ITEMS_PER_PAGE = 250;

const App: React.FC = () => {
  const [allCryptoData, setAllCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [excludeStablecoins, setExcludeStablecoins] = useState<boolean>(true);

  // Estados para paginación y controles
  const [currentHeatmapPage, setCurrentHeatmapPage] = useState<number>(1);
  const [selectedClassicHeatmapMetric, setSelectedClassicHeatmapMetric] = useState<HeatmapMetric>('price_change_percentage_24h');
  const [currentClassicHeatmapPage, setCurrentClassicHeatmapPage] = useState<number>(1);
  
  // Estados para Análisis IA
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedCryptos, setSelectedCryptos] = useState<CryptoData[]>([]);

  // Carga de datos inicial (~1000 tokens)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCryptoData();
        setAllCryptoData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredCryptoData = useMemo(() => {
    if (!excludeStablecoins) return allCryptoData;
    return allCryptoData.filter(coin => 
      !STABLECOIN_KEYWORDS.some(keyword => 
        coin.name.toLowerCase().includes(keyword) || coin.symbol.toLowerCase().includes(keyword)
      )
    );
  }, [allCryptoData, excludeStablecoins]);

  // Lógica de paginación para los diferentes heatmaps
  const paginatedHeatmapData = useMemo(() => {
    const startIndex = (currentHeatmapPage - 1) * HEATMAP_ITEMS_PER_PAGE;
    return filteredCryptoData.slice(startIndex, startIndex + HEATMAP_ITEMS_PER_PAGE);
  }, [filteredCryptoData, currentHeatmapPage]);

  const totalHeatmapPages = useMemo(() => Math.max(1, Math.ceil(filteredCryptoData.length / HEATMAP_ITEMS_PER_PAGE)), [filteredCryptoData]);

  const paginatedClassicHeatmapData = useMemo(() => {
    const startIndex = (currentClassicHeatmapPage - 1) * CLASSIC_HEATMAP_ITEMS_PER_PAGE;
    return filteredCryptoData.slice(startIndex, startIndex + CLASSIC_HEATMAP_ITEMS_PER_PAGE);
  }, [filteredCryptoData, currentClassicHeatmapPage]);

  const totalClassicHeatmapPages = useMemo(() => Math.max(1, Math.ceil(filteredCryptoData.length / CLASSIC_HEATMAP_ITEMS_PER_PAGE)), [filteredCryptoData]);
  
  // Resetear página si los filtros cambian
  useEffect(() => {
    if (currentHeatmapPage > totalHeatmapPages) setCurrentHeatmapPage(1);
    if (currentClassicHeatmapPage > totalClassicHeatmapPages) setCurrentClassicHeatmapPage(1);
  }, [filteredCryptoData, totalHeatmapPages, currentHeatmapPage, totalClassicHeatmapPages, currentClassicHeatmapPage]);

  // Lógica para análisis con IA
  const handleAnalyzeData = useCallback(async () => {
    if (filteredCryptoData.length === 0) {
      setAnalysisError("No hay datos para analizar.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult('');
    setAnalysisError(null);
    try {
      const result = await analyzeCryptoData(JSON.stringify(filteredCryptoData));
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Error desconocido durante el análisis.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [filteredCryptoData]);

  // Lógica para exportar a CSV
  const handleDownloadCSV = () => {
    const cryptoTableFieldConfigs = [
      { key: 'market_cap_rank', label: 'Rank' },
      { key: 'name', label: 'Name' },
      { key: 'symbol', label: 'Symbol', formatter: (value: string) => value.toUpperCase() },
      { key: 'current_price', label: 'Price', formatter: (value: number) => `$${value.toFixed(2)}` },
      { key: 'price_change_percentage_24h', label: '24h % Change', formatter: (value: number) => `${value.toFixed(2)}%` },
      { key: 'price_change_percentage_7d_in_currency', label: '7d % Change', formatter: (value: number) => `${value.toFixed(2)}%` },
      { key: 'market_cap', label: 'Market Cap', formatter: (value: number) => `$${value.toLocaleString()}` },
      { key: 'total_volume', label: 'Total Volume', formatter: (value: number) => `$${value.toLocaleString()}` },
    ];
    exportDataToCsv(filteredCryptoData, 'crypto_market_data', cryptoTableFieldConfigs);
  };

  // Componente para los botones de pestañas
  const TabButton: React.FC<{ tabId: ActiveTab; label: string; icon: React.ReactNode }> = ({ tabId, label, icon }) => (
    <button 
      onClick={() => setActiveTab(tabId)} 
      className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabId ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  // Renderizado del contenido de la pestaña activa
  const renderTabContent = () => {
    if (isLoading) return <div className="flex justify-center p-10"><LoadingIcon className="w-10 h-10 animate-spin text-sky-400" /></div>;
    if (error) return <div className="text-red-500 text-center p-10">Error: {error}</div>;

    switch (activeTab) {
      case 'overview': return <CryptoTable data={filteredCryptoData} onSelectCrypto={setSelectedCryptos} />;
      case 'marketHeatmap': return (
        <>
          <HeatmapDisplay data={paginatedHeatmapData} />
          <div className="mt-4"><PaginationControls currentPage={currentHeatmapPage} totalPages={totalHeatmapPages} onPageChange={setCurrentHeatmapPage} /></div>
        </>
      );
      case 'classicHeatmap': return (
        <>
          <HeatmapControls selectedMetric={selectedClassicHeatmapMetric} onMetricChange={setSelectedClassicHeatmapMetric} />
          <ClassicHeatmapDisplay data={paginatedClassicHeatmapData} selectedMetric={selectedClassicHeatmapMetric} />
          <div className="mt-4"><PaginationControls currentPage={currentClassicHeatmapPage} totalPages={totalClassicHeatmapPages} onPageChange={setCurrentClassicHeatmapPage} /></div>
        </>
      );
      case 'sectorHeatmap': return <SectorHeatmapView data={filteredCryptoData} />;
      case 'statistics': return <StatisticsView data={filteredCryptoData} />;
      case 'aiAnalysis': return <AnalysisSection onAnalyze={handleAnalyzeData} isAnalyzing={isAnalyzing} analysisResult={analysisResult} analysisError={analysisError} selectedCryptos={selectedCryptos} />;
      case 'reports': return <ReportsView data={filteredCryptoData} />;
      default: return <div>Selecciona una pestaña</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-sky-400">Crypto Analysis Suite</h1>
        <p className="text-slate-400">Análisis de mercado profesional y visualización de datos</p>
      </header>

      <div className="w-full max-w-none mx-auto px-2">
        <nav className="flex flex-wrap justify-center gap-2 mb-6">
          <TabButton tabId="overview" label="Resumen" icon={<TableCellsIcon className="w-5 h-5"/>} />
          <TabButton tabId="marketHeatmap" label="Heatmap" icon={<ChartBarIcon className="w-5 h-5"/>} />
          <TabButton tabId="classicHeatmap" label="Heatmap Clásico" icon={<SquaresPlusIcon className="w-5 h-5"/>} />
          <TabButton tabId="sectorHeatmap" label="Sectores" icon={<ChartPieIcon className="w-5 h-5"/>} />
          <TabButton tabId="statistics" label="Estadísticas" icon={<PresentationChartLineIcon className="w-5 h-5"/>} />
          <TabButton tabId="aiAnalysis" label="Análisis IA" icon={<LightBulbIcon className="w-5 h-5"/>} />
          <TabButton tabId="reports" label="Reportes" icon={<DocumentTextIcon className="w-5 h-5"/>} />
        </nav>

        <div className="bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700 w-full">
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="excludeStablecoins"
                checked={excludeStablecoins}
                onChange={(e) => setExcludeStablecoins(e.target.checked)}
                className="form-checkbox h-5 w-5 text-sky-400 bg-gray-700 border-gray-600 rounded focus:ring-sky-500"
              />
              <span className="text-sm">Excluir Stablecoins</span>
            </label>
            <button 
              type="button"
              onClick={handleDownloadCSV} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm"
            >
              <ArrowDownTrayIcon className="w-5 h-5"/>
              Exportar a CSV
            </button>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
