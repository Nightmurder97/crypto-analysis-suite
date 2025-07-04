import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LoadingIcon, ErrorIcon, SparklesIcon, ArrowDownTrayIcon } from './IconComponents.tsx';
import { exportAnalysisToXlsx } from '../utils/xlsxExporter';

interface AnalysisSectionProps {
  onAnalyze: () => Promise<void>;
  isAnalyzing: boolean;
  analysisResult: string;
  analysisError: string | null;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  onAnalyze,
  isAnalyzing,
  analysisResult,
  analysisError,
}) => {

  const handleDownloadReport = (format: 'md' | 'xlsx') => {
    if (!analysisResult) return;
    
    if (format === 'md') {
      const blob = new Blob([analysisResult], { type: 'text/markdown;charset=utf-8;' });
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
      exportAnalysisToXlsx(analysisResult, 'crypto_market_analysis');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-center sm:space-x-4">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto sm:mx-0 w-full sm:w-auto"
          aria-label="Analyze market trends with AI"
        >
          {isAnalyzing ? (
            <>
              <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
             <SparklesIcon className="w-5 h-5 mr-2" />
              Analyze Market Trends
            </>
          )}
        </button>
        {analysisResult && !isAnalyzing && (
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

      {analysisError && (
        <section id="analysis-error-display" className="bg-red-700/30 border border-red-500 text-red-300 p-4 rounded-lg shadow-lg flex items-start">
          <ErrorIcon className="w-6 h-6 mr-3 flex-shrink-0 text-red-400" />
          <div>
            <h3 className="font-semibold text-red-200">Analysis Error</h3>
            <p className="text-sm">{analysisError}</p>
          </div>
        </section>
      )}

      {analysisResult && !isAnalyzing && (
        <section id="analysis-output-section" className="bg-slate-700/50 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-600">
          <h2 className="text-2xl font-semibold mb-4 text-slate-100 flex items-center">
            <SparklesIcon className="w-7 h-7 mr-2 text-sky-400" />
            AI Market Analysis
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
