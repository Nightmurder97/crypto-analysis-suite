// Mock data service for testing purposes
import { CryptoData } from '../types';

// Generate mock data based on the CSV structure
const generateMockCryptoData = (count: number): CryptoData[] => {
  const mockData: CryptoData[] = [];

  const cryptoNames = [
    'Bitcoin', 'Ethereum', 'Tether', 'BNB', 'XRP', 'Solana', 'USDC', 'Cardano', 
    'Avalanche', 'Dogecoin', 'Polygon', 'Chainlink', 'Litecoin', 'Uniswap', 'Bitcoin Cash',
    'Stellar', 'Cosmos', 'Algorand', 'VeChain', 'Filecoin', 'TRON', 'Hedera', 'Cronos',
    'Near Protocol', 'Flow', 'Internet Computer', 'ApeCoin', 'Theta Network', 'Decentraland',
    'The Sandbox'
  ];

  for (let i = 0; i < count; i++) {
    const nameIndex = i % cryptoNames.length;
    const priceChange = (Math.random() - 0.5) * 40; // -20% to +20%
    
    mockData.push({
      id: `crypto-${i}`,
      symbol: cryptoNames[nameIndex].toLowerCase().replace(' ', ''),
      name: `${cryptoNames[nameIndex]} ${Math.floor(i / cryptoNames.length) > 0 ? Math.floor(i / cryptoNames.length) : ''}`.trim(),
      image: `https://assets.coingecko.com/coins/images/${i + 1}/large/coin.png`,
      current_price: Math.random() * 50000 + 0.01,
      market_cap: Math.random() * 1000000000000,
      market_cap_rank: i + 1,
      fully_diluted_valuation: Math.random() * 1200000000000,
      total_volume: Math.random() * 50000000000,
      high_24h: Math.random() * 60000,
      low_24h: Math.random() * 40000,
      price_change_24h: priceChange,
      price_change_percentage_24h: priceChange,
      price_change_percentage_7d_in_currency: (Math.random() - 0.5) * 60,
      price_change_percentage_30d_in_currency: (Math.random() - 0.5) * 100,
      price_change_percentage_1h_in_currency: (Math.random() - 0.5) * 10,
      market_cap_change_24h: Math.random() * 1000000000,
      market_cap_change_percentage_24h: priceChange,
      circulating_supply: Math.random() * 1000000000,
      total_supply: Math.random() * 1200000000,
      max_supply: Math.random() * 1500000000,
      ath: Math.random() * 70000,
      ath_change_percentage: (Math.random() - 1) * 100,
      ath_date: '2021-11-10T14:24:11.849Z',
      atl: Math.random() * 100,
      atl_change_percentage: Math.random() * 10000,
      atl_date: '2020-03-13T02:31:30.069Z',
      roi: null,
      last_updated: new Date().toISOString(),
      sparkline_in_7d: {
        price: Array.from({ length: 168 }, () => Math.random() * 50000)
      }
    });
  }

  return mockData;
};

export const mockApiClient = {
  fetchCryptoData: async (page: number = 1): Promise<CryptoData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (page === 1) {
      // Return 1000 items for the first page as per PR requirements
      return generateMockCryptoData(1000);
    } else {
      return generateMockCryptoData(250);
    }
  }
};