import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LoadingIcon, ErrorIcon, SparklesIcon, ArrowDownTrayIcon } from './IconComponents';
import { exportAnalysisToXlsx } from '../utils/xlsxExporter';
import { useGenerateAnalysis } from '../utils/apiClient';
import { CryptoData } from '../types';

interface AnalysisSectionProps {
  selectedCryptos: CryptoData[];
  allCryptoData?: CryptoData[];
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ selectedCryptos, allCryptoData = [] }) => {
  const { mutate: generateAnalysis, isPending, data: analysisResult, error } = useGenerateAnalysis();

  const handleAnalyze = async () => {
    // Si hay criptos seleccionadas, analizarlas. Si no, analizar las top 250
    let cryptosToAnalyze = selectedCryptos;
    
    if (cryptosToAnalyze.length === 0) {
      // Usar las top 250 criptomonedas si no hay selección
      cryptosToAnalyze = allCryptoData.slice(0, 250);
      
      if (cryptosToAnalyze.length === 0) {
        alert('No hay datos disponibles para analizar');
        return;
      }
      
      // Informar al usuario que se analizarán las top 250
      alert('No seleccionaste ninguna criptomoneda. Se analizarán las 250 principales por capitalización de mercado.');
    }

    let prompt: string;

    if (selectedCryptos.length > 0) {
      // Análisis de criptos seleccionadas
      const cryptoNames = selectedCryptos.map(crypto => crypto.name).join(', ');
      prompt = `Analiza el mercado de las siguientes criptomonedas seleccionadas: ${cryptoNames}. 
      
      Datos actuales de las criptomonedas seleccionadas:
      ${selectedCryptos.map(crypto => `
      - ${crypto.name} (${crypto.symbol?.toUpperCase()}):
        * Precio actual: $${crypto.current_price}
        * Cambio 24h: ${crypto.price_change_percentage_24h?.toFixed(2)}%
        * Cambio 7d: ${crypto.price_change_percentage_7d_in_currency?.toFixed(2)}%
        * Market Cap: $${crypto.market_cap?.toLocaleString()}
        * Ranking: #${crypto.market_cap_rank}
      `).join('\n')}
      
      Proporciona un análisis detallado en español.`;
    } else {
      // Análisis automático del mercado completo (top 250)
      prompt = `Realiza un análisis profesional del mercado de criptomonedas basado en las top 250 criptomonedas por capitalización de mercado.

      DATOS DEL MERCADO:
      Analizando las ${cryptosToAnalyze.length} principales criptomonedas del mercado.
      
      Top 10 por capitalización:
      ${cryptosToAnalyze.slice(0, 10).map((crypto, idx) => `
      ${idx + 1}. ${crypto.name} (${crypto.symbol?.toUpperCase()})
         - Precio: $${crypto.current_price}
         - Market Cap: $${crypto.market_cap?.toLocaleString()}
         - Cambio 24h: ${crypto.price_change_percentage_24h?.toFixed(2)}%
      `).join('')}

      INSTRUCCIONES:
      Sigue EXACTAMENTE la plantilla de análisis profesional que conoces, generando un reporte completo en español que incluya:
      
      1. **RESUMEN EJECUTIVO**
      2. **ANÁLISIS DE TENDENCIAS** 
      3. **ANÁLISIS DE VOLUMEN Y LIQUIDEZ**
      4. **ANÁLISIS SECTORIAL**
      5. **FACTORES DE RIESGO Y OPORTUNIDADES** 
      6. **CONCLUSIONES Y PERSPECTIVAS**
      
      Usa los datos reales proporcionados y mantén un tono profesional.`;
    }

    generateAnalysis(prompt);
  };

  const handleDownloadReport = (format: 'md' | 'xlsx') => {
    if (!analysisResult) return;
    
    const analysisContent = typeof analysisResult === 'string' ? analysisResult : JSON.stringify(analysisResult);
    
    if (format === 'md') {
      const blob = new Blob([analysisContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const timestamp = new Date().toISOString().slice(0,19).replace(/:/g,'-');
      link.setAttribute('download', `crypto_market_analysis_${timestamp}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'xlsx') {
      exportAnalysisToXlsx(analysisContent, 'crypto_market_analysis');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Análisis con IA</h2>
      
      {selectedCryptos.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Criptomonedas seleccionadas:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCryptos.map((crypto: CryptoData) => (
              <span key={crypto.id} className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm">
                {crypto.symbol?.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-center space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-center sm:space-x-4">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isPending}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto sm:mx-0 w-full sm:w-auto"
          aria-label="Analyze market trends with AI"
        >
          {isPending ? (
            <>
              <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
             <SparklesIcon className="w-5 h-5 mr-2" />
              Analizar Mercado
            </>
          )}
        </button>
        {analysisResult && !isPending && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleDownloadReport('md')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center justify-center"
              aria-label="Download analysis report as Markdown"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              📄 Reporte (.md)
            </button>
            <button
              type="button"
              onClick={() => handleDownloadReport('xlsx')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center justify-center"
              aria-label="Download analysis report as Excel"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              📊 Reporte (.xlsx)
            </button>
          </div>
        )}
      </div>

      {error && (
        <section id="analysis-error-display" className="bg-red-700/30 border border-red-500 text-red-300 p-4 rounded-lg shadow-lg flex items-start">
          <ErrorIcon className="w-6 h-6 mr-3 flex-shrink-0 text-red-400" />
          <div>
            <h3 className="font-semibold text-red-200">Error de Análisis</h3>
            <p className="text-sm">{error.message}</p>
          </div>
        </section>
      )}

      {analysisResult && !isPending && (
        <section id="analysis-output-section" className="bg-slate-700/50 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-600">
          <h2 className="text-2xl font-semibold mb-4 text-slate-100 flex items-center">
            <SparklesIcon className="w-7 h-7 mr-2 text-sky-400" />
            Análisis del Mercado con IA
          </h2>
          <div className="prose prose-sm sm:prose-base prose-invert max-w-none bg-slate-800 p-4 rounded-lg border border-slate-600 max-h-[60vh] overflow-y-auto shadow-inner 
                          prose-headings:text-sky-300 prose-strong:text-sky-200 prose-a:text-cyan-400 hover:prose-a:text-cyan-300
                          prose-code:text-amber-300 prose-code:bg-slate-900 prose-code:p-1 prose-code:rounded-md
                          prose-blockquote:border-l-sky-500 prose-blockquote:text-slate-400
                          prose-table:border-slate-600 prose-th:bg-slate-700 prose-th:p-2 prose-td:p-2 prose-td:border-slate-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {typeof analysisResult === 'string' ? analysisResult : JSON.stringify(analysisResult)}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
};

export default AnalysisSection;
