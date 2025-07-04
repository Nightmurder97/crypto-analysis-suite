import { CryptoData } from '../types';

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

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

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Attempt to parse error from CoinGecko if possible
      let errorMsg = `Failed to fetch data from CoinGecko: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.status && errorData.status.error_message) {
          errorMsg += ` - ${errorData.status.error_message}`;
        } else if (errorData && errorData.error) {
           errorMsg += ` - ${errorData.error}`;
        }
      } catch (parseError) {
        // Ignore if error response is not JSON
      }
      throw new Error(errorMsg);
    }
    const rawData: any[] = await response.json();
    
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

  } catch (error) {
    console.error("Error fetching from CoinGecko:", error);
    throw error; // Re-throw to be caught by caller
  }
}
