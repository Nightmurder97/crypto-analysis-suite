import { useQuery, useMutation } from '@tanstack/react-query';
import { CryptoData } from '../types';
import { generateAnalysisWithGemini } from '../services/geminiService';

const fetchCryptoDataPage = async (page: number = 1, perPage: number = 250): Promise<CryptoData[]> => {
    // Usar el proxy configurado en vite.config.ts
    const url = `/api/coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d,30d`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('La petición al proxy de CoinGecko falló');
    return response.json();
};

// Función para obtener todos los datos (~1000 tokens)
export const fetchCryptoData = async (): Promise<CryptoData[]> => {
    try {
        const pages = [1, 2, 3, 4];
        const promises = pages.map(page => fetchCryptoDataPage(page, 250));
        const results = await Promise.all(promises);
        return results.flat();
    } catch (error) {
        console.error('Error fetching all crypto data:', error);
        throw error;
    }
};

export const useCryptoData = (page: number) => {
  return useQuery({
    queryKey: ['cryptoData', page],
    queryFn: () => fetchCryptoDataPage(page), // Sigue usando la paginación para vistas que lo requieran
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useGenerateAnalysis = () => {
    return useMutation({
        mutationFn: (prompt: string) => generateAnalysisWithGemini(prompt),
    });
};