import { useQuery, useMutation } from '@tanstack/react-query';
import { CryptoData } from '../types';
import { generateAnalysisWithGemini } from '../services/geminiService';

const fetchCryptoData = async (page: number = 1, perPage: number = 50): Promise<CryptoData[]> => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('La petición a CoinGecko falló');
    return response.json();
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
        mutationFn: (prompt: string) => generateAnalysisWithGemini(prompt),
    });
};