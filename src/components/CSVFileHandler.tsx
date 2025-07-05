// src/components/CSVFileHandler.tsx - Componente para cargar el archivo CSV

import React, { useState, useRef } from 'react';
import { parseCryptoCategoriesCSV, CryptoCategoryData } from '../utils/csvCategoriesService';

interface CSVFileHandlerProps {
  onCsvLoaded?: (data: CryptoCategoryData[]) => void;
  className?: string;
}

const CSVFileHandler: React.FC<CSVFileHandlerProps> = ({ onCsvLoaded, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<CryptoCategoryData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Por favor selecciona un archivo CSV válido');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const text = await file.text();
      const parsedData = parseCryptoCategoriesCSV(text);
      
      if (parsedData.length === 0) {
        throw new Error('El archivo CSV está vacío o no tiene el formato correcto');
      }

      setCsvData(parsedData);
      onCsvLoaded?.(parsedData);
      
      console.log(`✅ CSV cargado exitosamente: ${parsedData.length} registros`);
    } catch (err: any) {
      console.error('❌ Error al cargar CSV:', err);
      setError(`Error al procesar el archivo: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const csvFile = files.find(file => file.name.endsWith('.csv'));
    
    if (csvFile && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(csvFile);
      fileInputRef.current.files = dataTransfer.files;
      
      // Trigger the change event manually
      const changeEvent = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  };

  const getCategoryStats = () => {
    if (csvData.length === 0) return null;

    const categories = csvData.reduce((acc, crypto) => {
      acc[crypto.category] = (acc[crypto.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const uniqueCategories = Object.keys(categories).length;
    const totalCoins = csvData.length;
    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { uniqueCategories, totalCoins, topCategories };
  };

  const stats = getCategoryStats();

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-2">
          📁 Carga de Archivo de Categorías
        </h3>
        <p className="text-gray-400 text-sm">
          Sube el archivo CSV con las categorías de criptomonedas para análisis sectorial preciso
        </p>
      </div>

      {/* Área de carga */}
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isLoading}
        />
        
        {!isLoading ? (
          <div>
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-300 mb-2">
              Arrastra el archivo CSV aquí o{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                selecciona un archivo
              </button>
            </p>
            <p className="text-gray-500 text-sm">
              Archivo esperado: crypto_coins_category.csv
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-4"></div>
            <p className="text-gray-300">Procesando archivo...</p>
          </div>
        )}
      </div>

      {/* Estado del archivo */}
      {fileName && !error && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-500 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✅</span>
            <span className="text-green-300 font-medium">Archivo cargado: {fileName}</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-400">❌</span>
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Estadísticas del CSV */}
      {stats && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-cyan-300 mb-3">📊 Estadísticas del CSV:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Total de criptomonedas:</span>
              <span className="ml-2 font-semibold text-white">{stats.totalCoins}</span>
            </div>
            <div>
              <span className="text-gray-400">Categorías únicas:</span>
              <span className="ml-2 font-semibold text-white">{stats.uniqueCategories}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <span className="text-gray-400 block mb-2">Top 5 categorías:</span>
            <div className="space-y-1">
              {stats.topCategories.map(([category, count]) => (
                <div key={category} className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 truncate">{category}</span>
                  <span className="text-cyan-400 font-semibold ml-2">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones de formato */}
      <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg">
        <h4 className="text-blue-300 font-medium mb-2">💡 Formato esperado del CSV:</h4>
        <div className="text-xs text-blue-200 space-y-1">
          <p>• <strong>Coin:</strong> Nombre de la criptomoneda</p>
          <p>• <strong>Rank:</strong> Ranking por capitalización</p>
          <p>• <strong>Category:</strong> Categoría del sector</p>
          <p>• <strong>Market capitalization:</strong> Capitalización de mercado</p>
          <p className="text-blue-300 mt-2">
            El archivo debe tener exactamente estas columnas para funcionar correctamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CSVFileHandler;