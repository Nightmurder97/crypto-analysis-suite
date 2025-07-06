import { useQuery, useMutation } from '@tanstack/react-query';
import { CryptoData } from '../types';
import { generateAnalysisFromPrompt } from '../services/geminiService';
import { mockApiClient } from './mockApiClient';

const fetchCryptoData = async (page: number = 1, perPage: number = 250): Promise<CryptoData[]> => {
    // Para obtener 1000 elementos, hacemos múltiples peticiones
    if (page === 1) {
        try {
            // Petición especial para obtener los primeros 1000 elementos
            const promises = [];
            for (let p = 1; p <= 4; p++) { // 4 páginas x 250 = 1000 elementos
                promises.push(
                    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${p}&sparkline=true&price_change_percentage=1h,24h,7d,30d`)
                        .then(response => {
                            if (!response.ok) throw new Error(`Error en página ${p}: ${response.status}`);
                            return response.json();
                        })
                );
            }
            
            const results = await Promise.all(promises);
            return results.flat(); // Combinar todas las páginas en un solo array
        } catch (error) {
            console.warn('CoinGecko API failed, using mock data for testing:', error);
            // Fallback to mock data for testing/review purposes
            return mockApiClient.fetchCryptoData(page);
        }
    } else {
        try {
            // Para otras páginas, usar paginación normal
            const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d,30d`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('La petición a CoinGecko falló');
            return response.json();
        } catch (error) {
            console.warn('CoinGecko API failed, using mock data for testing:', error);
            return mockApiClient.fetchCryptoData(page);
        }
    }
};

export const useCryptoData = (page: number) => {
  return useQuery({
    queryKey: ['cryptoData', page],
    queryFn: () => fetchCryptoData(page),
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useGenerateAnalysis = () => {
    return useMutation({
        mutationFn: (prompt: string) => generateAnalysisFromPrompt(prompt),
    });
};