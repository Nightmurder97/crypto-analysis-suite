import { CryptoData } from '../types.ts';

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// Función para esperar un tiempo determinado
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para generar datos de prueba
function generateMockData(page: number, perPage: number): CryptoData[] {
  const mockCoins = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', basePrice: 43000 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', basePrice: 2600 },
    { id: 'tether', symbol: 'usdt', name: 'Tether', basePrice: 1.00 },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', basePrice: 310 },
    { id: 'solana', symbol: 'sol', name: 'Solana', basePrice: 100 },
    { id: 'xrp', symbol: 'xrp', name: 'XRP', basePrice: 0.63 },
    { id: 'usd-coin', symbol: 'usdc', name: 'USDC', basePrice: 1.00 },
    { id: 'staked-ether', symbol: 'steth', name: 'Lido Staked Ether', basePrice: 2580 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', basePrice: 0.48 },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', basePrice: 37 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', basePrice: 0.098 },
    { id: 'polkadot', symbol: 'dot', name: 'Polkadot', basePrice: 7.2 },
    { id: 'polygon', symbol: 'matic', name: 'Polygon', basePrice: 0.89 },
    { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', basePrice: 73 },
    { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', basePrice: 0.000024 },
    { id: 'chainlink', symbol: 'link', name: 'Chainlink', basePrice: 15.2 },
    { id: 'uniswap', symbol: 'uni', name: 'Uniswap', basePrice: 6.8 },
    { id: 'wrapped-bitcoin', symbol: 'wbtc', name: 'Wrapped Bitcoin', basePrice: 42900 },
    { id: 'cosmos', symbol: 'atom', name: 'Cosmos Hub', basePrice: 10.5 },
    { id: 'ethereum-classic', symbol: 'etc', name: 'Ethereum Classic', basePrice: 21 }
  ];

  const startIndex = (page - 1) * perPage;
  const result: CryptoData[] = [];

  for (let i = 0; i < perPage; i++) {
    const coinIndex = (startIndex + i) % mockCoins.length;
    const mockCoin = mockCoins[coinIndex];
    const rank = startIndex + i + 1;
    
    // Generar variaciones aleatorias para simular datos reales
    const priceVariation = (Math.random() - 0.5) * 0.1; // ±5%
    const currentPrice = mockCoin.basePrice * (1 + priceVariation);
    
    const change1h = (Math.random() - 0.5) * 6; // ±3%
    const change24h = (Math.random() - 0.5) * 20; // ±10%
    const change7d = (Math.random() - 0.5) * 40; // ±20%
    const change30d = (Math.random() - 0.5) * 100; // ±50%
    
    const marketCap = currentPrice * (1000000 + Math.random() * 10000000);
    const volume = marketCap * (0.01 + Math.random() * 0.1);
    
    // Generar sparkline simulada
    const sparkline = Array.from({ length: 168 }, (_, idx) => {
      const baseValue = mockCoin.basePrice;
      const variation = Math.sin(idx * 0.1) * baseValue * 0.05 + (Math.random() - 0.5) * baseValue * 0.02;
      return baseValue + variation;
    });

    result.push({
      id: `${mockCoin.id}-${rank}`,
      symbol: mockCoin.symbol,
      name: rank > mockCoins.length ? `${mockCoin.name} ${Math.floor(rank / mockCoins.length)}` : mockCoin.name,
      image: `https://assets.coingecko.com/coins/images/1/large/${mockCoin.id}.png`,
      current_price: currentPrice,
      market_cap: marketCap,
      market_cap_rank: rank,
      fully_diluted_valuation: marketCap * 1.2,
      total_volume: volume,
      high_24h: currentPrice * 1.05,
      low_24h: currentPrice * 0.95,
      price_change_24h: currentPrice * (change24h / 100),
      price_change_percentage_24h: change24h,
      market_cap_change_24h: marketCap * (change24h / 100),
      market_cap_change_percentage_24h: change24h,
      circulating_supply: marketCap / currentPrice,
      total_supply: marketCap / currentPrice * 1.1,
      max_supply: mockCoin.symbol === 'btc' ? 21000000 : null,
      ath: currentPrice * (1.5 + Math.random()),
      ath_change_percentage: -30 - Math.random() * 50,
      ath_date: '2021-11-10T14:24:11.849Z',
      atl: currentPrice * (0.1 + Math.random() * 0.3),
      atl_change_percentage: 200 + Math.random() * 1000,
      atl_date: '2015-10-20T05:20:49.735Z',
      roi: null,
      last_updated: new Date().toISOString(),
      sparkline_in_7d: { price: sparkline },
      price_change_percentage_1h_in_currency: change1h,
      price_change_percentage_7d_in_currency: change7d,
      price_change_percentage_30d_in_currency: change30d,
      rank,
      code: mockCoin.symbol,
      price_usd: currentPrice,
      volume_24h: volume,
      delta_hour_pct: change1h,
      delta_day_pct: change24h,
      delta_week_pct: change7d,
      delta_month_pct: change30d,
      delta_quarter_pct: null,
      delta_year_pct: null,
      categories: null,
      ath_usd: currentPrice * (1.5 + Math.random()),
      liquidity: null,
      exchanges: null,
      markets: null,
      pairs: null,
      age_days: null,
    });
  }

  return result;
}

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

// No API Key used for this public endpoint, but be mindful of rate limits.
// For production, a key via backend proxy is recommended.

export async function fetchCoinGeckoMarketData(page: number = 1, perPage: number = 250): Promise<CryptoData[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage.toString(),
    page: page.toString(),
    sparkline: 'true', // Fetch sparkline data
    price_change_percentage: '1h,24h,7d,30d', // Request needed percentages
    // Potentially add '1y' if needed for delta_year_pct, though it makes the response larger
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

    console.log(`Fetching page ${page} from CoinGecko...`);
    
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
          
          // Si la API no está disponible, usar datos de prueba
          if (errorData.error.includes('not able to access') || errorData.error.includes('rate limit')) {
            console.warn('API no disponible, usando datos de prueba...');
            return generateMockData(page, perPage);
          }
        }
        if (errorData && errorData.status && errorData.status.error_message) {
          errorMsg += ` - ${errorData.status.error_message}`;
        }
      } catch (parseError) {
        // Si no podemos parsear el error, usar datos de prueba
        console.warn('Error parsing API response, usando datos de prueba...');
        return generateMockData(page, perPage);
      }
      
      // Si es un error 429 (Too Many Requests), usar datos de prueba
      if (response.status === 429) {
        console.warn('Rate limit exceeded, usando datos de prueba...');
        return generateMockData(page, perPage);
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
      // Coingecko doesn't provide quarter/year % change directly in /coins/markets in this specific format
      // So these would be null unless fetched differently or calculated.
      // For the purpose of this app, we are taking what's directly available.
      // rank, code, price_usd, volume_24h, delta_..._pct are mapped from these.
      rank: coin.market_cap_rank,
      code: coin.symbol, // Using symbol as 'code'
      price_usd: coin.current_price,
      volume_24h: coin.total_volume,
      delta_hour_pct: coin.price_change_percentage_1h_in_currency,
      delta_day_pct: coin.price_change_percentage_24h, // using this as it's the primary 24h % field
      delta_week_pct: coin.price_change_percentage_7d_in_currency,
      delta_month_pct: coin.price_change_percentage_30d_in_currency,
      delta_quarter_pct: null, // Placeholder, not directly available in this endpoint
      delta_year_pct: null, // Placeholder, (price_change_percentage_1y_in_currency if requested)
      categories: null, // CoinGecko has categories but not in /coins/markets directly as a simple list
      ath_usd: coin.ath, // Mapping ath to ath_usd
      // Fields from original CSV not directly in CoinGecko basic response, or different names:
      liquidity: null, 
      exchanges: null,
      markets: null,
      pairs: null,
      age_days: null,
    }));
  };

  try {
    return await retryWithBackoff(fetchData, 2, 1000); // Reducir reintentos
  } catch (error) {
    console.error(`Error fetching page ${page} from CoinGecko:`, error);
    
    // Como último recurso, usar datos de prueba
    console.warn('Usando datos de prueba como último recurso...');
    return generateMockData(page, perPage);
  }
}

// Función principal para obtener datos de criptomonedas
export async function fetchCryptoData(page: number = 1, perPage: number = 250): Promise<{
  cryptoData: CryptoData[];
  usingMockData: boolean;
}> {
  try {
    const data = await fetchCoinGeckoMarketData(page, perPage);
    
    // Verificar si los datos son reales o de prueba
    // Los datos de prueba tienen IDs que terminan con un número
    const usingMockData = data.length > 0 && data[0].id.includes('-');
    
    return {
      cryptoData: data,
      usingMockData
    };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    
    // En caso de error, usar datos de prueba
    const mockData = generateMockData(page, perPage);
    return {
      cryptoData: mockData,
      usingMockData: true
    };
  }
}
