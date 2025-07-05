import { CryptoData } from '../types';

export interface PreAnalysisResult {
  topPerformers1h: string;
  topPerformers24h: string;
  topPerformers7d: string;
  topPerformers30d: string;
  marketCapAnalysis: string;
  // ... se pueden añadir más secciones pre-calculadas aquí
}

const formatTopPerformers = (data: CryptoData[], key: keyof CryptoData, period: string): string => {
  return data
    .filter(c => typeof c[key] === 'number')
    .sort((a, b) => (b[key] as number) - (a[key] as number))
    .slice(0, 10)
    .map((c, i) => `${i + 1}. **${c.name}** (${c.symbol.toUpperCase()}) 🟢 ${c[key]?.toFixed(2)}%`)
    .join('\n');
};

const formatMarketCapGroups = (data: CryptoData[]): string => {
    const largeCaps = data.filter(c => c.market_cap && c.market_cap > 10e9);
    const midCaps = data.filter(c => c.market_cap && c.market_cap >= 1e9 && c.market_cap < 10e9);
    const smallCaps = data.filter(c => c.market_cap && c.market_cap >= 100e6 && c.market_cap < 1e9);

    const formatGroup = (title: string, groupData: CryptoData[]) => {
        let section = `### ${title}\n\n`;
        section += formatTopPerformers(groupData, 'price_change_percentage_24h', '24h');
        section += '\n';
        return section;
    }

    let result = "## 🏢 Análisis por Grupos de Capitalización\n\n";
    result += formatGroup('Grupo 1: Large Caps (>$10B)', largeCaps);
    result += formatGroup('🔹 GRUPO 2: MID CAPS ($1B - $10B)', midCaps);
    result += formatGroup('🔸 GRUPO 3: SMALL CAPS ($100M - $1B)', smallCaps);

    return result;
}

export const performPreAnalysis = (data: CryptoData[]): PreAnalysisResult => {
  const topPerformers1h = formatTopPerformers(data, 'price_change_percentage_1h_in_currency', '1h');
  const topPerformers24h = formatTopPerformers(data, 'price_change_percentage_24h', '24h');
  const topPerformers7d = formatTopPerformers(data, 'price_change_percentage_7d_in_currency', '7d');
  const topPerformers30d = formatTopPerformers(data, 'price_change_percentage_30d_in_currency', '30d');
  
  const marketCapAnalysis = formatMarketCapGroups(data);

  return {
    topPerformers1h,
    topPerformers24h,
    topPerformers7d,
    topPerformers30d,
    marketCapAnalysis,
  };
}; 