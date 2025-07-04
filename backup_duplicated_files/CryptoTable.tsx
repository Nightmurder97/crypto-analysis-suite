import React, { useState, useMemo } from 'react';
import { CryptoData } from '../types';

interface CryptoTableProps {
  data: CryptoData[];
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


const CryptoTable: React.FC<CryptoTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
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
  }, [data, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
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

  const columns: { key: SortKey; label: string; width?: string }[] = [
    { key: 'market_cap_rank', label: '#', width: 'w-12' },
    { key: 'name', label: 'Name', width: 'w-52' }, // Increased width for logo and name
    { key: 'current_price', label: 'Price', width: 'w-32' },
    { key: 'price_change_percentage_1h_in_currency', label: '1h %', width: 'w-24' },
    { key: 'price_change_percentage_24h', label: '24h %', width: 'w-24' },
    { key: 'price_change_percentage_7d_in_currency', label: '7d %', width: 'w-24' },
    { key: 'market_cap', label: 'Market Cap', width: 'w-36' },
    { key: 'total_volume', label: 'Volume (24h)', width: 'w-36' },
    { key: 'sparkline_in_7d' as any, label: '7d Trend', width: 'w-28' }, // sparkline_in_7d is an object
  ];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg max-h-[calc(100vh-250px)]">
      <table className="min-w-full text-sm text-left text-slate-300 bg-slate-800">
        <thead className="text-xs text-slate-400 uppercase bg-slate-700 sticky top-0 z-10">
          <tr>
            {columns.map(col => (
              <th key={col.key as string} scope="col" className={`px-4 py-3 ${col.width || ''} ${col.key ? 'cursor-pointer hover:bg-slate-600' : ''}`} onClick={() => col.key && handleSort(col.key)}>
                {col.label}
                {sortKey === col.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((coin, index) => (
            <tr key={coin.id || index} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-100">
              <td className="px-4 py-3 font-medium text-slate-200">{coin.market_cap_rank}</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full"/>
                  <span className="font-bold mr-2 text-slate-100">{coin.symbol?.toUpperCase()}</span>
                  <span className="truncate max-w-[100px]">{coin.name}</span>
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
                      color={ (coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length -1] || 0) > (coin.sparkline_in_7d.price[0] || 0) ? '#22c55e' /*emerald-500*/ : '#ef4444' /*red-500*/ } 
                   />
                ) : <span className="text-slate-500 text-xs">N/A</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
