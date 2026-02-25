import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const MOAT_TYPES = [
    'Proprietary Data',
    'Network Effects',
    'Switching Costs',
    'Brand & Trust',
    'Regulatory',
    'Unique Distribution',
    'Operational Excellence'
];

export function MoatBuilder() {
    const [moat, setMoat] = useState({
        primary: '',
        secondary: '',
        timeline: '',
        stressTest: null
    });

    useEffect(() => {
        const data = loadData();
        if (data.moat && Object.keys(data.moat).length > 0) {
            setMoat(data.moat);
        }
    }, []);

    const handleChange = (e) => {
        const updated = { ...moat, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
        setMoat(updated);

        const data = loadData();
        data.moat = updated;
        saveData(data);
    };

    const getMoatColor = (type) => {
        switch (type) {
            case 'Proprietary Data': return 'linear-gradient(135deg, #1e3a8a, #3b82f6)';
            case 'Network Effects': return 'linear-gradient(135deg, #4c1d95, #8b5cf6)';
            case 'Switching Costs': return 'linear-gradient(135deg, #064e3b, #10b981)';
            case 'Brand & Trust': return 'linear-gradient(135deg, #7c2d12, #f59e0b)';
            case 'Regulatory': return 'linear-gradient(135deg, #1e293b, #64748b)';
            case 'Unique Distribution': return 'linear-gradient(135deg, #7f1d1d, #ef4444)';
            case 'Operational Excellence': return 'linear-gradient(135deg, #0f172a, #475569)';
            default: return 'var(--bg-surface-elevated)';
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Moat Builder</h1>
                <p className="page-description">Design defensibility from day one. Compete to win.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="card-title">Define Moat Stack</h2>

                    <div className="form-group">
                        <label className="form-label">Primary Moat</label>
                        <select name="primary" className="form-select" value={moat.primary} onChange={handleChange}>
                            <option value="">Select Primary Defensibility</option>
                            {MOAT_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Secondary Moat</label>
                        <select name="secondary" className="form-select" value={moat.secondary} onChange={handleChange}>
                            <option value="">Select Secondary Defensibility</option>
                            {MOAT_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Timeline to Develop (Months)</label>
                        <input name="timeline" type="number" className="form-input" min="1" placeholder="e.g. 18" value={moat.timeline} onChange={handleChange} />
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                        <label className="flex items-center justify-between text-sm font-medium bg-surface-elevated p-3 rounded cursor-pointer border border-color hover:border-brand-primary">
                            Toggle Moat Stress Test
                            <input type="checkbox" name="stressTest" checked={moat.stressTest || false} onChange={handleChange} />
                        </label>
                        {moat.stressTest && (
                            <div className="p-4 bg-surface-elevated rounded border border-danger border-opacity-50">
                                <h4 className="text-danger font-medium text-sm mb-2">Stress Test Protocol:</h4>
                                <ul className="text-secondary text-sm space-y-1 ml-4 list-disc">
                                    <li>Can a well-funded competitor copy this in 6 months?</li>
                                    <li>Does this moat compound linearly or exponentially?</li>
                                    <li>What happens if underlying platforms change terms?</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="card-title mb-6">Moat Visualization</h2>
                    <div className="flex flex-col gap-4 items-center justify-center p-8 bg-surface border border-color rounded-xl h-[300px]">
                        {moat.primary ? (
                            <div
                                className="w-full max-w-sm rounded-lg p-6 text-center font-bold shadow-lg transform translate-y-2 z-10"
                                style={{ background: getMoatColor(moat.primary), border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                1. {moat.primary}
                            </div>
                        ) : <p className="text-secondary text-sm italic">Select a primary moat</p>}

                        {moat.secondary ? (
                            <div
                                className="w-5/6 max-w-xs rounded-lg p-4 text-center font-semibold shadow-md transform -translate-y-2 z-0 opacity-80"
                                style={{ background: getMoatColor(moat.secondary), border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                2. {moat.secondary}
                            </div>
                        ) : moat.primary && <p className="text-secondary text-sm italic">Add a secondary moat</p>}
                    </div>

                    <p className="text-center text-sm text-secondary mt-4">
                        Expected Defensibility: {moat.timeline ? `${moat.timeline} months` : 'TBD'}
                    </p>
                </div>
            </div>
        </div>
    );
}
