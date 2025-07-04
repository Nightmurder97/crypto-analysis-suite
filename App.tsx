import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { analyzeCryptoData } from '@/services/geminiService';
import { fetchCoinGeckoMarketData } from '@/utils/apiClient';
import { LoadingIcon, ErrorIcon, ChartBarIcon, TableCellsIcon, LightBulbIcon, ArrowDownTrayIcon, SquaresPlusIcon, ChartPieIcon, CalculatorIcon, DocumentTextIcon, PresentationChartLineIcon } from '@/components/IconComponents';
import CryptoTable from '@/components/CryptoTable';
import HeatmapDisplay from '@/components/HeatmapDisplay';
import AnalysisSection from '@/components/AnalysisSection';
import PaginationControls from '@/components/PaginationControls';
import HeatmapControls from '@/components/HeatmapControls';
import ClassicHeatmapDisplay from '@/components/ClassicHeatmapDisplay';
import SectorHeatmapView from '@/components/SectorHeatmapView';
import StatisticsView from '@/components/StatisticsView';
import SimulatorView from '@/components/SimulatorView';
import ReportsView from '@/components/ReportsView';
import { CryptoData, HeatmapMetric } from '@/types';
import { exportDataToCsv, FieldConfig } from '@/utils/csvExporter';

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

  const handleAnalyzeData = useCallback(async () => {
    if (filteredCryptoData.length === 0) {
      setAnalysisError("No crypto data available to analyze (check filters).");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult('');
    setAnalysisError(null);
    try {
      const groupSize = 250;
      const totalGroups = 4;
      let fullResult = '# Analysis of Top 1000 Cryptocurrencies by Market Cap\n';
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
        const prompt = `\nAs a senior cryptocurrency market analyst, analyze the following group of cryptocurrencies (group ${i+1} of ${totalGroups}, sorted by market cap).\nProduce a market report in Markdown format, following the same structure and depth as any previous analysis.\n\nIdentify trends, top/worst performers, volume analysis, key observations, and a final summary for this group.\n\nData for group ${i+1}:\n\`\`\`json\n${JSON.stringify(groupData, null, 2)}\n\`\`\`\n`;
        const result = await analyzeCryptoData(prompt);
        fullResult += `\n\n## Group ${i+1} of ${totalGroups} (by Market Cap)\n` + result;
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
  
  const handleDownloadData = (format: 'overview' | 'heatmap' | 'classicHeatmap') => {
    const overviewCsvFields: FieldConfig<CryptoData>[] = [
      { key: 'market_cap_rank', label: 'Rank' }, { key: 'name', label: 'Name' },
      { key: 'symbol', label: 'Symbol', formatter: (val) => (val as string)?.toUpperCase() },
      { key: 'current_price', label: 'Price (USD)', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(6) },
      { key: 'price_change_percentage_1h_in_currency', label: '1h %', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(2) },
      { key: 'price_change_percentage_24h', label: '24h %', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(2) },
      { key: 'price_change_percentage_7d_in_currency', label: '7d %', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(2) },
      { key: 'price_change_percentage_30d_in_currency', label: '30d %', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(2) },
      { key: 'market_cap', label: 'Market Cap (USD)' }, { key: 'total_volume', label: 'Volume 24h (USD)' },
      { key: 'sparkline_in_7d', label: 'Sparkline 7d', formatter: (val) => val && (val as { price: number[] }).price ? JSON.stringify((val as { price: number[] }).price) : 'N/A' },
    ];
    const heatmapCsvFields: FieldConfig<CryptoData>[] = [
      { key: 'name', label: 'Name' }, { key: 'symbol', label: 'Symbol', formatter: (val) => (val as string)?.toUpperCase() },
      { key: 'price_change_percentage_1h_in_currency', label: '1h %', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(2) },
      { key: 'price_change_percentage_24h', label: '24h %', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(2) },
      { key: 'price_change_percentage_7d_in_currency', label: '7d %', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(2) },
      { key: 'price_change_percentage_30d_in_currency', label: '30d %', formatter: (val) => val === null || val === undefined ? 'N/A' : Number(val).toFixed(2) },
      { key: 'total_volume', label: 'Volume 24h (USD)' },
    ];

    if (format === 'overview') {
      exportDataToCsv(filteredCryptoData, 'crypto_overview_data.csv', overviewCsvFields);
    } else if (format === 'heatmap') {
      exportDataToCsv(paginatedHeatmapData, `crypto_market_heatmaps_page_${currentHeatmapPage}.csv`, heatmapCsvFields);
    } else if (format === 'classicHeatmap') {
      exportDataToCsv(paginatedClassicHeatmapData, `crypto_classic_heatmap_${selectedClassicHeatmapMetric}_page_${currentClassicHeatmapPage}.csv`, [
        { key: 'name', label: 'Name' },
        { key: 'symbol', label: 'Symbol', formatter: (val) => (val as string)?.toUpperCase() },
        { 
          key: selectedClassicHeatmapMetric, 
          label: selectedClassicHeatmapMetric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          formatter: (val) => (val === null || val === undefined) ? 'N/A' : (typeof val === 'number' ? val.toFixed(2) : String(val))
        }
      ]);
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
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => handleDownloadData('overview')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center" disabled={filteredCryptoData.length === 0}>
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download Overview (.csv)
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
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download Page Data (.csv)
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
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download Page (.csv)
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
          An integrated toolkit for cryptocurrency market analysis and visualization.
        </p>
      </header>
      
       <div className="w-full max-w-screen-2xl mb-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
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
          <TabButton tabId="overview" label="Data Overview" icon={<TableCellsIcon className="w-5 h-5" />} />
          <TabButton tabId="marketHeatmap" label="Market Heatmap" icon={<ChartBarIcon className="w-5 h-5" />} />
          <TabButton tabId="classicHeatmap" label="Classic Heatmap" icon={<SquaresPlusIcon className="w-5 h-5" />} />
          <TabButton tabId="sectorHeatmap" label="Sector Heatmap" icon={<ChartPieIcon className="w-5 h-5" />} />
          <TabButton tabId="statistics" label="Statistics" icon={<PresentationChartLineIcon className="w-5 h-5" />} />
          <TabButton tabId="aiAnalysis" label="AI Analysis" icon={<LightBulbIcon className="w-5 h-5" />} />
          <TabButton tabId="simulator" label="Simulator" icon={<CalculatorIcon className="w-5 h-5" />} />
          <TabButton tabId="reports" label="Reports" icon={<DocumentTextIcon className="w-5 h-5" />} />
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