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

  const columns: { key: SortKey; label: string; width?: string, sticky?: boolean }[] = [
    { key: null, label: 'Select', width: 'w-16', sticky: true },
    { key: 'market_cap_rank', label: '#', width: 'w-12', sticky: true },
    { key: 'name', label: 'Name', width: 'w-52', sticky: true }, // Make name sticky too
    { key: 'current_price', label: 'Price', width: 'w-32' },
    { key: 'price_change_percentage_1h_in_currency', label: '1h %', width: 'w-24' },
    { key: 'price_change_percentage_24h', label: '24h %', width: 'w-24' },
    { key: 'price_change_percentage_7d_in_currency', label: '7d %', width: 'w-24' },
    { key: 'market_cap', label: 'Market Cap', width: 'w-36' },
    { key: 'total_volume', label: 'Volume (24h)', width: 'w-36' },
    { key: 'sparkline_in_7d' as any, label: '7d Trend', width: 'w-28' },
  ];

  if (!initialData || initialData.length === 0) {
    return (
        <div className="flex justify-center items-center h-64">
            <p className="text-slate-400">No data to display.</p>
        </div>
    );
  }

  return (
    <div ref={parentRef} className="overflow-auto shadow-md rounded-lg max-h-[calc(100vh-280px)]"> {/* Adjusted max-h for potential header/controls */}
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
        <table className="min-w-full text-sm text-left text-slate-300 bg-slate-800">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700 sticky top-0 z-20">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key as string || 'select'}
                  scope="col"
                  className={`px-4 py-3 ${col.width || ''} ${col.key ? 'cursor-pointer hover:bg-slate-600' : ''} ${col.sticky ? 'sticky bg-slate-700 z-10' : ''}`}
                  style={col.sticky ? { left: col.label === 'Select' ? 0 : (col.label === '#' ? 'calc(4rem)' : 'calc(4rem + 3rem)')} : {}} // Adjust left positioning for sticky columns
                  onClick={() => col.key && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const coin = sortedData[virtualRow.index];
              if (!coin) return null; // Should not happen if count is correct
              return (
                <tr
                  key={coin.id || virtualRow.index}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-100"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <td className={`px-4 py-3 sticky bg-slate-800 hover:bg-slate-700/50 z-10`} style={{ left: 0 }}>
                    <input
                      type="checkbox"
                      checked={selectedCryptos.has(coin.id)}
                      onChange={(e) => handleCryptoSelect(coin, e.target.checked)}
                      className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                    />
                  </td>
                  <td className={`px-4 py-3 font-medium text-slate-200 sticky bg-slate-800 hover:bg-slate-700/50 z-10`} style={{ left: 'calc(4rem)' }}>{coin.market_cap_rank}</td>
                  <td className={`px-4 py-3 sticky bg-slate-800 hover:bg-slate-700/50 z-10`} style={{ left: 'calc(4rem + 3rem)' }}>
                    <div className="flex items-center">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full shrink-0"/>
                      <span className="font-bold mr-2 text-slate-100 shrink-0">{coin.symbol?.toUpperCase()}</span>
                      <span className="truncate ">{coin.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(coin.current_price)}</td>
                  <td className="px-4 py-3">{formatPercentage(coin.price_change_percentage_1h_in_currency)}</td>
                  <td className="px-4 py-3">{formatPercentage(coin.price_change_percentage_24h)}</td>
                  <td className="px-4 py-3">{formatPercentage(coin.price_change_percentage_7d_in_currency)}</td>
                  <td className="px-4 py-3">{formatBigNumber(coin.market_cap)}</td>
                  <td className="px-4 py-3">{formatBigNumber(coin.total_volume)}</td>
                  <td className="px-4 py-3">
                    {coin.sparkline_in_7d && coin.sparkline_in_7d.price ? (
                       <Sparkline
                          data={coin.sparkline_in_7d.price}
                          color={ (coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length -1] || 0) > (coin.sparkline_in_7d.price[0] || 0) ? '#22c55e' : '#ef4444' }
                       />
                    ) : <span className="text-slate-500 text-xs">N/A</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;