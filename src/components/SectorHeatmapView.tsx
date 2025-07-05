import { useState } from 'react';
import { CryptoData } from '../types';

interface SectorHeatmapViewProps {
  data: CryptoData[];
}

export default function SectorHeatmapView({ data }: SectorHeatmapViewProps) {
    const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');
    const [modalData, setModalData] = useState<{ sector: string; data: any } | null>(null);

    const sectorsData = {
        '24h': {
            'Memecoins': { change: 45.2, volume: '$2.1B', color: 'extreme-positive', top: ['PEPE', 'DOGE', 'WIF'] },
            'AI/IA': { change: 38.7, volume: '$1.8B', color: 'high-positive', top: ['FET', 'AGIX', 'RENDER'] },
            'Layer 2': { change: 32.1, volume: '$3.4B', color: 'high-positive', top: ['ARB', 'OP', 'MATIC'] },
            'DeFi': { change: 28.4, volume: '$4.2B', color: 'moderate-positive', top: ['UNI', 'AAVE', 'COMP'] },
            'Gaming': { change: 25.1, volume: '$800M', color: 'moderate-positive', top: ['AXS', 'SAND', 'ENJ'] },
            'Staking': { change: 22.3, volume: '$1.5B', color: 'moderate-positive', top: ['LDO', 'RPL', 'SWISE'] },
            'NFT': { change: 18.7, volume: '$600M', color: 'moderate-positive', top: ['BLUR', 'LOOKS', 'X2Y2'] },
            'Oracle': { change: 15.2, volume: '$900M', color: 'moderate-positive', top: ['LINK', 'BAND', 'API3'] },
            'Privacy': { change: 8.1, volume: '$400M', color: 'low-positive', top: ['XMR', 'ZEC', 'DASH'] },
            'Infrastructure': { change: -5.3, volume: '$1.1B', color: 'low-negative', top: ['FIL', 'AR', 'STORJ'] },
            'Exchange': { change: -8.7, volume: '$2.8B', color: 'moderate-negative', top: ['BNB', 'OKB', 'FTT'] },
            'Metaverse': { change: -12.4, volume: '$500M', color: 'moderate-negative', top: ['MANA', 'SAND', 'APE'] }
        },
        '7d': {
            'Memecoins': { change: 67.8, volume: '$12.3B', color: 'extreme-positive', top: ['PENGU', 'DOG', 'MOG'] },
            'AI/IA': { change: 52.4, volume: '$8.7B', color: 'extreme-positive', top: ['MOVE', 'FET', 'TAO'] },
            'Layer 2': { change: 49.1, volume: '$15.2B', color: 'high-positive', top: ['SEI', 'ARB', 'SUI'] },
            'Gaming': { change: 34.6, volume: '$4.1B', color: 'high-positive', top: ['PRIME', 'YGG', 'GALA'] },
            'DeFi': { change: 31.2, volume: '$18.9B', color: 'high-positive', top: ['AERO', 'UNI', 'SYRUP'] },
            'Staking': { change: 28.9, volume: '$7.2B', color: 'moderate-positive', top: ['ETHFI', 'LDO', 'EIGEN'] },
            'NFT': { change: 24.7, volume: '$2.8B', color: 'moderate-positive', top: ['BLUR', 'SUPER', 'IMX'] },
            'Oracle': { change: 21.3, volume: '$3.1B', color: 'moderate-positive', top: ['PYTH', 'LINK', 'UMA'] },
            'Infrastructure': { change: 12.8, volume: '$5.4B', color: 'moderate-positive', top: ['HNT', 'FIL', 'STORJ'] },
            'Privacy': { change: 8.4, volume: '$1.2B', color: 'low-positive', top: ['ZEC', 'XMR', 'BEAM'] },
            'Exchange': { change: -6.2, volume: '$8.9B', color: 'low-negative', top: ['OKB', 'FTT', 'GT'] },
            'Metaverse': { change: -11.7, volume: '$1.8B', color: 'moderate-negative', top: ['MANA', 'SAND', 'APE'] }
        },
        '30d': {
            'Memecoins': { change: 142.7, volume: '$45.2B', color: 'extreme-positive', top: ['PENGU', 'PNUT', 'LUCE'] },
            'AI/IA': { change: 89.3, volume: '$28.1B', color: 'extreme-positive', top: ['MOVE', 'VIRTUAL', 'FET'] },
            'Layer 2': { change: 78.4, volume: '$52.8B', color: 'extreme-positive', top: ['SUI', 'SEI', 'ARB'] },
            'Gaming': { change: 67.2, volume: '$15.3B', color: 'extreme-positive', top: ['PRIME', 'BEAM', 'YGG'] },
            'DeFi': { change: 58.9, volume: '$67.4B', color: 'extreme-positive', top: ['AERO', 'COW', 'SYRUP'] },
            'Staking': { change: 45.6, volume: '$23.7B', color: 'high-positive', top: ['ETHFI', 'EIGEN', 'LDO'] },
            'NFT': { change: 42.1, volume: '$8.9B', color: 'high-positive', top: ['BLUR', 'SUPER', 'IMX'] },
            'Oracle': { change: 38.7, volume: '$12.4B', color: 'high-positive', top: ['PYTH', 'UMA', 'LINK'] },
            'Infrastructure': { change: 28.3, volume: '$18.9B', color: 'moderate-positive', top: ['HNT', 'FIL', 'STORJ'] },
            'Privacy': { change: 15.2, volume: '$4.1B', color: 'moderate-positive', top: ['ZEC', 'XMR', 'BEAM'] },
            'Exchange': { change: 8.7, volume: '$34.2B', color: 'low-positive', top: ['OKB', 'GT', 'FTT'] },
            'Metaverse': { change: -2.4, volume: '$6.8B', color: 'low-negative', top: ['MANA', 'SAND', 'APE'] }
        }
    };

    const currentData = sectorsData[period];
    const currentStats = {
        bestSector: Object.keys(currentData).sort((a, b) => (currentData as any)[b].change - (currentData as any)[a].change)[0],
        worstSector: Object.keys(currentData).sort((a, b) => (currentData as any)[a].change - (currentData as any)[b].change)[0],
        avgReturn: `${(Object.values(currentData).reduce((sum, sector) => sum + sector.change, 0) / Object.keys(currentData).length).toFixed(1)}%`,
        totalVolume: Object.values(currentData).reduce((sum, sector) => sum + parseFloat(sector.volume.replace(/[$B]/g, '')), 0).toFixed(1) + 'B'
    };

    const getSectorColor = (colorType: string) => {
        const colors: {[key: string]: string} = {
            'extreme-positive': 'bg-emerald-500',
            'high-positive': 'bg-green-500',
            'moderate-positive': 'bg-lime-500',
            'low-positive': 'bg-yellow-500',
            'low-negative': 'bg-orange-500',
            'moderate-negative': 'bg-red-500',
            'high-negative': 'bg-red-700'
        };
        return colors[colorType] || 'bg-gray-500';
    };

    const getSectorAnalysis = (sector: string) => {
        const analyses: {[key: string]: string} = {
            'Memecoins': 'Memecoins continue to dominate retail sentiment. High volatility and speculative interest drive significant price movements.',
            'AI/IA': 'Sector in sustained growth. Corporate adoption and development of real use cases are driving demand.',
            'Layer 2': 'Ethereum scalability drives adoption. Cost reduction and improved UX attract users and developers.',
        };
        return analyses[sector] || 'Specific sector analysis based on fundamentals and market sentiment.';
    };

    return (
        <div className="p-4 space-y-6">
             <div className="flex justify-center gap-2 flex-wrap">
                {(['24h', '7d', '30d'] as const).map(p => (
                    <button key={p} type="button" onClick={() => setPeriod(p)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${period === p ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        {p === '24h' ? '24 Hours' : p === '7d' ? '7 Days' : '30 Days'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg text-center"><div className="text-xs text-slate-400">BEST SECTOR</div><div className="text-xl font-bold text-emerald-400">{currentStats.bestSector}</div></div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center"><div className="text-xs text-slate-400">WORST SECTOR</div><div className="text-xl font-bold text-red-400">{currentStats.worstSector}</div></div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center"><div className="text-xs text-slate-400">AVERAGE RETURN</div><div className="text-xl font-bold text-sky-400">{currentStats.avgReturn}</div></div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center"><div className="text-xs text-slate-400">TOTAL VOLUME</div><div className="text-xl font-bold text-purple-400">${currentStats.totalVolume}</div></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(currentData).map(([sector, sectorData]) => (
                    <div key={sector} className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer border border-slate-600" onClick={() => setModalData({ sector, data: sectorData })}>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-200">{sector}</h3>
                            <div className={`w-3 h-3 rounded-full ${getSectorColor(sectorData.color)}`}></div>
                        </div>
                        <div className={`text-2xl font-bold mb-1 ${sectorData.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{sectorData.change > 0 ? '+' : ''}{sectorData.change.toFixed(1)}%</div>
                        <div className="text-sm text-slate-400 mb-2">Vol: {sectorData.volume}</div>
                        <div className="text-xs text-slate-500">Top: {sectorData.top.join(', ')}</div>
                    </div>
                ))}
            </div>

            {modalData && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4 border border-slate-600">
                        <h2 className="text-xl font-bold mb-4 text-sky-400">{modalData.sector}</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className="text-slate-400">Change:</span><span className={`font-semibold ${modalData.data.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{modalData.data.change > 0 ? '+' : ''}{modalData.data.change.toFixed(1)}%</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Volume:</span><span className="font-semibold">{modalData.data.volume}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Top Coins:</span><span className="font-semibold">{modalData.data.top.join(', ')}</span></div>
                        </div>
                        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                            <p className="text-sm text-slate-300">{getSectorAnalysis(modalData.sector)}</p>
                        </div>
                        <button type="button" onClick={() => setModalData(null)} className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Close</button>
                    </div>
                 </div>
            )}
        </div>
    );
}