import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const DEFAULT_HISTORY = [
    { month: 'Jan', mrr: 1200, users: 150 },
    { month: 'Feb', mrr: 2100, users: 280 },
    { month: 'Mar', mrr: 3500, users: 450 },
    { month: 'Apr', mrr: 4800, users: 620 },
    { month: 'May', mrr: 7200, users: 950 },
];

export function KPIDashboard() {
    const [kpis, setKpis] = useState({
        current: { mrr: 0, runway: 0, burn: 0, customers: 0, churn: 0, growth: 0 },
        history: DEFAULT_HISTORY
    });

    useEffect(() => {
        const data = loadData();
        if (data.kpis && data.kpis.current) {
            setKpis(data.kpis);
        }
    }, []);

    const handleChange = (e) => {
        const updated = {
            ...kpis,
            current: { ...kpis.current, [e.target.name]: Number(e.target.value) }
        };
        setKpis(updated);

        const data = loadData();
        data.kpis = updated;
        saveData(data);
    };

    const c = kpis.current;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">KPI Dashboard</h1>
                <p className="page-description">The heartbeat of the business. Measure what matters.</p>
            </div>

            <div className="grid-3 mb-6">
                <div className="card text-center p-6 border-brand-primary">
                    <h3 className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">MRR</h3>
                    <input name="mrr" type="number" className="text-4xl font-black text-center bg-transparent border-none outline-none w-full text-brand-primary drop-shadow-sm mb-1" value={c.mrr} onChange={handleChange} />
                    <span className="text-xs text-secondary italic">Monthly Recurring Revenue</span>
                </div>

                <div className={`card text-center p-6 ${c.runway < 6 ? 'border-brand-danger bg-brand-danger bg-opacity-10' : 'border-brand-success'}`}>
                    <h3 className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">Runway</h3>
                    <div className="flex items-end justify-center">
                        <input name="runway" type="number" className={`text-4xl font-black text-center bg-transparent border-none outline-none w-24 ${c.runway < 6 ? 'text-danger' : 'text-success'}`} value={c.runway} onChange={handleChange} />
                        <span className="text-2xl font-bold text-secondary mb-1 ml-1">mo</span>
                    </div>
                    <span className="text-xs text-secondary italic">{c.runway < 6 ? '⚠️ CRITICAL: Raise or cut burn' : 'Healthy buffer'}</span>
                </div>

                <div className="card text-center p-6">
                    <h3 className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">Burn Rate</h3>
                    <div className="flex justify-center items-center">
                        <span className="text-2xl font-bold text-secondary mr-1">-$</span>
                        <input name="burn" type="number" className="text-4xl font-black text-center bg-transparent border-none outline-none w-32 text-primary" value={c.burn} onChange={handleChange} />
                    </div>
                    <span className="text-xs text-secondary italic">Monthly net burn</span>
                </div>

                <div className="card text-center p-6">
                    <h3 className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">Customers</h3>
                    <input name="customers" type="number" className="text-4xl font-black text-center bg-transparent border-none outline-none w-full text-primary" value={c.customers} onChange={handleChange} />
                    <span className="text-xs text-secondary italic">Active paying users</span>
                </div>

                <div className={`card text-center p-6 ${c.churn > 5 ? 'border-brand-danger' : ''}`}>
                    <h3 className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">Churn %</h3>
                    <div className="flex justify-center items-end">
                        <input name="churn" type="number" className={`text-4xl font-black text-center bg-transparent border-none outline-none w-24 ${c.churn > 5 ? 'text-danger' : 'text-primary'}`} value={c.churn} onChange={handleChange} />
                        <span className="text-2xl font-bold text-secondary mb-1">%</span>
                    </div>
                    <span className="text-xs text-secondary italic">{c.churn > 5 ? 'Leaky bucket. Fix retention.' : 'Healthy retention'}</span>
                </div>

                <div className={`card text-center p-6 ${c.growth < 10 ? 'border-brand-warning' : 'border-brand-success'}`}>
                    <h3 className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">MoM Growth</h3>
                    <div className="flex justify-center items-end">
                        <input name="growth" type="number" className={`text-4xl font-black text-center bg-transparent border-none outline-none w-24 ${c.growth >= 10 ? 'text-success' : 'text-warning'}`} value={c.growth} onChange={handleChange} />
                        <span className="text-2xl font-bold text-secondary mb-1">%</span>
                    </div>
                    <span className="text-xs text-secondary italic">{c.growth >= 10 ? 'Unicorn trajectory' : 'Push for 10% MoM'}</span>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="card-title mb-6">MRR Growth Trajectory</h2>
                    <div className="h-64 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={kpis.history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#242424" vertical={false} />
                                <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666666" tick={{ fill: '#a0a0a0' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px' }}
                                    itemStyle={{ color: '#ededed' }}
                                    formatter={(value) => [`$${value}`, 'MRR']}
                                />
                                <Area type="monotone" dataKey="mrr" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h2 className="card-title mb-6">User Base Growth</h2>
                    <div className="h-64 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kpis.history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#242424" vertical={false} />
                                <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666666" tick={{ fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px' }}
                                    itemStyle={{ color: '#ededed' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#111' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
