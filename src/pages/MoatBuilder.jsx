import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const MOAT_TYPES = [
    'Network Effects',
    'Switching Costs',
    'Scale Economies',
    'Proprietary Data',
    'Brand Equity',
    'Regulatory Moat',
    'Community Lock-in',
    'Vertical Integration',
    'Founder Expertise',
    'Legal IP (Patents)'
];

export function MoatBuilder() {
    const [moat, setMoat] = useState({
        primary: '', secondary: '', timeline: '', stressTest: '',
        defensibility: '',
        confidence: 3
    });

    useEffect(() => {
        const data = loadData();
        if (data.moat && Object.keys(data.moat).length > 0) {
            setMoat(data.moat);
        }
    }, []);

    const handleChange = (field, value) => {
        const updated = { ...moat, [field]: value };
        setMoat(updated);

        const data = loadData();
        data.moat = updated;
        saveData(data);
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Moat Builder</h1>
                <p className="page-description">Defensibility is survival. Are you building a moat or a sandcastle?</p>
            </header>

            <div className="grid-2">
                <div className="card animate-fade-in-up">
                    <h2 className="card-title">Core Moat Design</h2>
                    <div className="form-group">
                        <label className="form-label text-danger font-bold">Primary Moat *</label>
                        <select className="form-select" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }} value={moat.primary} onChange={(e) => handleChange('primary', e.target.value)}>
                            <option value="">Select Primary Moat</option>
                            {MOAT_TYPES.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Secondary Moat</label>
                        <select className="form-select" value={moat.secondary} onChange={(e) => handleChange('secondary', e.target.value)}>
                            <option value="">Select Secondary Moat</option>
                            {MOAT_TYPES.filter(m => m !== moat.primary).map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Estimated Time to Build (months)</label>
                        <input type="number" className="form-input" value={moat.timeline} onChange={(e) => handleChange('timeline', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">How defensible on a 1-10 scale?</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={moat.confidence}
                            onChange={(e) => handleChange('confidence', Number(e.target.value))}
                        />
                        <div className="flex justify-between text-xs text-secondary mt-1">
                            <span>Weak</span>
                            <span className="font-bold" style={{ color: moat.confidence >= 8 ? '#34d399' : moat.confidence >= 5 ? '#fbbf24' : '#f87171' }}>
                                {moat.confidence}/10
                            </span>
                            <span>Fortress</span>
                        </div>
                    </div>
                </div>

                <div className="flex-col gap-6">
                    <div className="card animate-fade-in-up" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                        <h2 className="card-title">🔩 Stress Test</h2>
                        <div className="form-group">
                            <label className="form-label text-warning font-bold">If a $100M competitor copies you, what makes you win?</label>
                            <textarea
                                name="stressTest"
                                className="form-textarea"
                                style={{ borderColor: 'rgba(245, 158, 11, 0.3)', minHeight: '120px' }}
                                placeholder="Be brutally honest..."
                                value={moat.stressTest}
                                onChange={(e) => handleChange('stressTest', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="card animate-fade-in-up">
                        <h2 className="card-title">Moat Defensibility Notes</h2>
                        <div className="form-group">
                            <textarea
                                name="defensibility"
                                className="form-textarea"
                                style={{ minHeight: '120px' }}
                                placeholder="How does this moat get stronger over time?"
                                value={moat.defensibility}
                                onChange={(e) => handleChange('defensibility', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Visual representation */}
                    {moat.primary && (
                        <div className="card animate-fade-in-up text-center p-6">
                            <h3 className="text-secondary uppercase text-xs font-bold tracking-widest mb-4">Moat Stack</h3>
                            <div className="flex-col gap-3 items-center">
                                <div
                                    className="px-6 py-4 rounded-lg font-bold text-lg"
                                    style={{
                                        background: 'var(--brand-primary-muted)',
                                        color: 'var(--brand-primary-hover)',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        width: '100%',
                                        maxWidth: 320,
                                    }}
                                >
                                    🛡️ {moat.primary}
                                </div>
                                {moat.secondary && (
                                    <div
                                        className="px-4 py-3 rounded font-semibold text-sm"
                                        style={{
                                            background: 'var(--bg-surface-elevated)',
                                            border: '1px solid var(--border-color)',
                                            width: '80%',
                                            maxWidth: 260,
                                        }}
                                    >
                                        🔗 {moat.secondary}
                                    </div>
                                )}
                                {moat.timeline && (
                                    <div className="text-xs text-secondary mt-2">
                                        ⏱️ Build time: ~{moat.timeline} months
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
