import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const AARRR_METRICS = [
    { key: 'acquisition', label: 'Acquisition (Traffic)', target: 1000 },
    { key: 'activation', label: 'Activation (Signups %)', target: 20 },
    { key: 'retention', label: 'Retention (W1 Active %)', target: 40 },
    { key: 'revenue', label: 'Revenue (Paying %)', target: 5 },
    { key: 'referral', label: 'Referral (K-Factor)', target: 0.2 },
];

export function GrowthOS() {
    const [metrics, setMetrics] = useState({ acquisition: 0, activation: 0, retention: 0, revenue: 0, referral: 0 });
    const [experiments, setExperiments] = useState([]);
    const [expForm, setExpForm] = useState({ hypothesis: '', channel: '', cost: '', result: '', status: 'Run' });

    useEffect(() => {
        const data = loadData();
        if (data.growth) {
            if (data.growth.metrics) setMetrics(data.growth.metrics);
            if (data.growth.experiments) setExperiments(data.growth.experiments);
        }
    }, []);

    const handleMetricChange = (k, v) => {
        const newVal = Number(v);
        const updated = { ...metrics, [k]: newVal };
        setMetrics(updated);

        const data = loadData();
        data.growth = { metrics: updated, experiments };
        saveData(data);
    };

    const addExperiment = (e) => {
        e.preventDefault();
        if (!expForm.hypothesis) return;
        const exp = { ...expForm, id: Date.now().toString() };
        const updated = [...experiments, exp];
        setExperiments(updated);

        const data = loadData();
        data.growth = { metrics, experiments: updated };
        saveData(data);

        setExpForm({ hypothesis: '', channel: '', cost: '', result: '', status: 'Run' });
    };

    const removeExperiment = (id) => {
        const updated = experiments.filter(ex => ex.id !== id);
        setExperiments(updated);
        const data = loadData();
        data.growth = { metrics, experiments: updated };
        saveData(data);
    };

    const calculateHealth = (key, val) => {
        const target = AARRR_METRICS.find(m => m.key === key).target;
        return val / target; // ratio of target
    };

    const scores = Object.keys(metrics).map(k => ({ key: k, ratio: calculateHealth(k, metrics[k]) }));
    const bottleneck = scores.reduce((prev, curr) => (prev.ratio < curr.ratio ? prev : curr), scores[0]);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Growth OS</h1>
                <p className="page-description">AARRR Pirate Funnel & Experiment Log. Find the constraint, break it.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="card-title">Pirate Funnel (AARRR)</h2>
                    <div className="flex-col gap-4">
                        {AARRR_METRICS.map(m => {
                            const isBottleneck = bottleneck.key === m.key;
                            return (
                                <div key={m.key} className={`form-group flex-col p-3 rounded border ${isBottleneck ? 'border-brand-danger bg-red-900 bg-opacity-10' : 'border-color bg-surface-elevated'}`}>
                                    <label className="form-label flex justify-between uppercase font-bold tracking-wide">
                                        <span>{m.label}</span>
                                        <span className="text-secondary text-xs font-normal">Target: {m.target}</span>
                                    </label>
                                    <input type="number" className="form-input mt-2" value={metrics[m.key]} onChange={(e) => handleMetricChange(m.key, e.target.value)} />
                                    {isBottleneck && <span className="text-xs text-danger font-bold mt-1">⚠️ Core Bottleneck Identified</span>}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="card">
                    <h2 className="card-title">Experiment Pipeline</h2>
                    <form className="mb-6 bg-surface-elevated p-4 rounded" onSubmit={addExperiment}>
                        <div className="form-group flex-col">
                            <label className="form-label">Hypothesis</label>
                            <input name="hypothesis" className="form-input" placeholder="If we do X, then Y will increase..." value={expForm.hypothesis} onChange={(e) => setExpForm({ ...expForm, hypothesis: e.target.value })} required />
                        </div>
                        <div className="grid-2">
                            <div className="form-group flex-col">
                                <label className="form-label">Channel</label>
                                <input name="channel" className="form-input" value={expForm.channel} onChange={(e) => setExpForm({ ...expForm, channel: e.target.value })} />
                            </div>
                            <div className="form-group flex-col">
                                <label className="form-label">Cost / Budget</label>
                                <input name="cost" className="form-input" value={expForm.cost} onChange={(e) => setExpForm({ ...expForm, cost: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid-2">
                            <div className="form-group flex-col">
                                <label className="form-label">Result</label>
                                <input name="result" className="form-input" placeholder="Outcomes..." value={expForm.result} onChange={(e) => setExpForm({ ...expForm, result: e.target.value })} />
                            </div>
                            <div className="form-group flex-col">
                                <label className="form-label">Status</label>
                                <select name="status" className="form-select" value={expForm.status} onChange={(e) => setExpForm({ ...expForm, status: e.target.value })}>
                                    <option>Run</option>
                                    <option>Continue</option>
                                    <option>Kill</option>
                                    <option>Scale</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Log Experiment</button>
                    </form>

                    <h3 className="text-sm uppercase font-bold text-secondary mb-3 tracking-wide">Log</h3>
                    {experiments.length === 0 ? <p className="text-sm text-secondary">No experiments running.</p> : null}
                    <div className="flex-col gap-3">
                        {experiments.map(exp => (
                            <div key={exp.id} className={`p-3 rounded flex-col border ${exp.status === 'Kill' ? 'border-danger opacity-60' : exp.status === 'Scale' ? 'border-success' : 'border-color'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm w-[80%]">{exp.hypothesis}</span>
                                    <span className={`badge ${exp.status === 'Kill' ? 'badge-red' : exp.status === 'Scale' ? 'badge-green' : 'badge-blue'} text-xs`}>{exp.status}</span>
                                </div>
                                <div className="text-xs text-secondary mb-2">
                                    Channel: {exp.channel || 'N/A'} | Cost: {exp.cost || 'N/A'}
                                </div>
                                {exp.result && <div className="text-xs italic border-l-2 border-brand-primary pl-2 p-1 bg-surface-elevated">Results: {exp.result}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
