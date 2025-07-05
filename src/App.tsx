import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { analyzeCryptoData } from './services/geminiService';
import { fetchCoinGeckoMarketData } from './utils/apiClient';
import { LoadingIcon, ErrorIcon, ChartBarIcon, TableCellsIcon, LightBulbIcon, ArrowDownTrayIcon, SquaresPlusIcon, ChartPieIcon, CalculatorIcon, DocumentTextIcon, PresentationChartLineIcon } from './components/IconComponents';
import CryptoTable from './components/CryptoTable';
import HeatmapDisplay from './components/HeatmapDisplay';
import AnalysisSection from './components/AnalysisSection';
import PaginationControls from './components/PaginationControls';
import HeatmapControls from './components/HeatmapControls';
import ClassicHeatmapDisplay from './components/ClassicHeatmapDisplay';
import SectorHeatmapView from './components/SectorHeatmapView';
import StatisticsView from './components/StatisticsView';
import SimulatorView from './components/SimulatorView';
import ReportsView from './components/ReportsView';
import { CryptoData, HeatmapMetric } from './types';
import { exportCryptoDataToXlsx, exportMultiSheetXlsx } from './utils/xlsxExporter';

const STABLECOIN_KEYWORDS = ['stablecoin', 'usd', 'dai', 'tether', 'busd', 'usdc', 'fdusd', 'usdt', 'usdp', 'pyusd', 'tusd', 'eurc', 'eurs'];
const HEATMAP_ITEMS_PER_PAGE = 50;
const CLASSIC_HEATMAP_ITEMS_PER_PAGE = 100;

type ActiveTab = 'overview' | 'marketHeatmap' | 'classicHeatmap' | 'sectorHeatmap' | 'statistics' | 'aiAnalysis' | 'simulator' | 'reports';

const App: React.FC = () => {
  const [allCryptoData, setAllCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [excludeStablecoins, setExcludeStablecoins] = useState<boolean>(true);
  
  const [currentHeatmapPage, setCurrentHeatmapPage] = useState<number>(1);
  const [selectedClassicHeatmapMetric, setSelectedClassicHeatmapMetric] = useState<HeatmapMetric>('price_change_percentage_24h');
  const [currentClassicHeatmapPage, setCurrentClassicHeatmapPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataPromises = [
          fetchCoinGeckoMarketData(1, 250),
          fetchCoinGeckoMarketData(2, 250),
          fetchCoinGeckoMarketData(3, 250),
          fetchCoinGeckoMarketData(4, 250),
        ];
        const allPagesData = await Promise.all(dataPromises);
        const combinedData = allPagesData.flat();
        setAllCryptoData(combinedData);
      } catch (err) {
        console.error("Failed to load crypto data from CoinGecko:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching data from CoinGecko.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCryptoData = useMemo(() => {
    if (!excludeStablecoins) return allCryptoData;
    return allCryptoData.filter(coin => 
      !STABLECOIN_KEYWORDS.some(keyword => 
        coin.name.toLowerCase().includes(keyword) || coin.symbol.toLowerCase().includes(keyword)
      )
    );
  }, [allCryptoData, excludeStablecoins]);

  const paginatedHeatmapData = useMemo(() => {
    const startIndex = (currentHeatmapPage - 1) * HEATMAP_ITEMS_PER_PAGE;
    const endIndex = startIndex + HEATMAP_ITEMS_PER_PAGE;
    return filteredCryptoData.slice(startIndex, endIndex);
  }, [filteredCryptoData, currentHeatmapPage]);

  const totalHeatmapPages = useMemo(() => Math.max(1, Math.ceil(filteredCryptoData.length / HEATMAP_ITEMS_PER_PAGE)), [filteredCryptoData]);

  const paginatedClassicHeatmapData = useMemo(() => {
    const startIndex = (currentClassicHeatmapPage - 1) * CLASSIC_HEATMAP_ITEMS_PER_PAGE;
    const endIndex = startIndex + CLASSIC_HEATMAP_ITEMS_PER_PAGE;
    return filteredCryptoData.slice(startIndex, endIndex);
  }, [filteredCryptoData, currentClassicHeatmapPage]);

  const totalClassicHeatmapPages = useMemo(() => Math.max(1, Math.ceil(filteredCryptoData.length / CLASSIC_HEATMAP_ITEMS_PER_PAGE)), [filteredCryptoData]);

  useEffect(() => {
    if (currentHeatmapPage > totalHeatmapPages) setCurrentHeatmapPage(1);
    if (currentClassicHeatmapPage > totalClassicHeatmapPages) setCurrentClassicHeatmapPage(1);
  }, [filteredCryptoData, totalHeatmapPages, currentHeatmapPage, totalClassicHeatmapPages, currentClassicHeatmapPage]);

  const loadAnalysisTemplate = async (): Promise<string> => {
    try {
      const response = await fetch('/Reports/CryptoReportExample.md');
      if (!response.ok) {
        throw new Error('Failed to load analysis template');
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading analysis template:', error);
      // Fallback template if the file can't be loaded
      return `# Analysis of Top 1000 Cryptocurrencies by Market Cap

## EXECUTIVE SUMMARY
[Análisis ejecutivo del mercado]

## DASHBOARD DE MÉTRICAS CLAVE
[Métricas clave del mercado]

## Tendencias Generales del Grupo
[Análisis de tendencias por períodos]

## Análisis de Rendimientos
[Mejores y peores rendimientos]

## Top por Volumen y Market Cap
[Análisis de volumen y capitalización]

## Análisis de Volumen
[Análisis detallado de volumen]

## Observaciones Clave y Contexto del Mercado
[Observaciones importantes]

## Estrategias Recomendadas
[Estrategias de trading e inversión]

## Must-Take Insights
[Oportunidades destacadas]

## Resumen Final
[Resumen y conclusiones]`;
    }
  };

  const handleAnalyzeData = useCallback(async () => {
    if (filteredCryptoData.length === 0) {
      setAnalysisError('No data available for analysis. Please load the market data first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult('');

    try {
      // Load the analysis template
      const template = await loadAnalysisTemplate();
      
      let fullResult = `# Analysis of Top 1000 Cryptocurrencies by Market Cap\n\n`;
      
      // Calculate top performers for all periods
      const getTopPerformers = (data: CryptoData[], field: keyof CryptoData, count: number = 10) => {
        return data
          .filter(coin => coin[field] !== null && coin[field] !== undefined)
          .sort((a, b) => (b[field] as number) - (a[field] as number))
          .slice(0, count)
          .map(coin => ({
            name: coin.name,
            symbol: coin.symbol,
            value: coin[field] as number
          }));
      };

      const top1h = getTopPerformers(filteredCryptoData, 'price_change_percentage_1h_in_currency');
      const top24h = getTopPerformers(filteredCryptoData, 'price_change_percentage_24h');
      const top7d = getTopPerformers(filteredCryptoData, 'price_change_percentage_7d_in_currency');
      const top30d = getTopPerformers(filteredCryptoData, 'price_change_percentage_30d_in_currency');

      // Add top performers summary
      fullResult += `### 🔼 Top 10 - Última Hora (1h)\n`;
      top1h.forEach((coin, i) => {
        const emoji = coin.value > 10 ? '🟢' : coin.value > 0 ? '🔼' : coin.value < -10 ? '🔻' : '🔽';
        fullResult += `${i+1}. **${coin.name}** (${coin.symbol.toUpperCase()}) ${emoji} ${coin.value?.toFixed(2)}%\n`;
      });

      fullResult += `\n### 🔼 Top 10 - Últimas 24 Horas\n`;
      top24h.forEach((coin, i) => {
        const emoji = coin.value > 10 ? '🟢' : coin.value > 0 ? '🔼' : coin.value < -10 ? '🔻' : '🔽';
        fullResult += `${i+1}. **${coin.name}** (${coin.symbol.toUpperCase()}) ${emoji} ${coin.value?.toFixed(2)}%\n`;
      });

      fullResult += `\n### 🔼 Top 10 - Última Semana (7d)\n`;
      top7d.forEach((coin, i) => {
        const emoji = coin.value > 10 ? '🟢' : coin.value > 0 ? '🔼' : coin.value < -10 ? '🔻' : '🔽';
        fullResult += `${i+1}. **${coin.name}** (${coin.symbol.toUpperCase()}) ${emoji} ${coin.value?.toFixed(2)}%\n`;
      });

      fullResult += `\n### 🔼 Top 10 - Último Mes (30d)\n`;
      top30d.forEach((coin, i) => {
        const emoji = coin.value > 30 ? '🟢' : coin.value > 0 ? '🔼' : coin.value < -30 ? '🔻' : '🔽';
        fullResult += `${i+1}. **${coin.name}** (${coin.symbol.toUpperCase()}) ${emoji} ${coin.value?.toFixed(2)}%\n`;
      });

      // Process data in groups of 250
      const groupSize = 250;
      const totalGroups = Math.ceil(filteredCryptoData.length / groupSize);

      for (let i = 0; i < totalGroups; i++) {
        const start = i * groupSize;
        const end = start + groupSize;
        const groupData = filteredCryptoData.slice(start, end).map(c => ({
          name: c.name,
          symbol: c.symbol,
          market_cap: c.market_cap,
          current_price: c.current_price,
          price_change_percentage_1h: c.price_change_percentage_1h_in_currency,
          price_change_percentage_24h: c.price_change_percentage_24h,
          price_change_percentage_7d: c.price_change_percentage_7d_in_currency,
          price_change_percentage_30d: c.price_change_percentage_30d_in_currency,
          total_volume_24h: c.total_volume,
        }));
        
        if (groupData.length === 0) continue;
        
        const prompt = `Como analista senior de criptomonedas, analiza este grupo de datos (grupo ${i+1} de ${totalGroups}, ordenado por market cap) siguiendo EXACTAMENTE la estructura y formato de la plantilla proporcionada.

PLANTILLA DE REFERENCIA:
${template}

IMPORTANTE: 
1. Usa EXACTAMENTE la misma estructura que la plantilla
2. Incluye todas las secciones: EXECUTIVE SUMMARY, DASHBOARD DE MÉTRICAS CLAVE, Tendencias Generales, Análisis de Rendimientos, Top por Volumen y Market Cap, Análisis de Volumen, Observaciones Clave, Estrategias Recomendadas, Must-Take Insights, y Resumen Final
3. Usa estos emojis específicos en tu análisis:
   - 🔼 para subidas menores (0-10%)
   - 🔽 para bajadas menores (0-10%)
   - 🔻 para caídas importantes (>10%)
   - 🟢 para ganancias importantes (>10%)
4. Incluye tablas formateadas en markdown
5. Proporciona estrategias de trading específicas con puntos de entrada, salida y stop loss
6. Mantén el mismo nivel de detalle y profesionalismo que la plantilla

Datos del grupo ${i+1}:
\`\`\`json
${JSON.stringify(groupData, null, 2)}
\`\`\`

Responde en español siguiendo EXACTAMENTE el formato y estructura de la plantilla proporcionada.`;

        const result = await analyzeCryptoData(prompt);
        fullResult += `\n\n## Grupo ${i+1} de ${totalGroups} (por Capitalización de Mercado)\n` + result;
      }
      
      setAnalysisResult(fullResult);
    } catch (err) {
      let errorMessage = 'An unknown error occurred during AI analysis.';
      if (err instanceof Error) {
        errorMessage = err.message.includes("API Key")
          ? `API Key error. Please ensure your Gemini API_KEY is correctly configured.`
          : `Analysis failed: ${err.message}`;
      }
      setAnalysisError(errorMessage);
      console.error("AI Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [filteredCryptoData]);
  
  const handleDownloadData = (format: 'overview' | 'complete' | 'multiSheet' | 'heatmap' | 'classicHeatmap') => {
    if (format === 'overview') {
      exportCryptoDataToXlsx(filteredCryptoData, 'crypto_overview_data', false);
    } else if (format === 'complete') {
      exportCryptoDataToXlsx(filteredCryptoData, 'crypto_complete_data', true);
    } else if (format === 'multiSheet') {
      const sheets = [
        {
          data: filteredCryptoData.slice(0, 100),
          sheetName: 'Top 100',
          fieldConfigs: [
            { key: 'market_cap_rank', label: 'Rank' },
            { key: 'name', label: 'Name' },
            { key: 'symbol', label: 'Symbol' },
            { key: 'current_price', label: 'Price USD' },
            { key: 'price_change_percentage_24h', label: '24h %' },
            { key: 'market_cap', label: 'Market Cap' },
            { key: 'total_volume', label: 'Volume 24h' }
          ]
        },
        {
          data: filteredCryptoData.slice(100, 500),
          sheetName: 'Top 101-500',
          fieldConfigs: [
            { key: 'market_cap_rank', label: 'Rank' },
            { key: 'name', label: 'Name' },
            { key: 'symbol', label: 'Symbol' },
            { key: 'current_price', label: 'Price USD' },
            { key: 'price_change_percentage_24h', label: '24h %' },
            { key: 'market_cap', label: 'Market Cap' }
          ]
        },
        {
          data: filteredCryptoData.slice(500),
          sheetName: 'Top 501+',
          fieldConfigs: [
            { key: 'market_cap_rank', label: 'Rank' },
            { key: 'name', label: 'Name' },
            { key: 'symbol', label: 'Symbol' },
            { key: 'current_price', label: 'Price USD' },
            { key: 'price_change_percentage_24h', label: '24h %' }
          ]
        }
      ];
      exportMultiSheetXlsx(sheets, 'crypto_multi_sheet_data');
    } else if (format === 'heatmap') {
      exportCryptoDataToXlsx(paginatedHeatmapData, `crypto_heatmap_page_${currentHeatmapPage}`, false);
    } else if (format === 'classicHeatmap') {
      exportCryptoDataToXlsx(paginatedClassicHeatmapData, `crypto_classic_heatmap_${selectedClassicHeatmapMetric}_page_${currentClassicHeatmapPage}`, false);
    }
  };

  const renderTabContent = () => {
    if (isLoading && allCryptoData.length === 0) { 
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingIcon className="w-12 h-12 animate-spin text-sky-400" />
          <p className="ml-4 text-xl">Loading Market Data...</p>
        </div>
      );
    }
    if (error && allCryptoData.length === 0) { 
      return (
        <div className="bg-red-700/30 border border-red-500 text-red-300 p-6 rounded-lg shadow-lg flex items-start max-w-2xl mx-auto mt-8">
          <ErrorIcon className="w-8 h-8 mr-4 flex-shrink-0 text-red-400" />
          <div>
            <h3 className="font-semibold text-red-200 text-xl mb-2">Data Loading Error</h3>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="mb-4 flex justify-end space-x-2">
              <button type="button" onClick={() => handleDownloadData('overview')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center" disabled={filteredCryptoData.length === 0}>
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> 📊 Resumen (.xlsx)
              </button>
              <button type="button" onClick={() => handleDownloadData('complete')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center" disabled={filteredCryptoData.length === 0}>
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> 📈 Completo (.xlsx)
              </button>
              <button type="button" onClick={() => handleDownloadData('multiSheet')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center" disabled={filteredCryptoData.length === 0}>
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> 🗂️ Multi-Hoja (.xlsx)
              </button>
            </div>
            <CryptoTable data={filteredCryptoData} />
          </>
        );
      case 'marketHeatmap':
        return (
          <div className="space-y-2">
            <HeatmapDisplay data={paginatedHeatmapData} />
            <PaginationControls currentPage={currentHeatmapPage} totalPages={totalHeatmapPages} onPageChange={setCurrentHeatmapPage}/>
            <div className="mt-4 flex justify-center">
              <button type="button" onClick={() => handleDownloadData('heatmap')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center" disabled={paginatedHeatmapData.length === 0}>
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> 🔥 Heatmap Página (.xlsx)
              </button>
            </div>
            {isLoading && <p className="text-center text-sky-400 text-sm mt-2">Updating data...</p>}
          </div>
        );
      case 'classicHeatmap':
        return (
          <div className="space-y-4">
            <HeatmapControls selectedMetric={selectedClassicHeatmapMetric} onMetricChange={setSelectedClassicHeatmapMetric} />
            <ClassicHeatmapDisplay data={paginatedClassicHeatmapData} selectedMetric={selectedClassicHeatmapMetric} />
            <PaginationControls currentPage={currentClassicHeatmapPage} totalPages={totalClassicHeatmapPages} onPageChange={setCurrentClassicHeatmapPage} />
             <div className="mt-4 flex justify-center">
              <button type="button" onClick={() => handleDownloadData('classicHeatmap')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center" disabled={paginatedClassicHeatmapData.length === 0}>
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> 🎯 Heatmap Clásico (.xlsx)
              </button>
            </div>
            {isLoading && <p className="text-center text-sky-400 text-sm mt-2">Updating data...</p>}
          </div>
        );
      case 'sectorHeatmap': return <SectorHeatmapView />;
      case 'statistics': return <StatisticsView />;
      case 'aiAnalysis':
        return <AnalysisSection onAnalyze={handleAnalyzeData} isAnalyzing={isAnalyzing} analysisResult={analysisResult} analysisError={analysisError} />;
      case 'simulator': return <SimulatorView />;
      case 'reports': return <ReportsView />;
      default: return null;
    }
  };
  
  const TabButton: React.FC<{ tabId: ActiveTab; label: string; icon: React.ReactNode }> = ({ tabId, label, icon }) => (
    <button type="button" onClick={() => setActiveTab(tabId)} className={`flex items-center justify-center px-3 py-3 font-medium text-sm sm:text-base rounded-t-lg transition-colors duration-150 whitespace-nowrap ${activeTab === tabId ? 'bg-slate-700 text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`} aria-current={activeTab === tabId ? 'page' : undefined}>
      {icon} <span className="ml-2 hidden lg:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center p-4 sm:p-6 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-screen-2xl mb-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <ChartPieIcon className="w-10 h-10 text-sky-400 mr-3" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
            Crypto Analysis Suite
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          Análisis profesional del mercado de criptomonedas
        </p>
      </header>
      
       <div className="w-full max-w-screen-2xl mb-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {allCryptoData.length > 0 && (
              <div className="real-data-notice flex items-center bg-emerald-900/30 border border-emerald-700 rounded-lg px-4 py-2">
                <div className="real-data-icon mr-3">🚀</div>
                <div className="real-data-content">
                  <div className="real-data-title text-emerald-300 font-semibold">Datos Reales Activos</div>
                  <div className="real-data-subtitle text-emerald-400 text-sm">CoinGecko API • {allCryptoData.length} criptomonedas analizadas</div>
                </div>
              </div>
            )}
            <div className="text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Market Cap</div>
                <div className="text-2xl font-bold text-emerald-400">$2.53T</div>
            </div>
            <div className="text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider">24h Volume</div>
                <div className="text-2xl font-bold text-sky-300">$88.4B</div>
            </div>
            <div className="text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider">BTC Dominance</div>
                <div className="text-2xl font-bold text-amber-400">51.7%</div>
            </div>
            <label htmlFor="stablecoinFilter" className="flex items-center space-x-2 text-slate-300 cursor-pointer ml-auto">
              <input type="checkbox" id="stablecoinFilter" checked={excludeStablecoins} onChange={(e) => setExcludeStablecoins(e.target.checked)} className="form-checkbox h-5 w-5 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-sky-500 focus:ring-offset-slate-800" />
              <span>Exclude Stablecoins</span>
            </label>
      </div>

      <main className="w-full max-w-screen-2xl">
        <nav className="mb-1 border-b border-slate-700 flex space-x-1 flex-wrap" aria-label="Tabs">
          <TabButton tabId="overview" label="Tabla" icon={<TableCellsIcon className="w-5 h-5" />} />
          <TabButton tabId="marketHeatmap" label="Heatmap Dual" icon={<ChartBarIcon className="w-5 h-5" />} />
          <TabButton tabId="classicHeatmap" label="Heatmap Clásico" icon={<SquaresPlusIcon className="w-5 h-5" />} />
          <TabButton tabId="sectorHeatmap" label="Heatmap Sectorial" icon={<ChartPieIcon className="w-5 h-5" />} />
          <TabButton tabId="statistics" label="Estadísticas" icon={<PresentationChartLineIcon className="w-5 h-5" />} />
          <TabButton tabId="aiAnalysis" label="Análisis IA" icon={<LightBulbIcon className="w-5 h-5" />} />
          <TabButton tabId="simulator" label="Simulador" icon={<CalculatorIcon className="w-5 h-5" />} />
          <TabButton tabId="reports" label="Reportes" icon={<DocumentTextIcon className="w-5 h-5" />} />
        </nav>
        <div className="bg-slate-800 p-2 sm:p-4 rounded-b-xl rounded-tr-xl shadow-2xl border border-slate-700 border-t-0 min-h-[calc(100vh-450px)]">
          {renderTabContent()}
        </div>
      </main>
      
      <footer className="w-full max-w-screen-2xl mt-10 text-center text-slate-500 text-sm">
        <p>Powered by Google Gemini API and CoinGecko API.</p>
        <p>Ensure your <code className="bg-slate-700 px-1 rounded">API_KEY</code> is set as an environment variable for Gemini API access.</p>
      </footer>
    </div>
  );
};

export default App;
