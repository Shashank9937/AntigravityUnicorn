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

    const tooltipStyle = {
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">KPI Dashboard</h1>
                <p className="page-description">The heartbeat of the business. Measure what matters.</p>
            </header>

            <div className="dashboard-grid mb-8 stagger-children">
                <div className="stat-card animate-fade-in-up" style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                    <div className="stat-label">MRR</div>
                    <input
                        name="mrr"
                        type="number"
                        className="inline-edit-number"
                        style={{ fontSize: 'var(--text-3xl)', color: 'var(--brand-primary)' }}
                        value={c.mrr}
                        onChange={handleChange}
                        aria-label="Monthly Recurring Revenue"
                    />
                    <div className="stat-hint">Monthly Recurring Revenue</div>
                </div>

                <div className="stat-card animate-fade-in-up" style={{
                    borderColor: c.runway < 6 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                }}>
                    <div className="stat-label">Runway</div>
                    <div className="flex items-end justify-center">
                        <input
                            name="runway"
                            type="number"
                            className="inline-edit-number"
                            style={{
                                fontSize: 'var(--text-3xl)',
                                color: c.runway < 6 ? '#f87171' : '#34d399',
                                width: '5rem',
                            }}
                            value={c.runway}
                            onChange={handleChange}
                            aria-label="Runway in months"
                        />
                        <span className="text-lg font-bold text-secondary" style={{ marginBottom: 2, marginLeft: 4 }}>mo</span>
                    </div>
                    <div className="stat-hint">{c.runway < 6 ? '⚠️ CRITICAL: Raise or cut burn' : 'Healthy buffer'}</div>
                </div>

                <div className="stat-card animate-fade-in-up">
                    <div className="stat-label">Burn Rate</div>
                    <div className="flex justify-center items-center">
                        <span className="text-lg font-bold text-secondary" style={{ marginRight: 2 }}>-$</span>
                        <input
                            name="burn"
                            type="number"
                            className="inline-edit-number"
                            style={{ fontSize: 'var(--text-3xl)', width: '7rem' }}
                            value={c.burn}
                            onChange={handleChange}
                            aria-label="Monthly net burn"
                        />
                    </div>
                    <div className="stat-hint">Monthly net burn</div>
                </div>

                <div className="stat-card animate-fade-in-up">
                    <div className="stat-label">Customers</div>
                    <input
                        name="customers"
                        type="number"
                        className="inline-edit-number"
                        style={{ fontSize: 'var(--text-3xl)' }}
                        value={c.customers}
                        onChange={handleChange}
                        aria-label="Active paying users"
                    />
                    <div className="stat-hint">Active paying users</div>
                </div>

                <div className="stat-card animate-fade-in-up" style={{
                    borderColor: c.churn > 5 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)',
                }}>
                    <div className="stat-label">Churn %</div>
                    <div className="flex justify-center items-end">
                        <input
                            name="churn"
                            type="number"
                            className="inline-edit-number"
                            style={{
                                fontSize: 'var(--text-3xl)',
                                color: c.churn > 5 ? '#f87171' : 'var(--text-primary)',
                                width: '5rem',
                            }}
                            value={c.churn}
                            onChange={handleChange}
                            aria-label="Churn percentage"
                        />
                        <span className="text-lg font-bold text-secondary" style={{ marginBottom: 2 }}>%</span>
                    </div>
                    <div className="stat-hint">{c.churn > 5 ? 'Leaky bucket. Fix retention.' : 'Healthy retention'}</div>
                </div>

                <div className="stat-card animate-fade-in-up" style={{
                    borderColor: c.growth < 10 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                }}>
                    <div className="stat-label">MoM Growth</div>
                    <div className="flex justify-center items-end">
                        <input
                            name="growth"
                            type="number"
                            className="inline-edit-number"
                            style={{
                                fontSize: 'var(--text-3xl)',
                                color: c.growth >= 10 ? '#34d399' : '#fbbf24',
                                width: '5rem',
                            }}
                            value={c.growth}
                            onChange={handleChange}
                            aria-label="Month over month growth"
                        />
                        <span className="text-lg font-bold text-secondary" style={{ marginBottom: 2 }}>%</span>
                    </div>
                    <div className="stat-hint">{c.growth >= 10 ? 'Unicorn trajectory' : 'Push for 10% MoM'}</div>
                </div>
            </div>

            <div className="grid-2 stagger-children">
                <div className="card animate-fade-in-up">
                    <h2 className="card-title mb-6">MRR Growth Trajectory</h2>
                    <div style={{ width: '100%', height: 256 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={kpis.history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="month" stroke="#55556a" tick={{ fill: '#8b8b9e', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#55556a" tick={{ fill: '#8b8b9e', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    itemStyle={{ color: '#eaeaf0' }}
                                    formatter={(value) => [`$${value}`, 'MRR']}
                                />
                                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMrr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card animate-fade-in-up">
                    <h2 className="card-title mb-6">User Base Growth</h2>
                    <div style={{ width: '100%', height: 256 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kpis.history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="month" stroke="#55556a" tick={{ fill: '#8b8b9e', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#55556a" tick={{ fill: '#8b8b9e', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    itemStyle={{ color: '#eaeaf0' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2.5} dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#0e0e14' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
