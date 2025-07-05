import { useState, useEffect } from 'react';

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
        'Staking': { change: 74.7, volume: '$45.2B', color: 'extreme-positive', top: ['SYRUP', 'ETHFI', 'EIGEN'] },
        'Layer 2': { change: 60.2, volume: '$67.8B', color: 'extreme-positive', top: ['KAIA', 'SEI', 'AERO'] },
        'AI/IA': { change: 45.3, volume: '$38.1B', color: 'high-positive', top: ['MOVE', 'FET', 'RENDER'] },
        'Gaming': { change: 38.8, volume: '$12.4B', color: 'high-positive', top: ['SPX', 'PRIME', 'YGG'] },
        'DeFi': { change: 27.2, volume: '$78.9B', color: 'moderate-positive', top: ['EUL', 'UNI', 'AAVE'] },
        'Oracle': { change: 22.2, volume: '$15.7B', color: 'moderate-positive', top: ['PYTH', 'UMA', 'LINK'] },
        'Memecoins': { change: 18.6, volume: '$89.3B', color: 'moderate-positive', top: ['DOGE', 'PEPE', 'WIF'] },
        'NFT': { change: -15.7, volume: '$8.2B', color: 'moderate-negative', top: ['BLUR', 'LOOKS', 'SUPER'] },
        'Infrastructure': { change: -26.7, volume: '$23.1B', color: 'high-negative', top: ['HNT', 'FIL', 'STORJ'] },
        'Privacy': { change: -29.1, volume: '$5.4B', color: 'high-negative', top: ['ZEC', 'XMR', 'DASH'] },
        'Exchange': { change: -33.4, volume: '$34.7B', color: 'high-negative', top: ['GT', 'FTT', 'BTSE'] },
        'Metaverse': { change: -42.8, volume: '$7.9B', color: 'extreme-negative', top: ['MANA', 'SAND', 'MAGIC'] }
    }
};

const SectorHeatmapView = () => {
    const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('7d');
    const [modalData, setModalData] = useState<{sector: string, info: any} | null>(null);
    const [currentStats, setCurrentStats] = useState({bestSector: '', worstSector: '', avgReturn: '', hotSectors: ''});
    
    useEffect(() => {
        const data = sectorsData[period];
        const sectors = Object.entries(data);
        
        const best = sectors.reduce((max, [name, info]) => info.change > max.change ? { name, change: info.change } : max, { name: '', change: -Infinity });
        const worst = sectors.reduce((min, [name, info]) => info.change < min.change ? { name, change: info.change } : min, { name: '', change: Infinity });
        const avgReturn = sectors.reduce((sum, [, info]) => sum + info.change, 0) / sectors.length;
        const greenSectors = sectors.filter(([, info]) => info.change > 0).length;
        
        setCurrentStats({
            bestSector: best.name,
            worstSector: worst.name,
            avgReturn: `${avgReturn > 0 ? '+' : ''}${avgReturn.toFixed(1)}%`,
            hotSectors: `${greenSectors}/${sectors.length}`
        });

    }, [period]);

    const getColorClass = (change: number) => {
        if (change > 50) return 'bg-emerald-600 hover:bg-emerald-500';
        if (change > 20) return 'bg-emerald-700 hover:bg-emerald-600';
        if (change > 5) return 'bg-emerald-800 hover:bg-emerald-700';
        if (change >= 0) return 'bg-emerald-900 hover:bg-emerald-800';
        if (change > -5) return 'bg-red-900 hover:bg-red-800';
        if (change > -20) return 'bg-red-800 hover:bg-red-700';
        if (change > -50) return 'bg-red-700 hover:bg-red-600';
        return 'bg-red-600 hover:bg-red-500';
    };

    const getSectorAnalysis = (sector: string, change: number) => {
       const analyses: { [key: string]: string } = {
            'Memecoins': change > 30 ? 'Extremely volatile sector with strong speculative momentum. Viral narratives and active communities are driving prices.' : 'Consolidation after speculative movements. Pay attention to emerging narratives.',
            'AI/IA': 'Sector in sustained growth. Corporate adoption and development of real use cases are driving demand.',
            'Layer 2': 'Ethereum scalability drives adoption. Cost reduction and improved UX attract users and developers.',
        };
        return analyses[sector] || 'Specific sector analysis based on fundamentals and market sentiment.';
    };

    return (
        <div className="p-4 space-y-6">
             <div className="flex justify-center gap-2 flex-wrap">
                {(['24h', '7d', '30d'] as const).map(p => (
                    <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${period === p ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        {p === '24h' ? '24 Hours' : p === '7d' ? '7 Days' : '30 Days'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg text-center"><div className="text-xs text-slate-400">BEST SECTOR</div><div className="text-xl font-bold text-emerald-400">{currentStats.bestSector}</div></div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center"><div className="text-xs text-slate-400">WORST SECTOR</div><div className="text-xl font-bold text-red-400">{currentStats.worstSector}</div></div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center"><div className="text-xs text-slate-400">AVERAGE RETURN</div><div className="text-xl font-bold text-sky-400">{currentStats.avgReturn}</div></div>
                <div className="bg-slate-700/50 p-4 rounded-lg text-center"><div className="text-xs text-slate-400">SECTORS IN GREEN</div><div className="text-xl font-bold text-slate-300">{currentStats.hotSectors}</div></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(sectorsData[period]).map(([sector, info]) => (
                    <div key={sector} onClick={() => setModalData({sector, info})} className={`p-4 rounded-lg text-white flex flex-col justify-center items-center aspect-square cursor-pointer transition-transform duration-200 hover:scale-105 ${getColorClass(info.change)}`}>
                        <div className="font-bold text-sm text-center">{sector}</div>
                        <div className="text-2xl font-bold my-1">{info.change > 0 ? '+' : ''}{info.change}%</div>
                        <div className="text-xs opacity-80">{info.volume}</div>
                    </div>
                ))}
            </div>

            {modalData && (
                 <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setModalData(null)}>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-sky-400 mb-4">{modalData.sector}</h3>
                        <div className="text-center mb-4">
                            <div className={`text-5xl font-bold ${modalData.info.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{modalData.info.change > 0 ? '+' : ''}{modalData.info.change}%</div>
                            <div className="text-slate-400 mt-1">Volume: {modalData.info.volume}</div>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg mb-4">
                            <h4 className="font-semibold text-slate-300 mb-2">Top Tokens in Sector:</h4>
                            <div className="flex flex-wrap gap-2">
                                {modalData.info.top.map((token: string) => <span key={token} className="bg-slate-600 px-2 py-1 text-sm rounded">{token}</span>)}
                            </div>
                        </div>
                         <div className="bg-slate-700/50 p-3 rounded-lg">
                            <h4 className="font-semibold text-slate-300 mb-2">Brief Analysis:</h4>
                            <p className="text-sm text-slate-400">{getSectorAnalysis(modalData.sector, modalData.info.change)}</p>
                        </div>
                        <button onClick={() => setModalData(null)} className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Close</button>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default SectorHeatmapView;
