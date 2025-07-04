import { CryptoData } from '../types';

const COINGECKO_BASE_URL = '/api/coingecko';

// Función para delay entre peticiones
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para reintentar peticiones con backoff exponencial
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      const delayTime = baseDelay * Math.pow(2, i);
      console.log(`Intento ${i + 1} falló, reintentando en ${delayTime}ms...`);
      await delay(delayTime);
    }
  }
  
  throw lastError!;
}

export async function fetchCoinGeckoMarketData(page: number = 1, perPage: number = 250): Promise<CryptoData[]> {
  // CoinGecko puede devolver hasta 250 criptomonedas por página
  const maxAllowed = 250;
  const actualPerPage = Math.min(perPage, maxAllowed);
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: actualPerPage.toString(),
    page: page.toString(),
    sparkline: 'true', // Fetch sparkline data
    price_change_percentage: '1h,24h,7d,30d', // Request needed percentages
  });

  const url = `${COINGECKO_BASE_URL}/coins/markets?${params.toString()}`;

  const fetchData = async (): Promise<CryptoData[]> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; crypto-analysis-suite/1.0)',
      'Origin': 'http://localhost:5173'
    };

    // Add API key if available (Demo/Free API uses different header)
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }

    console.log(`Fetching page ${page} from CoinGecko (${actualPerPage} criptomonedas)...`);
    
    const response = await fetch(url, { 
      headers,
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      // Attempt to parse error from CoinGecko if possible
      let errorMsg = `Failed to fetch data from CoinGecko: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMsg += ` - ${errorData.error}`;
        }
        if (errorData && errorData.status && errorData.status.error_message) {
          errorMsg += ` - ${errorData.status.error_message}`;
        }
      } catch (parseError) {
        // Si no podemos parsear el error, mantener mensaje original
        console.warn('Error parsing API response');
      }
      
      throw new Error(errorMsg);
    }
    
    const rawData: any[] = await response.json();
    console.log(`Successfully fetched ${rawData.length} coins from page ${page}`);
    
    // Map rawData to CryptoData structure
    return rawData.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap_change_24h: coin.market_cap_change_24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      ath_change_percentage: coin.ath_change_percentage,
      ath_date: coin.ath_date,
      atl: coin.atl,
      atl_change_percentage: coin.atl_change_percentage,
      atl_date: coin.atl_date,
      roi: coin.roi,
      last_updated: coin.last_updated,
      sparkline_in_7d: coin.sparkline_in_7d,
      price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency,
      // Campos adicionales para compatibilidad
      rank: coin.market_cap_rank,
      code: coin.symbol,
      price_usd: coin.current_price,
      volume_24h: coin.total_volume,
      delta_hour_pct: coin.price_change_percentage_1h_in_currency,
      delta_day_pct: coin.price_change_percentage_24h,
      delta_week_pct: coin.price_change_percentage_7d_in_currency,
      delta_month_pct: coin.price_change_percentage_30d_in_currency,
      delta_quarter_pct: null,
      delta_year_pct: null,
      categories: null,
      ath_usd: coin.ath,
      liquidity: null, 
      exchanges: null,
      markets: null,
      pairs: null,
      age_days: null,
    }));
  };

  try {
    return await retryWithBackoff(fetchData, 2, 1000);
  } catch (error) {
    console.error(`Error fetching page ${page} from CoinGecko:`, error);
    throw error; // Propagar el error en lugar de usar datos de prueba
  }
}

// Función principal para obtener datos de criptomonedas
export async function fetchCryptoData(page: number = 1, totalCoins: number = 1000): Promise<{
  cryptoData: CryptoData[];
  usingMockData: boolean;
}> {
  try {
    // CoinGecko puede devolver hasta 250 criptomonedas por página
    const maxPerPage = 250;
    const totalPages = Math.ceil(totalCoins / maxPerPage);
    
    console.log(`🚀 Cargando ${totalCoins} criptomonedas en ${totalPages} páginas de ${maxPerPage} cada una...`);
    
    const allData: CryptoData[] = [];
    
    // Hacer peticiones paginadas
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const remainingCoins = totalCoins - allData.length;
      const coinsToFetch = Math.min(maxPerPage, remainingCoins);
      
      console.log(`📄 Cargando página ${currentPage}/${totalPages} (${coinsToFetch} criptomonedas)...`);
      
      const pageData = await fetchCoinGeckoMarketData(currentPage, coinsToFetch);
      allData.push(...pageData);
      
      // Si obtuvimos menos datos de los esperados, probablemente llegamos al final
      if (pageData.length < coinsToFetch) {
        console.log(`⚠️ Página ${currentPage} devolvió ${pageData.length} criptomonedas, menos de las ${coinsToFetch} esperadas. Finalizando carga.`);
        break;
      }
      
      // Pequeña pausa entre peticiones para evitar rate limiting
      if (currentPage < totalPages) {
        await delay(300);
      }
    }
    
    console.log(`✅ Carga completada: ${allData.length} criptomonedas reales de CoinGecko`);
    
    return {
      cryptoData: allData,
      usingMockData: false // Siempre falso porque ya no usamos datos de prueba
    };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error; // Propagar el error en lugar de usar datos de prueba
  }
}
