import React, { useState, useEffect } from 'react';
import { CryptoData, ViewType, HeatmapMetric } from './types';
import { fetchCryptoData } from './utils/apiClient';
import { analyzeCryptoData } from './services/geminiService';
import CryptoTable from './components/CryptoTable';
import HeatmapDisplay from './components/HeatmapDisplay';
import ClassicHeatmapDisplay from './components/ClassicHeatmapDisplay';
import SectorHeatmapView from './components/SectorHeatmapView';
import StatisticsView from './components/StatisticsView';
import AnalysisSection from './components/AnalysisSection';
import SimulatorView from './components/SimulatorView';
import ReportsView from './components/ReportsView';
import { 
  TableCellsIcon, 
  ChartBarIcon, 
  SquaresPlusIcon, 
  PresentationChartLineIcon, 
  CalculatorIcon, 
  DocumentTextIcon,
  LoadingIcon,
  ChartPieIcon
} from './components/IconComponents';

const App: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('table');
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<HeatmapMetric>('price_change_percentage_24h');

  useEffect(() => {
    loadCryptoData();
  }, []);

  const loadCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchCryptoData();
      setCryptoData(result.cryptoData);
      setUsingMockData(result.usingMockData);
    } catch (err) {
      setError('Error al cargar los datos de criptomonedas');
      console.error('Error loading crypto data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (cryptoData.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      // Crear un prompt con los datos de las criptomonedas
      const topCoins = cryptoData.slice(0, 10);
      const prompt = `Analiza el mercado de criptomonedas basándote en los siguientes datos de las top 10 criptomonedas:

${topCoins.map(coin => `
- ${coin.name} (${coin.symbol.toUpperCase()}):
  * Precio: $${coin.current_price?.toFixed(2) || 'N/A'}
  * Cambio 24h: ${coin.price_change_percentage_24h?.toFixed(2) || 'N/A'}%
  * Market Cap: $${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) + 'B' : 'N/A'}
  * Volumen 24h: $${coin.total_volume ? (coin.total_volume / 1e9).toFixed(2) + 'B' : 'N/A'}
`).join('')}

Por favor, proporciona un análisis detallado que incluya:
1. Tendencias generales del mercado
2. Análisis de las principales criptomonedas
3. Factores que pueden estar influyendo en los precios
4. Recomendaciones y perspectivas futuras

Responde en español y usa formato markdown.`;

      const result = await analyzeCryptoData(prompt);
      setAnalysis(result);
    } catch (err) {
      console.error('Error analyzing data:', err);
      setAnalysisError('Error al generar el análisis. Por favor, verifica tu clave de API de Gemini.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <LoadingIcon />
          <p>Cargando datos de criptomonedas...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadCryptoData} className="retry-button">
            Reintentar
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'table':
        return <CryptoTable data={cryptoData} />;
      case 'heatmap':
        return <HeatmapDisplay data={cryptoData} />;
      case 'classic-heatmap':
        return <ClassicHeatmapDisplay data={cryptoData} selectedMetric={selectedMetric} />;
      case 'sector-heatmap':
        return <SectorHeatmapView />;
      case 'statistics':
        return <StatisticsView />;
      case 'analysis':
        return (
          <AnalysisSection
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            analysisResult={analysis}
            analysisError={analysisError}
          />
        );
      case 'simulator':
        return <SimulatorView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <CryptoTable data={cryptoData} />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>📈 Crypto Analysis Suite</h1>
          <p className="subtitle">Análisis profesional del mercado de criptomonedas</p>
          {usingMockData && (
            <div className="mock-data-notice">
              ⚠️ Usando datos de prueba - API no disponible
            </div>
          )}
        </div>
      </header>

      <nav className="navigation">
        <button
          className={`nav-button ${currentView === 'table' ? 'active' : ''}`}
          onClick={() => setCurrentView('table')}
        >
          <TableCellsIcon />
          Tabla
        </button>
        <button
          className={`nav-button ${currentView === 'heatmap' ? 'active' : ''}`}
          onClick={() => setCurrentView('heatmap')}
        >
          <ChartBarIcon />
          Heatmap Dual
        </button>
        <button
          className={`nav-button ${currentView === 'classic-heatmap' ? 'active' : ''}`}
          onClick={() => setCurrentView('classic-heatmap')}
        >
          <SquaresPlusIcon />
          Heatmap Clásico
        </button>
        <button
          className={`nav-button ${currentView === 'sector-heatmap' ? 'active' : ''}`}
          onClick={() => setCurrentView('sector-heatmap')}
        >
          <ChartPieIcon />
          Heatmap Sectorial
        </button>
        <button
          className={`nav-button ${currentView === 'statistics' ? 'active' : ''}`}
          onClick={() => setCurrentView('statistics')}
        >
          <PresentationChartLineIcon />
          Estadísticas
        </button>
        <button
          className={`nav-button ${currentView === 'analysis' ? 'active' : ''}`}
          onClick={() => setCurrentView('analysis')}
        >
          <DocumentTextIcon />
          Análisis IA
        </button>
        <button
          className={`nav-button ${currentView === 'simulator' ? 'active' : ''}`}
          onClick={() => setCurrentView('simulator')}
        >
          <CalculatorIcon />
          Simulador
        </button>
        <button
          className={`nav-button ${currentView === 'reports' ? 'active' : ''}`}
          onClick={() => setCurrentView('reports')}
        >
          <DocumentTextIcon />
          Reportes
        </button>
      </nav>

      <main className="main-content">
        {renderView()}
      </main>

      <style>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
        }

        .header {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          padding: 2rem 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 1.1rem;
          margin: 0;
        }

        .mock-data-notice {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: #fbbf24;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          display: inline-block;
        }

        .navigation {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          padding: 1rem 0;
          overflow-x: auto;
          display: flex;
          gap: 0.5rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(51, 65, 85, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 0.5rem;
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          font-size: 0.9rem;
        }

        .nav-button:hover {
          background: rgba(51, 65, 85, 0.8);
          border-color: rgba(148, 163, 184, 0.4);
          transform: translateY(-1px);
        }

        .nav-button.active {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-color: transparent;
          color: white;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
        }

        .error-message {
          color: #ef4444;
          font-size: 1.1rem;
          margin: 0;
        }

        .retry-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border: none;
          border-radius: 0.5rem;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          transition: transform 0.2s;
        }

        .retry-button:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2rem;
          }
          
          .navigation {
            padding: 1rem;
          }
          
          .nav-button {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }
          
          .main-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
