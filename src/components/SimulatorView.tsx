import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const SimulatorView = () => {
    const [allocations, setAllocations] = useState({ g1: 50, g2: 30, g3: 15, g4: 5 });
    const [capital, setCapital] = useState(10000);
    const [results, setResults] = useState({ totalReturn: 0, riskScore: 0, finalValue: 0, maxDrawdown: 0});
    const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
    const [recommendations, setRecommendations] = useState<string[]>([]);

    const groupPerformance = {
        g1: { return30d: 8.2, volatility: 15, maxDrawdown: -8.1 },
        g2: { return30d: 12.7, volatility: 28, maxDrawdown: -15.2 },
        g3: { return30d: 18.9, volatility: 45, maxDrawdown: -28.7 },
        g4: { return30d: 35.2, volatility: 89, maxDrawdown: -52.3 }
    };

    const runSimulation = () => {
        let portfolioReturn = 0, portfolioMaxDrawdown = 0, portfolioRisk = 0;

        Object.entries(allocations).forEach(([key, weight]) => {
            const groupKey = key as keyof typeof groupPerformance;
            const w = weight / 100;
            const groupData = groupPerformance[groupKey];
            portfolioReturn += w * groupData.return30d;
            portfolioMaxDrawdown += w * groupData.maxDrawdown;
            portfolioRisk += w * (parseInt(groupKey.replace('g', '')) * 2.5);
        });

        const finalValue = capital * (1 + portfolioReturn / 100);
        setResults({ totalReturn: portfolioReturn, riskScore: portfolioRisk, finalValue, maxDrawdown: portfolioMaxDrawdown });
        
        // Generate Chart Data
        const days = 30;
        const labels = Array.from({length: days + 1}, (_, i) => `Day ${i}`);
        const dataPoints = [capital];
        let currentValue = capital;

        for (let i = 0; i < days; i++) {
            let dailyReturn = 0;
            Object.entries(allocations).forEach(([key, weight]) => {
                const groupKey = key as keyof typeof groupPerformance;
                const w = weight / 100;
                const groupData = groupPerformance[groupKey];
                const dailyVol = groupData.volatility / Math.sqrt(252);
                const randomReturn = (Math.random() - 0.5) * dailyVol * 2;
                dailyReturn += w * ((groupData.return30d / 30) + randomReturn);
            });
            currentValue *= (1 + dailyReturn / 100);
            dataPoints.push(currentValue);
        }
        setChartData({ labels, datasets: [{ label: 'Portfolio Value', data: dataPoints, borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', fill: true, tension: 0.3 }] });

        // Generate Recommendations
        const newRecs = [];
        if (portfolioRisk > 15) newRecs.push('High risk detected. Consider reducing exposure to Groups 3 & 4.');
        if (allocations.g4 > 20) newRecs.push('Extreme exposure to Micro Cap assets is highly speculative.');
        if (allocations.g1 < 30) newRecs.push('Consider increasing High Cap allocation for more stability.');
        if (portfolioReturn > 20) newRecs.push('Excellent return potential. Remember to manage risk.');
        setRecommendations(newRecs);
    };

    useEffect(() => {
        runSimulation();
    }, [allocations, capital]);

    const handleSliderChange = (group: keyof typeof allocations, value: string) => {
        const intValue = parseInt(value, 10);
        const oldAllocations = {...allocations};
        const delta = intValue - oldAllocations[group];
        
        oldAllocations[group] = intValue;
        
        const otherGroups = (Object.keys(oldAllocations) as (keyof typeof allocations)[]).filter(g => g !== group);
        let remainingDelta = delta;

        // Distribute the change amongst other sliders
        otherGroups.forEach(g => {
            const change = Math.round(remainingDelta / otherGroups.length);
            oldAllocations[g] -= change;
            if(oldAllocations[g] < 0) oldAllocations[g] = 0;
        });
        
        // Normalize to 100
        const total = Object.values(oldAllocations).reduce((a,b) => a+b, 0);
        const factor = 100 / total;
        const finalAllocations = Object.fromEntries(Object.entries(oldAllocations).map(([k,v]) => [k, Math.round(v * factor)])) as typeof allocations;
        
        // Final check to ensure it sums to 100
        const finalTotal = Object.values(finalAllocations).reduce((a,b) => a+b, 0);
        if (finalTotal !== 100) {
            const diff = 100 - finalTotal;
            const largestGroup = Object.keys(finalAllocations).reduce((a, b) => finalAllocations[a as keyof typeof allocations] > finalAllocations[b as keyof typeof allocations] ? a : b) as keyof typeof allocations;
            finalAllocations[largestGroup] += diff;
        }

        setAllocations(finalAllocations);
    };

    const setPreset = (type: string) => {
        if(type === 'conservative') setAllocations({ g1: 70, g2: 25, g3: 5, g4: 0 });
        if(type === 'balanced') setAllocations({ g1: 50, g2: 30, g3: 15, g4: 5 });
        if(type === 'aggressive') setAllocations({ g1: 30, g2: 35, g3: 25, g4: 10 });
        if(type === 'degen') setAllocations({ g1: 10, g2: 20, g3: 35, g4: 35 });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
            {/* Left Panel: Controls */}
            <div className="bg-slate-700/50 p-6 rounded-xl space-y-4">
                 <div className="flex items-center gap-4">
                    <label htmlFor="initialCapital" className="font-semibold text-slate-300">Initial Capital:</label>
                    <input type="number" id="initialCapital" value={capital} onChange={e => setCapital(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:ring-sky-500 focus:border-sky-500"/>
                 </div>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                     <button onClick={() => setPreset('conservative')} className="p-2 text-sm bg-sky-800 hover:bg-sky-700 rounded-md transition">Conservative</button>
                     <button onClick={() => setPreset('balanced')} className="p-2 text-sm bg-sky-700 hover:bg-sky-600 rounded-md transition">Balanced</button>
                     <button onClick={() => setPreset('aggressive')} className="p-2 text-sm bg-sky-600 hover:bg-sky-500 rounded-md transition">Aggressive</button>
                     <button onClick={() => setPreset('degen')} className="p-2 text-sm bg-red-600 hover:bg-red-500 rounded-md transition">Degen</button>
                 </div>
                 {Object.entries(allocations).map(([key, value], i) => (
                    <div key={key}>
                        <label htmlFor={key} className="block mb-1 text-sm font-medium text-slate-300">Group {i+1} Allocation: <span className="font-bold text-sky-400">{value}%</span></label>
                        <input type="range" id={key} min="0" max="100" value={value} onChange={e => handleSliderChange(key as keyof typeof allocations, e.target.value)} className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                 ))}
            </div>
            {/* Right Panel: Results */}
            <div className="bg-slate-700/50 p-6 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div><div className="text-xs text-slate-400">30d Return</div><div className={`text-2xl font-bold ${results.totalReturn > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{results.totalReturn.toFixed(1)}%</div></div>
                    <div><div className="text-xs text-slate-400">Risk Score</div><div className="text-2xl font-bold text-amber-400">{results.riskScore.toFixed(1)}/25</div></div>
                    <div><div className="text-xs text-slate-400">Final Value</div><div className="text-2xl font-bold text-sky-400">${results.finalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div></div>
                    <div><div className="text-xs text-slate-400">Max Drawdown</div><div className="text-2xl font-bold text-red-400">{results.maxDrawdown.toFixed(1)}%</div></div>
                </div>
                 <div className="h-64">
                    <Line data={chartData} options={{responsive: true, maintainAspectRatio: false, plugins: {legend: {display: false}}, scales: {x: {ticks:{color: '#94a3b8'}}, y: {ticks:{color:'#94a3b8'}}}}} />
                 </div>
                <div>
                    <h4 className="font-semibold mb-2 text-slate-300">Recommendations:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-slate-400">
                        {recommendations.length > 0 ? recommendations.map((rec, i) => <li key={i}>{rec}</li>) : <li>Your portfolio seems balanced for its risk profile.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SimulatorView;
