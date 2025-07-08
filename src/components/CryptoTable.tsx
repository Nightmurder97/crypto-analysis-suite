import React, { useState, useMemo, useRef } from 'react';
import { CryptoData } from '../types';
// useCryptoData is not used directly in this component anymore if data is always passed as prop
// import { useCryptoData } from '../utils/apiClient';
import { useVirtualizer } from '@tanstack/react-virtual';

interface CryptoTableProps {
  data: CryptoData[]; // Data is now mandatory
  onSelectCrypto: (cryptos: CryptoData[]) => void;
}

type SortKey = keyof CryptoData | 'name' | 'market_cap_rank' | 'current_price' | 'total_volume' | 'price_change_percentage_1h_in_currency' | 'price_change_percentage_24h' | 'price_change_percentage_7d_in_currency' | 'price_change_percentage_30d_in_currency' | null;
type SortOrder = 'asc' | 'desc';

// Helper for consistent column widths. Using flex-basis.
const columnConfig = [
  { key: null, label: 'Select', flex: '0 0 4rem' }, // 64px
  { key: 'market_cap_rank', label: '#', flex: '0 0 3rem' }, // 48px
  { key: 'name', label: 'Name', flex: '1 1 13rem' }, // Flex-grow, flex-shrink, basis 208px
  { key: 'current_price', label: 'Price', flex: '0 0 8rem' }, // 128px
  { key: 'price_change_percentage_1h_in_currency', label: '1h %', flex: '0 0 6rem' }, // 96px
  { key: 'price_change_percentage_24h', label: '24h %', flex: '0 0 6rem' }, // 96px
  { key: 'price_change_percentage_7d_in_currency', label: '7d %', flex: '0 0 6rem' }, // 96px
  { key: 'market_cap', label: 'Market Cap', flex: '0 0 9rem' }, // 144px
  { key: 'total_volume', label: 'Volume (24h)', flex: '0 0 9rem' }, // 144px
  { key: 'sparkline_in_7d', label: '7d Trend', flex: '0 0 7rem' }, // 112px
];

const Sparkline: React.FC<{ data: number[], color?: string }> = ({ data, color = 'currentColor' }) => {
  if (!data || data.length < 2) return <span className="text-slate-500 text-xs">N/A</span>;

  const width = 60;
  const height = 20;
  const padding = 2;

  const yMax = Math.max(...data);
  const yMin = Math.min(...data);
  const yRange = yMax - yMin === 0 ? 1 : yMax - yMin; // Avoid division by zero

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((val - yMin) / yRange) * (height - 2 * padding) - padding;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-16 h-5" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
};

const CryptoTable: React.FC<CryptoTableProps> = ({ data: initialData, onSelectCrypto }) => {
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCryptos, setSelectedCryptos] = useState<Set<string>>(new Set());

  // Data is now passed directly as a prop, no internal fetching
  // const { data: fetchedData, isLoading, error } = useCryptoData(currentPage || 1);
  // const data = externalData || fetchedData;

  const sortedData = useMemo(() => {
    if (!initialData) return [];
    const dataToSort = [...initialData];
    if (!sortKey) return dataToSort;

    return dataToSort.sort((a, b) => {
      const valA = a[sortKey as keyof CryptoData];
      const valB = b[sortKey as keyof CryptoData];

      if (valA === null || valA === undefined || Number.isNaN(valA)) return 1;
      if (valB === null || valB === undefined || Number.isNaN(valB)) return -1;
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });
  }, [initialData, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleCryptoSelect = (crypto: CryptoData, isSelected: boolean) => {
    const newSelected = new Set(selectedCryptos);
    if (isSelected) {
      newSelected.add(crypto.id);
    } else {
      newSelected.delete(crypto.id);
    }
    setSelectedCryptos(newSelected);
    
    // Notify parent with selected cryptos data
    const selectedDataItems = sortedData.filter((coin: CryptoData) => newSelected.has(coin.id));
    onSelectCrypto(selectedDataItems);
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return <span className="text-slate-500">N/A</span>;
    const color = value > 0 ? 'text-emerald-400' : value < 0 ? 'text-red-400' : 'text-slate-400';
    return <span className={color}>{value.toFixed(2)}%</span>;
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return <span className="text-slate-500">N/A</span>;
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: value < 1 ? 6 : 2 })}`;
  };
  
  const formatBigNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return <span className="text-slate-500">N/A</span>;
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  }

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53, // Estimate row height in pixels
    overscan: 10,
  });

  if (!initialData || initialData.length === 0) {
    return (
        <div className="flex justify-center items-center h-64">
            <p className="text-slate-400">No data to display.</p>
        </div>
    );
  }

  return (
    <div ref={parentRef} className="overflow-auto shadow-md rounded-lg max-h-[calc(100vh-280px)] bg-slate-800">
      <div className="sticky top-0 z-10 bg-slate-700">
        <div className="flex text-xs text-slate-400 uppercase">
          {columnConfig.map(col => (
            <div
              key={col.key as string || 'select'}
              className="px-4 py-3"
              style={{ flex: col.flex }}
              onClick={() => col.key && handleSort(col.key)}
            >
              {col.label}
              {sortKey === col.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const coin = sortedData[virtualRow.index];
          if (!coin) return null;
          return (
            <div
              key={coin.id || virtualRow.index}
              className="flex items-center border-b border-slate-700 hover:bg-slate-700/50"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="px-4 py-3" style={{ flex: columnConfig[0].flex }}>
                 <input
                    type="checkbox"
                    aria-label={`Select ${coin.name}`}
                    checked={selectedCryptos.has(coin.id)}
                    onChange={(e) => handleCryptoSelect(coin, e.target.checked)}
                    className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                  />
              </div>
              <div className="px-4 py-3 font-medium text-slate-200" style={{ flex: columnConfig[1].flex }}>{coin.market_cap_rank}</div>
              <div className="px-4 py-3" style={{ flex: columnConfig[2].flex }}>
                <div className="flex items-center">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full shrink-0 object-cover"/>
                  <span className="font-bold mr-2 text-slate-100 shrink-0">{coin.symbol?.toUpperCase()}</span>
                  <span className="truncate">{coin.name}</span>
                </div>
              </div>
              <div className="px-4 py-3" style={{ flex: columnConfig[3].flex }}>{formatCurrency(coin.current_price)}</div>
              <div className="px-4 py-3" style={{ flex: columnConfig[4].flex }}>{formatPercentage(coin.price_change_percentage_1h_in_currency)}</div>
              <div className="px-4 py-3" style={{ flex: columnConfig[5].flex }}>{formatPercentage(coin.price_change_percentage_24h)}</div>
              <div className="px-4 py-3" style={{ flex: columnConfig[6].flex }}>{formatPercentage(coin.price_change_percentage_7d_in_currency)}</div>
              <div className="px-4 py-3" style={{ flex: columnConfig[7].flex }}>{formatBigNumber(coin.market_cap)}</div>
              <div className="px-4 py-3" style={{ flex: columnConfig[8].flex }}>{formatBigNumber(coin.total_volume)}</div>
              <div className="px-4 py-3" style={{ flex: columnConfig[9].flex }}>
                {coin.sparkline_in_7d && coin.sparkline_in_7d.price ? (
                   <Sparkline
                      data={coin.sparkline_in_7d.price}
                      color={ (coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length -1] || 0) > (coin.sparkline_in_7d.price[0] || 0) ? '#22c55e' : '#ef4444' }
                   />
                ) : <span className="text-slate-500 text-xs">N/A</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoTable;