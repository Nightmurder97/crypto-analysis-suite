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

// Función para obtener todos los datos (~1000 tokens) con rate limiting
export const fetchCryptoData = async (): Promise<CryptoData[]> => {
    try {
        const pages = [1, 2, 3, 4];
        const results: CryptoData[] = [];
        
        // Hacer llamadas secuenciales con delay para evitar rate limiting
        for (const page of pages) {
            console.log(`Fetching page ${page} of crypto data...`);
            const pageData = await fetchCryptoDataPage(page, 250);
            results.push(...pageData);
            
            // Añadir delay de 300ms entre llamadas (excepto la última)
            if (page !== pages[pages.length - 1]) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        console.log(`Successfully fetched ${results.length} crypto tokens`);
        return results;
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