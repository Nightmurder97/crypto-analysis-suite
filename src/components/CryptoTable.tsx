import React, { useState, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CryptoData } from '../types';

interface CryptoTableProps {
  data: CryptoData[];
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

const CryptoTable: React.FC<CryptoTableProps> = ({ data, onSelectCrypto }) => {
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCryptos, setSelectedCryptos] = useState<Set<string>>(new Set());
  
  const parentRef = useRef<HTMLDivElement>(null);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey as keyof CryptoData];
      const valB = b[sortKey as keyof CryptoData];
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') return sortOrder === 'asc' ? valA - valB : valB - valA;
      if (typeof valA === 'string' && typeof valB === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const rowVirtualizer = useVirtualizer({
    count: sortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 53, // Altura estimada de la fila
    overscan: 10,
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortOrder('asc'); }
  };

  const handleCryptoSelect = (cryptoId: string) => {
    const newSelected = new Set(selectedCryptos);
    if (newSelected.has(cryptoId)) newSelected.delete(cryptoId);
    else newSelected.add(cryptoId);
    setSelectedCryptos(newSelected);
    const selectedData = sortedData.filter(c => newSelected.has(c.id));
    onSelectCrypto(selectedData);
  };
  
  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return <span className="text-slate-500">N/A</span>;
    const color = value > 0 ? 'text-emerald-400' : 'text-red-400';
    return <span className={color}>{value.toFixed(2)}%</span>;
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: value < 0.01 ? 6 : 2 })}`;
  };
  
  const formatBigNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const columns = [
    { key: null, label: '', width: 'w-12 text-center' },
    { key: 'market_cap_rank', label: '#', width: 'w-16' },
    { key: 'name', label: 'Nombre', width: 'w-48' },
    { key: 'current_price', label: 'Precio', width: 'w-32' },
    { key: 'price_change_percentage_24h', label: '24h %', width: 'w-24' },
    { key: 'price_change_percentage_7d_in_currency', label: '7d %', width: 'w-24' },
    { key: 'market_cap', label: 'Cap. Mercado', width: 'w-40' },
    { key: 'total_volume', label: 'Volumen (24h)', width: 'w-40' },
    { key: 'sparkline_in_7d', label: 'Tendencia 7d', width: 'w-32' }
  ];

  return (
    <div ref={parentRef} className="overflow-auto" style={{ height: '70vh' }}>
      <table className="min-w-full text-sm text-left text-slate-300" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        <thead className="text-xs text-slate-400 uppercase bg-slate-800 sticky top-0 z-10">
          <tr>
            {columns.map(col => (
              <th key={col.label} scope="col" className={`px-4 py-3 ${col.width} ${col.key ? 'cursor-pointer hover:bg-slate-700' : ''}`} onClick={() => col.key && handleSort(col.key as SortKey)}>
                {col.label} {sortKey === col.key && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const coin = sortedData[virtualRow.index];
            if (!coin) return null;
            return (
              <tr key={coin.id} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-4 py-2 text-center">
                  <input type="checkbox" name={`select-crypto-${coin.id}`} checked={selectedCryptos.has(coin.id)} onChange={() => handleCryptoSelect(coin.id)} className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500" aria-label={`Select ${coin.name}`} />
                </td>
                <td className="px-4 py-2">{coin.market_cap_rank}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                  <div>
                    <div className="font-bold">{coin.name}</div>
                    <div className="text-slate-400">{coin.symbol.toUpperCase()}</div>
                  </div>
                </td>
                <td className="px-4 py-2">{formatCurrency(coin.current_price)}</td>
                <td className="px-4 py-2">{formatPercentage(coin.price_change_percentage_24h)}</td>
                <td className="px-4 py-2">{formatPercentage(coin.price_change_percentage_7d_in_currency)}</td>
                <td className="px-4 py-2">{formatBigNumber(coin.market_cap)}</td>
                <td className="px-4 py-2">{formatBigNumber(coin.total_volume)}</td>
                <td className="px-4 py-2">
                  <Sparkline data={coin.sparkline_in_7d?.price || []} color={coin.price_change_percentage_7d_in_currency && coin.price_change_percentage_7d_in_currency > 0 ? '#22c55e' : '#ef4444'} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
