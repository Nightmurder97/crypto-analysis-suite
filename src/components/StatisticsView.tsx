import React, { useState, useMemo } from 'react';
import { Bar, Line, Scatter, Doughnut } from 'react-chartjs-2';

const StatisticsView: React.FC = () => {
    const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('7d');

    const data = useMemo(() => {
        // Data is simulated based on the static HTML for demonstration
        if (period === '24h') return {
            histogramBins: ['-5% a -2%', '-2% a 0%', '0% a 2%', '2% a 5%', '5% a 10%', '10%+'],
            histogramFreq: [8, 12, 35, 28, 12, 5],
            volatility: [2.1, 8.4, 15.2, 28.6],
            outliers: [78, 14, 8],
        };
        if (period === '7d') return {
            histogramBins: ['-10% a 0%', '0% a 10%', '10% a 20%', '20% a 30%', '30% a 50%', '50%+'],
            histogramFreq: [15, 25, 30, 18, 8, 4],
            volatility: [8.2, 18.7, 32.4, 45.8],
            outliers: [72, 18, 10],
        };
        // 30d
        return {
            histogramBins: ['<-50%', '-50% a -20%', '-20% a 0%', '0% a 20%', '20% a 50%', '>50%'],
            histogramFreq: [12, 22, 28, 20, 10, 8],
            volatility: [15.3, 35.2, 58.7, 89.4],
            outliers: [65, 15, 20],
        };
    }, [period]);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#e2e8f0' }}},
        scales: {
            x: { ticks: { color: '#e2e8f0' }, grid: { color: 'rgba(255,255,255,0.1)' }},
            y: { ticks: { color: '#e2e8f0' }, grid: { color: 'rgba(255,255,255,0.1)' }}
        }
    };
    
    const scatterData = {
        datasets: [{
            label: 'Volume vs Rendimiento',
            data: [
                {x: 16880, y: 2.3}, {x: 12130, y: 1.8}, {x: 3250, y: 4.2}, {x: 1340, y: -0.5},
                {x: 270, y: 270}, {x: 105, y: 67}, {x: 58, y: 13}, {x: 0.02, y: 1566}
            ],
            backgroundColor: 'rgba(102, 126, 234, 0.6)',
        }]
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 p-4 rounded-lg h-80">
                    <h3 className="text-center font-bold text-sky-300 mb-2">Performance Distribution ({period})</h3>
                    <Bar options={chartOptions} data={{ labels: data.histogramBins, datasets: [{ label: 'Frequency (%)', data: data.histogramFreq, backgroundColor: 'rgba(100, 255, 218, 0.6)' }] }} />
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg h-80">
                    <h3 className="text-center font-bold text-sky-300 mb-2">Volatility by Market Cap ({period})</h3>
                    <Line options={chartOptions} data={{ labels: ['High Cap', 'Mid Cap', 'Low Cap', 'Micro Cap'], datasets: [{ label: 'Volatility (%)', data: data.volatility, borderColor: 'rgba(255, 71, 87, 1)', backgroundColor: 'rgba(255, 71, 87, 0.2)', fill: true, tension: 0.3 }] }} />
                </div>
                 <div className="bg-slate-700/50 p-4 rounded-lg h-80">
                    <h3 className="text-center font-bold text-sky-300 mb-2">Volume vs. Performance</h3>
                    <Scatter options={{...chartOptions, scales: {...chartOptions.scales, x: {...chartOptions.scales.x, type: 'logarithmic', title: {display: true, text:'Volume (Log Scale)', color: '#e2e8f0' }}}}} data={scatterData} />
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg h-80 flex flex-col items-center justify-center">
                    <h3 className="text-center font-bold text-sky-300 mb-2">Outlier Analysis ({period})</h3>
                    <div className="h-64 w-64">
                        <Doughnut options={{responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'bottom', labels: {color: '#e2e8f0'}}}}} data={{ labels: ['Normal Range', 'Positive Outliers', 'Negative Outliers'], datasets: [{ data: data.outliers, backgroundColor: ['rgba(100, 255, 218, 0.8)', 'rgba(0, 255, 136, 0.8)', 'rgba(255, 71, 87, 0.8)'] }] }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;
