import { useQuery, useMutation } from '@tanstack/react-query';
import { CryptoData } from '../types';
import { generateAnalysisFromPrompt } from '../services/geminiService';

const fetchCryptoData = async (page: number = 1, perPage: number = 250): Promise<CryptoData[]> => {
    // Para obtener 1000 elementos, hacemos múltiples peticiones
    if (page === 1) {
        // Petición especial para obtener los primeros 1000 elementos
        const promises = [];
        for (let p = 1; p <= 4; p++) { // 4 páginas x 250 = 1000 elementos
            promises.push(
                fetch(`/api/coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${p}&sparkline=true&price_change_percentage=1h,24h,7d,30d`)
                    .then(response => {
                        if (!response.ok) throw new Error(`Error en página ${p}: ${response.status} - ${response.statusText}`);
                        return response.json();
                    })
            );
        }
        
        const results = await Promise.all(promises);
        return results.flat(); // Combinar todas las páginas en un solo array
    } else {
        // Para otras páginas, usar paginación normal
        const url = `/api/coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d,30d`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`La petición a CoinGecko falló: ${response.status} - ${response.statusText}`);
        return response.json();
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