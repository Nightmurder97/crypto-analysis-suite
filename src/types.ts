// 🪙 Interfaz principal para datos de CoinGecko (extendida con categoría)
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
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
  last_updated: string;
  
  // Datos de cambios de precio adicionales
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  price_change_percentage_30d_in_currency?: number | null;
  price_change_percentage_1y_in_currency?: number | null;
  
  // Sparkline data para gráficos
  sparkline_in_7d?: {
    price: number[];
  } | null;
  
  // 🆕 Nueva propiedad para categoría (integrada desde CSV)
  category?: string;
  
  [key: string]: any; // Index signature for dynamic access
}

// 📊 Interfaz para datos del CSV de categorías
export interface CryptoCategoryData {
  coin: string;                    // Nombre de la criptomoneda
  description: string;             // Descripción
  rank: number;                    // Ranking por capitalización (1-1000)
  price: number;                   // Precio en USD
  priceCurrency: string;           // Moneda del precio (USD)
  marketCapitalization: number;    // Capitalización de mercado
  marketCapCurrency: string;       // Moneda de la capitalización
  circulatingSupply: number;       // Suministro circulante
  volumeMarketCapRatio: number;    // Ratio volumen/capitalización
  category: string;                // 🎯 Categoría del sector (lo más importante)
}

// 🎨 Tipos para métricas de heatmap
export type HeatmapMetric = 
  | 'price_change_percentage_1h_in_currency'
  | 'price_change_percentage_24h'
  | 'price_change_percentage_7d_in_currency'
  | 'price_change_percentage_30d_in_currency'
  | 'current_price'
  | 'market_cap'
  | 'total_volume';

// 📈 Interfaz para datos de análisis sectorial
export interface SectorAnalysisData {
  name: string;                                           // Nombre del sector
  count: number;                                          // Número de activos
  avgChange: number;                                      // Cambio promedio 24h
  totalMarketCap: number;                                // Capitalización total del sector
  totalVolume: number;                                   // Volumen total 24h
  topPerformers: (CryptoData & { category: string })[];  // Mejores performers
  worstPerformers: (CryptoData & { category: string })[]; // Peores performers
  cryptos: (CryptoData & { category: string })[];        // Todas las criptos del sector
  csvInfo?: {                                            // Información adicional del CSV
    originalCategories: string[];                        // Categorías originales del CSV
    avgPrice: number;                                    // Precio promedio
    totalSupply: number;                                 // Suministro total
  };
}

// 🔍 Interfaz para estadísticas de categorías
export interface CategoryStatistics {
  categoryCount: { [key: string]: number };     // Conteo por categoría
  categoryMarketCap: { [key: string]: number }; // Market cap por categoría
  totalCategories: number;                      // Total de categorías únicas
  totalCoins: number;                          // Total de criptomonedas
}

// 📊 Interfaz para distribución de rendimientos
export interface PerformanceDistribution {
  extremeGain: number;      // > +20%
  strongGain: number;       // +5% a +20%
  moderateGain: number;     // 0% a +5%
  neutral: number;          // 0%
  moderateLoss: number;     // 0% a -5%
  strongLoss: number;       // -5% a -20%
  extremeLoss: number;      // < -20%
}

// 📈 Interfaz para estadísticas completas del mercado
export interface MarketStatistics {
  total: number;                              // Total de criptomonedas analizadas
  avg24h: number;                            // Cambio promedio 24h
  median24h: number;                         // Cambio mediano 24h
  stdDev: number;                           // Desviación estándar
  distribution: PerformanceDistribution;    // Distribución de rendimientos
  totalVolume: number;                      // Volumen total
  avgVolume: number;                        // Volumen promedio
  highVolumeAssets: CryptoData[];          // Activos con alto volumen
  topPerformers: CryptoData[];             // Top 10 performers
  bottomPerformers: CryptoData[];          // Bottom 10 performers
  totalMarketCap: number;                  // Capitalización total
  largeCap: CryptoData[];                  // Large cap (>$10B)
  midCap: CryptoData[];                    // Mid cap ($1B-$10B)
  smallCap: CryptoData[];                  // Small cap (<$1B)
  validData: CryptoData[];                 // Datos válidos para cálculos
}

// 🎯 Interfaz para configuración de mapeo de categorías
export interface CategoryMapping {
  [csvCategory: string]: string;  // CSV category -> Display category
}

// 🔄 Interfaz para el estado de carga del CSV
export interface CSVLoadState {
  isLoading: boolean;
  error: string | null;
  data: CryptoCategoryData[];
  fileName: string;
}

// 🎨 Tipos para colores de sectores
export type SectorColorGradient = 
  | 'from-emerald-400 via-green-500 to-emerald-600'    // Muy positivo
  | 'from-green-400 via-green-500 to-green-600'        // Positivo
  | 'from-green-300 via-green-400 to-green-500'        // Ligeramente positivo
  | 'from-yellow-300 via-green-400 to-green-500'       // Neutral positivo
  | 'from-yellow-400 via-orange-400 to-yellow-500'     // Neutral
  | 'from-orange-400 via-red-400 to-orange-500'        // Ligeramente negativo
  | 'from-red-400 via-red-500 to-red-600'              // Negativo
  | 'from-red-500 via-red-600 to-red-700';             // Muy negativo

// 🏷️ Constantes para categorías de display
export const DISPLAY_CATEGORIES = [
  'Layer 1',
  'DeFi', 
  'Layer 2',
  'AI & Big Data',
  'Gaming & Metaverse',
  'Meme Coins',
  'Infrastructure',
  'Stablecoins',
  'Exchange Tokens',
  'Privacy Coins',
  'Payments',
  'Others'
] as const;

export type DisplayCategory = typeof DISPLAY_CATEGORIES[number];

// 🎯 Interfaz para el análisis de IA
export interface AIAnalysisResult {
  content: string;              // Contenido del análisis
  timestamp: Date;              // Fecha de generación
  cryptosAnalyzed: number;      // Número de criptos analizadas
  sectorsAnalyzed: number;      // Número de sectores analizados
  marketSentiment: 'bullish' | 'bearish' | 'neutral';  // Sentimiento del mercado
  confidence: number;           // Nivel de confianza (0-1)
}

// 📁 Interfaz para configuración de exportación
export interface ExportConfig {
  format: 'csv' | 'xlsx' | 'json' | 'md';
  includeCategories: boolean;
  includeSectorialAnalysis: boolean;
  includeStatistics: boolean;
  filename?: string;
}

// 🎮 Interfaz para el simulador de portafolio
export interface PortfolioSimulation {
  assets: {
    crypto: CryptoData;
    allocation: number;  // Porcentaje (0-100)
    amount: number;      // Cantidad en USD
  }[];
  totalValue: number;
  performance24h: number;
  riskScore: number;      // 0-10
  diversificationScore: number;  // 0-10
}

// 🎨 Tipo para las pestañas de la aplicación
export type ActiveTab = 
  | 'overview' 
  | 'marketHeatmap' 
  | 'classicHeatmap' 
  | 'sectorHeatmap' 
  | 'statistics' 
  | 'aiAnalysis' 
  | 'simulator' 
  | 'reports';

// 🔧 Interfaz para configuración de la aplicación
export interface AppConfig {
  excludeStablecoins: boolean;
  refreshInterval: number;        // Milisegundos
  heatmapItemsPerPage: number;
  classicHeatmapItemsPerPage: number;
  enableCSVIntegration: boolean;
  defaultTab: ActiveTab;
}

// 📊 Interfaz extendida para CryptoData con información del CSV
export interface EnrichedCryptoData extends CryptoData {
  category: string;                      // Categoría asignada
  csvData?: CryptoCategoryData;          // Datos originales del CSV (opcional)
  sectorRank?: number;                   // Ranking dentro del sector
  sectorPerformance?: number;            // Performance relativa al sector
}

// 🎯 Helper types para mejor tipado
export type CryptoDataKey = keyof CryptoData;
export type NumericCryptoDataKey = {
  [K in CryptoDataKey]: CryptoData[K] extends number | null ? K : never;
}[CryptoDataKey];

// 🔍 Interfaz para filtros de búsqueda
export interface SearchFilters {
  query: string;
  category?: string;
  priceRange?: [number, number];
  marketCapRange?: [number, number];
  changeRange?: [number, number];
  sortBy: NumericCryptoDataKey;
  sortDirection: 'asc' | 'desc';
}

// 🎭 Tipo para diferentes vistas de la aplicación
export type ViewType = 
  | 'table'
  | 'heatmap'
  | 'classic-heatmap'
  | 'sector-heatmap'
  | 'statistics'
  | 'analysis'
  | 'simulator'
  | 'reports';

