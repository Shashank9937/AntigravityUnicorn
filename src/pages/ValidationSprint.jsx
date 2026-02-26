import React, { useState, useEffect, useMemo } from 'react';
import { loadData, saveData } from '../utils/storage';

const WEEKS = [
    { key: 'w1', label: 'Week 1 — Problem Interviews', objective: '20 interviews. Are they actually in pain?', metric: 'Validated customer problem' },
    { key: 'w2', label: 'Week 2 — Fake Door Test', objective: 'Create a landing page. Monitor conversion.', metric: 'Visit-to-signup > 10%' },
    { key: 'w3', label: 'Week 3 — Pre-sales', objective: 'Ask 10 people to pay before you build.', metric: '3+ pre-sales commitments' },
    { key: 'w4', label: 'Week 4 — Channel Experiments', objective: 'Find ONE free acquisition channel.', metric: 'Repeatable, cost-effective channel found' }
];

export function ValidationSprint() {
    const [progress, setProgress] = useState(
        WEEKS.reduce((acc, w) => ({ ...acc, [w.key]: { passed: false, notes: '', evidence: '' } }), {})
    );

    useEffect(() => {
        const data = loadData();
        if (data.validation && Object.keys(data.validation).length > 0) {
            setProgress(data.validation);
        }
    }, []);

    const handleUpdate = (weekKey, field, value) => {
        const updated = {
            ...progress,
            [weekKey]: { ...progress[weekKey], [field]: value }
        };
        setProgress(updated);

        const data = loadData();
        data.validation = updated;
        saveData(data);
    };

    const passedWeeks = useMemo(() => Object.values(progress).filter(w => w.passed).length, [progress]);

    let verdict = 'Insufficient Data';
    let verdictColor = 'var(--text-secondary)';
    let badgeClass = 'badge-gray';
    if (passedWeeks >= 4) { verdict = '🚀 BUILD — Full Confidence'; verdictColor = '#34d399'; badgeClass = 'badge-green'; }
    else if (passedWeeks >= 3) { verdict = '🔄 BUILD WITH CAUTION'; verdictColor = '#fbbf24'; badgeClass = 'badge-yellow'; }
    else if (passedWeeks >= 2) { verdict = '🐢 PIVOT — Must strengthen signal'; verdictColor = '#fbbf24'; badgeClass = 'badge-yellow'; }
    else if (passedWeeks >= 1) { verdict = '🛑 STOP — Re-validate the problem'; verdictColor = '#f87171'; badgeClass = 'badge-red'; }

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Validation Sprint</h1>
                <p className="page-description">4 weeks. Zero assumptions. Empirical truth only.</p>
            </header>

            {/* Verdict Card */}
            <div
                className="card mb-6 flex items-center justify-between animate-fade-in-up"
                style={{
                    borderColor: verdictColor + '40',
                    background: `linear-gradient(135deg, var(--bg-surface) 0%, ${verdictColor}08 100%)`,
                }}
            >
                <div>
                    <h2 className="uppercase tracking-widest text-secondary text-xs font-bold mb-2">Validation Verdict</h2>
                    <div className="text-2xl font-black" style={{ color: verdictColor }}>{verdict}</div>
                </div>
                <div>
                    <div className="text-4xl font-black text-center" style={{ color: verdictColor }}>{passedWeeks}/4</div>
                    <div className="text-xs text-secondary text-center mt-1">Weeks Passed</div>
                </div>
            </div>

            {/* Sprint weeks */}
            <div className="flex-col gap-6 stagger-children">
                {WEEKS.map((week) => {
                    const weekData = progress[week.key];
                    return (
                        <div
                            key={week.key}
                            className="card animate-fade-in-up"
                            style={{
                                borderColor: weekData?.passed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)',
                                borderLeftWidth: 3,
                                background: weekData?.passed ? 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(16, 185, 129, 0.03) 100%)' : 'var(--bg-surface)',
                            }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="font-bold text-lg mb-1">{week.label}</h2>
                                    <p className="text-sm text-secondary italic">{week.objective}</p>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm whitespace-nowrap" style={{
                                    color: weekData?.passed ? '#34d399' : 'var(--text-secondary)',
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={weekData?.passed || false}
                                        onChange={(e) => handleUpdate(week.key, 'passed', e.target.checked)}
                                    />
                                    {weekData?.passed ? 'Passed' : 'Mark Passed'}
                                </label>
                            </div>

                            <div className="p-3 rounded mb-4" style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
                                <span className="text-xs text-secondary uppercase tracking-widest font-bold">Success Metric:</span>
                                <p className="text-sm font-bold mt-1">{week.metric}</p>
                            </div>

                            <div className="grid-2">
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Notes & Learnings</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Key takeaways from this week..."
                                        value={weekData?.notes || ''}
                                        onChange={(e) => handleUpdate(week.key, 'notes', e.target.value)}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Evidence / Data</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Link to spreadsheets, interview notes, screenshots..."
                                        value={weekData?.evidence || ''}
                                        onChange={(e) => handleUpdate(week.key, 'evidence', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
