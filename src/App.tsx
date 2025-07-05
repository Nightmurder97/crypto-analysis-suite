import { useState } from 'react';
import CryptoTable from './components/CryptoTable';
import AnalysisSection from './components/AnalysisSection';
import PaginationControls from './components/PaginationControls';
import { CryptoData } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCryptoForAnalysis, setSelectedCryptoForAnalysis] = useState<CryptoData[]>([]);

  // CoinGecko API returns 250 coins max per request, with default pagination of 50 per page
  const totalPages = 5; // This gives us access to top 250 cryptocurrencies

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="p-4 border-b border-gray-700"><h1 className="text-3xl font-bold text-center text-cyan-400">Crypto Analysis Suite</h1></header>
      <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
      </main>
    </div>
  );
}
export default App;
