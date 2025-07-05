import { useState } from 'react';
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

// 🎯 CAMBIO CRÍTICO: Aumentar de 50 a 1000 elementos por página
// const HEATMAP_ITEMS_PER_PAGE = 1000; // Será usado en futuras versiones

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCryptoForAnalysis, setSelectedCryptoForAnalysis] = useState<CryptoData[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // 🚀 Ahora accedemos a 1000 criptomonedas (20 páginas x 50 por página)
  const totalPages = 20; // Esto nos da acceso a las top 1000 criptomonedas

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Mercado General</h2>
                <CryptoTable currentPage={currentPage} onSelectCrypto={setSelectedCryptoForAnalysis} />
                <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <AnalysisSection selectedCryptos={selectedCryptoForAnalysis} />
            </div>
          </div>
        );
      case 'marketHeatmap':
        return <HeatmapView />;
      case 'classicHeatmap':
        return <ClassicHeatmapView />;
      case 'sectorHeatmap':
        return <SectorHeatmapView />;
      case 'statistics':
        return <StatisticsView />;
      case 'simulator':
        return <SimulatorView />;
      case 'reports':
        return <ReportsView />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-4">Crypto Analysis Suite</h1>
        
        {/* 🎨 Navegación por pestañas */}
        <nav className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'overview', label: 'Resumen', icon: '📊' },
            { id: 'marketHeatmap', label: 'Heatmap Mercado', icon: '🔥' },
            { id: 'classicHeatmap', label: 'Heatmap Clásico', icon: '🎯' },
            { id: 'sectorHeatmap', label: 'Heatmap Sectorial', icon: '🏢' },
            { id: 'statistics', label: 'Estadísticas', icon: '📈' },
            { id: 'simulator', label: 'Simulador', icon: '🎮' },
            { id: 'reports', label: 'Reportes', icon: '📑' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </header>
      
      <main className="p-4 md:p-8 w-full max-w-none">
        {renderTabContent()}
      </main>
    </div>
  );
}
export default App;
