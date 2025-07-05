import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LoadingIcon, ErrorIcon, SparklesIcon, ArrowDownTrayIcon } from './IconComponents';
import { exportAnalysisToCsv, exportAnalysisToMd } from '../utils/csvExporter';
import { useGenerateAnalysis } from '../utils/apiClient';
import { CryptoData } from '../types';

interface AnalysisSectionProps {
  selectedCryptos: CryptoData[];
  // Props opcionales para control externo
  onAnalyze?: () => Promise<void>;
  isAnalyzing?: boolean;
  analysisResult?: string;
  analysisError?: string | null;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ 
  selectedCryptos, 
  onAnalyze: externalOnAnalyze,
  isAnalyzing: externalIsAnalyzing,
  analysisResult: externalAnalysisResult,
  analysisError: externalAnalysisError
}) => {
  // Hook interno para análisis de selección
  const { mutate: generateAnalysis, isPending, data: internalAnalysisResult, error: internalError } = useGenerateAnalysis();

  // Determinar qué estado usar (externo o interno)
  const isAnalyzing = externalIsAnalyzing !== undefined ? externalIsAnalyzing : isPending;
  const analysisResult = externalAnalysisResult !== undefined ? externalAnalysisResult : internalAnalysisResult;
  const analysisError = externalAnalysisError !== undefined ? externalAnalysisError : internalError?.message;

  const handleAnalyze = async () => {
    // Usar la función de análisis externa si se proporciona (para análisis de mercado completo)
    if (externalOnAnalyze) {
      await externalOnAnalyze();
      return;
    }

    // Lógica interna para analizar solo las criptomonedas seleccionadas
    if (selectedCryptos.length === 0) {
      alert('Por favor selecciona al menos una criptomoneda para analizar.');
      return;
    }

    const cryptoDetails = selectedCryptos.map(c => 
      `- ${c.name} (${c.symbol?.toUpperCase()}): Precio=$${c.current_price}, Market Cap=$${c.market_cap?.toLocaleString()}, Rank=${c.market_cap_rank}`
    ).join('\n');

    const prompt = `Realiza un análisis detallado de las siguientes criptomonedas:\n${cryptoDetails}\n\nIncluye un resumen, análisis individual, tendencias de mercado, riesgos y una conclusión.`;
    generateAnalysis(prompt);
  };

  const handleDownloadReport = (format: 'md' | 'csv') => {
    if (analysisResult) {
      if (format === 'md') {
        exportAnalysisToMd(analysisResult, 'crypto_analysis_report');
      } else if (format === 'csv') {
        exportAnalysisToCsv(analysisResult, 'crypto_analysis_report');
      }
    }
  };

  const isButtonDisabled = isAnalyzing || (!externalOnAnalyze && selectedCryptos.length === 0);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Análisis con IA</h2>
      
      {selectedCryptos.length > 0 && !externalOnAnalyze && (
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
          disabled={isButtonDisabled}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto sm:mx-0 w-full sm:w-auto"
        >
          {isAnalyzing ? (
            <>
              <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
             <SparklesIcon className="w-5 h-5 mr-2" />
              {externalOnAnalyze ? 'Análisis Completo del Mercado' : `Analizar ${selectedCryptos.length} Criptos`}
            </>
          )}
        </button>
        {analysisResult && !isAnalyzing && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleDownloadReport('md')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center justify-center"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Reporte (.md)
            </button>
            <button
              type="button"
              onClick={() => handleDownloadReport('csv')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-md transition-colors flex items-center justify-center"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Reporte (.csv)
            </button>
          </div>
        )}
      </div>

      {analysisError && (
        <section id="analysis-error-display" className="bg-red-700/30 border border-red-500 text-red-300 p-4 rounded-lg shadow-lg flex items-start">
          <ErrorIcon className="w-6 h-6 mr-3 flex-shrink-0 text-red-400" />
          <div>
            <h3 className="font-semibold text-red-200">Error de Análisis</h3>
            <p className="text-sm">{analysisError}</p>
          </div>
        </section>
      )}

      {analysisResult && !isAnalyzing && (
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
};

export default AnalysisSection;
