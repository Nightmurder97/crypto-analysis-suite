// src/utils/csvCategoriesService.ts - Servicio para integrar categorías del CSV

import { CryptoData } from '../types';

export interface CryptoCategoryData {
  coin: string;
  description: string;
  rank: number;
  price: number;
  priceCurrency: string;
  marketCapitalization: number;
  marketCapCurrency: string;
  circulatingSupply: number;
  volumeMarketCapRatio: number;
  category: string;
}

// 🔄 Cache para evitar re-parsear el CSV múltiples veces
let csvDataCache: CryptoCategoryData[] | null = null;

// 📊 Función para parsear el CSV de categorías
export const parseCryptoCategoriesCSV = (csvContent: string): CryptoCategoryData[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    // Parseo más robusto para manejar comas dentro de comillas
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/"/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/"/g, ''));

    return {
      coin: values[0] || '',
      description: values[1] || '',
      rank: parseInt(values[2]) || 0,
      price: parseFloat(values[3]) || 0,
      priceCurrency: values[4] || 'USD',
      marketCapitalization: parseFloat(values[5]) || 0,
      marketCapCurrency: values[6] || 'USD',
      circulatingSupply: parseFloat(values[7]) || 0,
      volumeMarketCapRatio: parseFloat(values[8]) || 0,
      category: values[9] || 'Unknown'
    };
  });
};

// 🎯 Función para cargar y cachear los datos del CSV
export const loadCryptoCategoriesData = async (): Promise<CryptoCategoryData[]> => {
  if (csvDataCache) {
    return csvDataCache;
  }

  try {
    // Intentar cargar el archivo CSV desde el directorio public o desde una URL
    const response = await fetch('/crypto_coins_category.csv');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo de categorías');
    }
    
    const csvContent = await response.text();
    csvDataCache = parseCryptoCategoriesCSV(csvContent);
    
    console.log(`✅ Cargadas ${csvDataCache.length} categorías de criptomonedas del CSV`);
    return csvDataCache;
  } catch (error) {
    console.warn('⚠️ No se pudo cargar el CSV de categorías, usando clasificación manual', error);
    return [];
  }
};

// 🔍 Función para buscar la categoría de una criptomoneda
export const findCryptoCategoryByName = (
  cryptoName: string, 
  categoriesData: CryptoCategoryData[]
): string | null => {
  // Buscar por coincidencia exacta de nombre
  const exactMatch = categoriesData.find(
    cat => cat.coin.toLowerCase() === cryptoName.toLowerCase()
  );
  
  if (exactMatch) {
    return exactMatch.category;
  }

  // Buscar por coincidencia parcial en el nombre
  const partialMatch = categoriesData.find(
    cat => cat.coin.toLowerCase().includes(cryptoName.toLowerCase()) ||
           cryptoName.toLowerCase().includes(cat.coin.toLowerCase())
  );

  return partialMatch?.category || null;
};

// 🔍 Función para buscar por ranking
export const findCryptoCategoryByRank = (
  rank: number, 
  categoriesData: CryptoCategoryData[]
): string | null => {
  const match = categoriesData.find(cat => cat.rank === rank);
  return match?.category || null;
};

// 🎨 Función para mapear categorías del CSV a categorías visuales
export const mapCategoryToDisplayCategory = (csvCategory: string): string => {
  // Normalizar la categoría del CSV a nuestras categorías de display
  const category = csvCategory.toLowerCase().trim();
  
  // Mapeo de categorías del CSV a nuestras categorías de display
  const categoryMappings: { [key: string]: string } = {
    // Smart Contract Platforms
    'smart contract platform': 'Layer 1',
    'smart contract platforms': 'Layer 1',
    'blockchain': 'Layer 1',
    'layer 1': 'Layer 1',
    'platform': 'Layer 1',
    
    // DeFi
    'decentralized finance': 'DeFi',
    'defi': 'DeFi',
    'decentralized exchange': 'DeFi',
    'dex': 'DeFi',
    'yield farming': 'DeFi',
    'lending': 'DeFi',
    'liquidity': 'DeFi',
    
    // Layer 2
    'layer 2': 'Layer 2',
    'scaling': 'Layer 2',
    'rollup': 'Layer 2',
    'sidechain': 'Layer 2',
    
    // Gaming & Metaverse
    'gaming': 'Gaming & Metaverse',
    'game': 'Gaming & Metaverse',
    'metaverse': 'Gaming & Metaverse',
    'nft': 'Gaming & Metaverse',
    'virtual reality': 'Gaming & Metaverse',
    
    // AI & Data
    'artificial intelligence': 'AI & Big Data',
    'ai': 'AI & Big Data',
    'machine learning': 'AI & Big Data',
    'data': 'AI & Big Data',
    'oracle': 'AI & Big Data',
    
    // Infrastructure
    'infrastructure': 'Infrastructure',
    'storage': 'Infrastructure',
    'cloud': 'Infrastructure',
    'network': 'Infrastructure',
    'iot': 'Infrastructure',
    
    // Stablecoins
    'stablecoin': 'Stablecoins',
    'stable': 'Stablecoins',
    'fiat': 'Stablecoins',
    
    // Exchange Tokens
    'exchange': 'Exchange Tokens',
    'trading': 'Exchange Tokens',
    'cex': 'Exchange Tokens',
    
    // Meme Coins
    'meme': 'Meme Coins',
    'dog': 'Meme Coins',
    'shiba': 'Meme Coins',
    
    // Privacy
    'privacy': 'Privacy Coins',
    'anonymous': 'Privacy Coins',
    'private': 'Privacy Coins',
    
    // Payments
    'payment': 'Payments',
    'currency': 'Payments',
    'money': 'Payments'
  };

  // Buscar coincidencia en el mapeo
  for (const [csvCat, displayCat] of Object.entries(categoryMappings)) {
    if (category.includes(csvCat)) {
      return displayCat;
    }
  }

  // Si no encontramos coincidencia, usar la categoría original (capitalizada)
  return csvCategory.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Others';
};

// 🔄 Función principal para enriquecer datos de CoinGecko con categorías del CSV
export const enrichCryptoDataWithCategories = async (
  coinGeckoData: CryptoData[]
): Promise<(CryptoData & { category: string })[]> => {
  const categoriesData = await loadCryptoCategoriesData();
  
  if (categoriesData.length === 0) {
    console.warn('⚠️ No hay datos de categorías disponibles, usando fallback');
    return coinGeckoData.map(crypto => ({
      ...crypto,
      category: 'Others'
    }));
  }

  return coinGeckoData.map(crypto => {
    // Intentar encontrar la categoría por ranking (más preciso)
    let category = findCryptoCategoryByRank(crypto.market_cap_rank || 0, categoriesData);
    
    // Si no encontramos por ranking, intentar por nombre
    if (!category) {
      category = findCryptoCategoryByName(crypto.name, categoriesData);
    }
    
    // Si aún no encontramos, intentar por símbolo
    if (!category) {
      category = findCryptoCategoryByName(crypto.symbol, categoriesData);
    }
    
    // Mapear a nuestras categorías de display
    const displayCategory = category ? mapCategoryToDisplayCategory(category) : 'Others';
    
    return {
      ...crypto,
      category: displayCategory
    };
  });
};

// 📊 Función para obtener estadísticas de categorías
export const getCategoriesStatistics = (categoriesData: CryptoCategoryData[]) => {
  const categoryCount: { [key: string]: number } = {};
  const categoryMarketCap: { [key: string]: number } = {};
  
  categoriesData.forEach(crypto => {
    const displayCategory = mapCategoryToDisplayCategory(crypto.category);
    
    categoryCount[displayCategory] = (categoryCount[displayCategory] || 0) + 1;
    categoryMarketCap[displayCategory] = (categoryMarketCap[displayCategory] || 0) + crypto.marketCapitalization;
  });
  
  return {
    categoryCount,
    categoryMarketCap,
    totalCategories: Object.keys(categoryCount).length,
    totalCoins: categoriesData.length
  };
};

// 🎯 Hook de React para usar las categorías (opcional, para React Query)
export const useCryptoCategories = () => {
  const [categoriesData, setCategoriesData] = React.useState<CryptoCategoryData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadCryptoCategoriesData()
      .then(data => {
        setCategoriesData(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { categoriesData, isLoading, error };
};