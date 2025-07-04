export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string; // URL to the coin's image
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number | null; // Equivalent to 'volume_24h'
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null; // Equivalent to 'delta_day_pct'
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null; // Equivalent to 'ath_usd'
  ath_change_percentage: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string | null;
  sparkline_in_7d?: { // Optional, as it's requested via sparkline=true
    price: number[];
  };
  price_change_percentage_1h_in_currency: number | null; // Equivalent to 'delta_hour_pct'
  price_change_percentage_7d_in_currency: number | null; // Equivalent to 'delta_week_pct'
  price_change_percentage_30d_in_currency: number | null; // Equivalent to 'delta_month_pct' (fetched)
  
  [key: string]: any; // Index signature for dynamic access
}

export type ViewType = 
  | 'table'
  | 'heatmap'
  | 'classic-heatmap'
  | 'sector-heatmap'
  | 'statistics'
  | 'analysis'
  | 'simulator'
  | 'reports';

export type HeatmapMetric = 
  | 'price_change_percentage_1h_in_currency' 
  | 'price_change_percentage_24h'
  | 'price_change_percentage_7d_in_currency'
  | 'price_change_percentage_30d_in_currency'
  | 'market_cap'
  | 'total_volume'
  | 'current_price';