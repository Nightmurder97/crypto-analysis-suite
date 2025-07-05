// src/App.tsx - Layout principal mejorado

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// ... otros imports

const App: React.FC = () => {
  // ... estados existentes

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
                Análisis profesional del mercado de criptomonedas
              </p>
            </div>
            
            {/* Métricas del mercado en header */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-4 text-sm">
              <div className="bg-gray-700 px-3 py-2 rounded-lg">
                <span className="text-gray-400">Market Cap: </span>
                <span className="text-green-400 font-semibold">$2.8T</span>
              </div>
              <div className="bg-gray-700 px-3 py-2 rounded-lg">
                <span className="text-gray-400">24h Vol: </span>
                <span className="text-blue-400 font-semibold">$180B</span>
              </div>
              <div className="bg-gray-700 px-3 py-2 rounded-lg">
                <span className="text-gray-400">BTC Dom: </span>
                <span className="text-yellow-400 font-semibold">52.1%</span>
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
              { key: 'classicHeatmap', label: '📈 Heatmap Clásico', icon: '📈' },
              { key: 'sectorHeatmap', label: '🏢 Sectores', icon: '🏢' },
              { key: 'statistics', label: '📊 Estadísticas', icon: '📊' },
              { key: 'aiAnalysis', label: '🤖 Análisis IA', icon: '🤖' },
              { key: 'simulator', label: '💼 Simulador', icon: '💼' },
              { key: 'reports', label: '📋 Reportes', icon: '📋' }
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
};

// Función auxiliar para renderizar contenido de tabs mejorada
const renderTabContent = () => {
  if (isLoading && allCryptoData.length === 0) { 
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-lg">
        <LoadingIcon className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
        <p className="text-xl text-gray-300">Cargando datos del mercado...</p>
        <p className="text-sm text-gray-500 mt-2">Obteniendo información de 1000 criptomonedas</p>
      </div>
    );
  }
  
  if (error && allCryptoData.length === 0) { 
    return (
      <div className="bg-red-900/30 border border-red-500 text-red-300 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="flex items-start">
          <ErrorIcon className="w-8 h-8 mr-4 flex-shrink-0 text-red-400" />
          <div>
            <h3 className="font-semibold text-red-200 text-xl mb-2">
              Error al cargar datos
            </h3>
            <p className="text-red-300">{error}</p>
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
              <ArrowDownTrayIcon className="w-5 h-5" /> 
              Descargar CSV ({filteredCryptoData.length} filas)
            </button>
          </div>
          
          {/* Tabla principal con ancho completo */}
          <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <CryptoTable data={filteredCryptoData} />
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
                <ArrowDownTrayIcon className="w-5 h-5" /> 
                Descargar datos del heatmap
              </button>
            </div>
            
            <HeatmapDisplay data={paginatedHeatmapData} />
            
            {isLoading && (
              <p className="text-center text-cyan-400 text-sm mt-4 animate-pulse">
                Actualizando datos...
              </p>
            )}
          </div>
        </div>
      );
      
    // ... otros casos similares con ancho completo
    
    default:
      return <div className="text-center text-gray-400">Sección en desarrollo</div>;
  }
};