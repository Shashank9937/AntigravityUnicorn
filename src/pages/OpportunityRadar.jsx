import React, { useState, useEffect, useMemo } from 'react';
import { loadData, saveData } from '../utils/storage';

const DIMENSIONS = [
    { key: 'problem', label: 'Problem Severeity', desc: 'Hair on Fire or Vitamin?' },
    { key: 'market', label: 'Market Size', desc: 'TAM > $1B?' },
    { key: 'founder', label: 'Founder-Market Fit', desc: 'Unfair advantage or industry insight?' },
    { key: 'timing', label: 'Timing', desc: 'Why NOW and not 5 years ago?' },
    { key: 'moat', label: 'Defensibility', desc: 'Network effects, switching costs, or data moat?' },
    { key: 'distribution', label: 'Distribution Edge', desc: 'Existing audience or unfair channel?' },
    { key: 'business', label: 'Business Model Clarity', desc: 'Clear pricing, unit economics defined?' },
    { key: 'obsession', label: 'Founder Obsession', desc: 'Will you work on this for 10 years?' }
];

export function OpportunityRadar() {
    const [scores, setScores] = useState(DIMENSIONS.reduce((acc, d) => ({ ...acc, [d.key]: 5 }), {}));

    useEffect(() => {
        const data = loadData();
        if (data.radar && Object.keys(data.radar).length > 0) {
            setScores(data.radar);
        }
    }, []);

    const handleChange = (key, val) => {
        const updated = { ...scores, [key]: Number(val) };
        setScores(updated);

        const data = loadData();
        data.radar = updated;
        saveData(data);
    };

    const total = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0), [scores]);
    const maxScore = DIMENSIONS.length * 10;
    const percentage = Math.round((total / maxScore) * 100);

    let verdict = 'Do Not Pursue';
    let verdictColor = '#f87171';
    let badgeClass = 'badge-red';
    if (total >= 65) { verdict = 'Exceptional — Build Now'; verdictColor = '#34d399'; badgeClass = 'badge-green'; }
    else if (total >= 48) { verdict = 'Strong — Worth Exploring'; verdictColor = '#fbbf24'; badgeClass = 'badge-yellow'; }
    else if (total >= 32) { verdict = 'Weak — Validate Further'; verdictColor = '#fbbf24'; badgeClass = 'badge-yellow'; }

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Opportunity Radar</h1>
                <p className="page-description">Score your idea across 8 dimensions using the Unicorn Convergence Framework.</p>
            </header>

            <div className="grid-2">
                <div className="card animate-fade-in-up">
                    <h2 className="card-title">Scoring Matrix</h2>
                    <div className="flex-col gap-4 stagger-children">
                        {DIMENSIONS.map((dim) => {
                            const score = scores[dim.key];
                            const scoreColor = score >= 8 ? '#34d399' : score >= 5 ? '#fbbf24' : '#f87171';
                            return (
                                <div key={dim.key} className="p-4 rounded animate-fade-in-up" style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <label className="text-sm font-bold">{dim.label}</label>
                                        <span className="text-lg font-black" style={{ color: scoreColor }}>{score}/10</span>
                                    </div>
                                    <p className="text-xs text-secondary italic mb-2">{dim.desc}</p>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={score}
                                        onChange={(e) => handleChange(dim.key, e.target.value)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-col gap-6">
                    <div className="card animate-fade-in-up text-center py-8">
                        <h2 className="text-secondary uppercase text-sm font-bold tracking-widest mb-3">Convergence Score</h2>
                        <div
                            className="text-4xl font-black mb-4"
                            style={{ color: verdictColor }}
                        >
                            {total}/{maxScore}
                        </div>
                        <div className="mb-6 mx-auto" style={{ width: '70%' }}>
                            <div className="progress-bar" style={{ height: 10 }}>
                                <div className="progress-bar-fill" style={{ width: `${percentage}%`, background: verdictColor }} />
                            </div>
                        </div>
                        <span className={`badge ${badgeClass} py-1 px-4 text-sm`} style={{ display: 'inline-block' }}>
                            {verdict}
                        </span>
                    </div>

                    <div className="card animate-fade-in-up">
                        <h2 className="card-title">Dimension Breakdown</h2>
                        <div className="flex-col gap-3">
                            {DIMENSIONS.map(dim => {
                                const score = scores[dim.key];
                                const width = (score / 10) * 100;
                                const barColor = score >= 8 ? '#34d399' : score >= 5 ? '#fbbf24' : '#f87171';
                                return (
                                    <div key={dim.key}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-secondary">{dim.label}</span>
                                            <span className="font-bold" style={{ color: barColor }}>{score}</span>
                                        </div>
                                        <div className="progress-bar" style={{ height: 6 }}>
                                            <div className="progress-bar-fill" style={{ width: `${width}%`, background: barColor }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card animate-fade-in-up" style={{
                        borderLeft: `3px solid ${verdictColor}`,
                        background: `linear-gradient(135deg, var(--bg-surface) 0%, ${verdictColor}10 100%)`,
                    }}>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-2">Framework Insight</h3>
                        <p className="text-sm text-secondary leading-relaxed">
                            {total >= 65
                                ? "This idea shows exceptional convergence across all dimensions. Execute aggressively — the window is open."
                                : total >= 48
                                    ? "Strong foundation but gaps exist. Address the weakest dimensions before going all-in."
                                    : total >= 32
                                        ? "Significant gaps identified. Run more validation before committing resources."
                                        : "This idea does not demonstrate sufficient convergence. Pivot or explore alternatives."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
