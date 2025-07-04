import React, { useState } from 'react';

const Infographic: React.FC = () => {
    return (
        <div className="p-4 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-lg">
            <div className="relative overflow-hidden">
                <div className="floating-elements fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                    <div className="floating-element" style={{ left: '10%', animationDelay: '0s' }}>₿</div>
                    <div className="floating-element" style={{ left: '20%', animationDelay: '2s' }}>Ξ</div>
                    <div className="floating-element" style={{ left: '40%', animationDelay: '6s' }}>💎</div>
                    <div className="floating-element" style={{ left: '50%', animationDelay: '8s' }}>🚀</div>
                    <div className="floating-element" style={{ left: '70%', animationDelay: '12s' }}>💰</div>
                    <div className="floating-element" style={{ left: '90%', animationDelay: '16s' }}>⭐</div>
                </div>
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">CRYPTO MARKET 2025</h1>
                    <p className="text-xl text-slate-300">Top 1000 Crypto Analysis</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                     <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-md border border-white/20">
                        <div className="text-5xl mb-2">📈</div><div className="text-3xl font-bold text-emerald-400">76%</div><div className="text-slate-300">Positive Trend (7d)</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-md border border-white/20">
                        <div className="text-5xl mb-2">🚀</div><div className="text-3xl font-bold text-sky-400">+1,731%</div><div className="text-slate-300">Top Gain (30d)</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-md border border-white/20">
                        <div className="text-5xl mb-2">📉</div><div className="text-3xl font-bold text-red-400">-89%</div><div className="text-slate-300">Top Loss (30d)</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-md border border-white/20">
                        <div className="text-5xl mb-2">💰</div><div className="text-3xl font-bold text-amber-400">$45.3B</div><div className="text-slate-300">Volume (24h)</div>
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6 text-amber-400">Key Insights</h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"><strong>Sector Rotation:</strong> Capital flowing into AI, Memecoins, and Layer 2 projects.</div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"><strong>High Volatility:</strong> Micro-cap assets show extreme price swings, posing high risk and reward.</div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"><strong>Liquidity Concentration:</strong> 85% of volume is in top-tier assets, indicating risk in lower-cap coins.</div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"><strong>DeFi Maturation:</strong> Rise of liquid staking and complex financial products shows ecosystem growth.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ExecutiveReport: React.FC = () => {
    return (
        <div className="bg-slate-100 text-slate-800 p-6 rounded-lg font-serif">
            <div className="text-center mb-8 pb-4 border-b-2 border-blue-800">
                <h1 className="text-4xl font-bold text-blue-900">Executive Report</h1>
                <h2 className="text-xl text-slate-600">Crypto Market Analysis 2025</h2>
            </div>
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="font-bold text-blue-800 text-lg mb-2">Executive Summary</h3>
                <p>The cryptocurrency market is experiencing a robust short-term recovery, led by major assets. Key growth sectors include AI, Memecoins, and Layer 2 solutions. However, significant volatility and liquidity risks persist in lower-capitalization segments, necessitating a cautious yet opportunistic investment approach.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-blue-800">Key Findings</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>76% of assets show positive 7-day performance.</li>
                        <li>Extreme 30-day volatility from +1,731% to -89%.</li>
                        <li>AI & Memecoins are the dominant narratives.</li>
                        <li>85% of trading volume is in high-cap assets.</li>
                    </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-amber-800">Strategic Recommendations</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Maintain a core holding in high-cap assets (60-70%).</li>
                        <li>Limit micro-cap exposure to under 15% of portfolio.</li>
                        <li>Conduct thorough due diligence on all assets.</li>
                        <li>Monitor liquidity before entering large positions.</li>
                    </ul>
                </div>
            </div>
             <div className="text-center mt-6">
                <button onClick={() => window.print()} className="px-6 py-2 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors">Print Report</button>
            </div>
        </div>
    );
};


const ReportsView: React.FC = () => {
    const [activeReport, setActiveReport] = useState<'infographic' | 'executive'>('infographic');

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-center gap-2 flex-wrap">
                <button onClick={() => setActiveReport('infographic')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeReport === 'infographic' ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    Infographic
                </button>
                <button onClick={() => setActiveReport('executive')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeReport === 'executive' ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    Executive Report
                </button>
            </div>
            <div>
                {activeReport === 'infographic' ? <Infographic /> : <ExecutiveReport />}
            </div>
        </div>
    );
};

export default ReportsView;
