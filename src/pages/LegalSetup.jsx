import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const CHECKLIST_ITEMS = [
    { key: 'incorporated', label: 'Incorporated (C-Corp or LLC)', explanation: 'Delaware C-Corp is standard for venture scale.' },
    { key: 'vesting', label: 'Founder Vesting Set', explanation: 'Standard: 4-year vest, 1-year cliff. Protects the cap table.' },
    { key: 'ip', label: 'IP Assigned to Company', explanation: 'All code and assets created before incorporation must be legally assigned.' },
    { key: 'contractors', label: 'Contractor Agreements Signed', explanation: 'Standard PIIA signed by anyone touching the product.' },
    { key: 'opensource', label: 'Open Source Dependencies Checked', explanation: 'Ensure no restrictive (e.g. AGPL) licenses infect proprietary code.' },
    { key: 'trademark', label: 'Trademark Searched', explanation: 'TESS search to avoid C&D issues later.' },
    { key: 'privacy', label: 'Privacy Policy Live', explanation: 'GDPR/CCPA compliant privacy policy.' },
    { key: 'terms', label: 'Terms of Service Live', explanation: 'Limits liability and defines usage terms.' }
];

export function LegalSetup() {
    const [checklist, setChecklist] = useState({
        incorporated: false, vesting: false, ip: false, contractors: false,
        opensource: false, trademark: false, privacy: false, terms: false
    });

    useEffect(() => {
        const data = loadData();
        if (data.legal && Object.keys(data.legal).length > 0) {
            setChecklist(data.legal);
        }
    }, []);

    const handleChange = (k, val) => {
        const updated = { ...checklist, [k]: val };
        setChecklist(updated);

        const data = loadData();
        data.legal = updated;
        saveData(data);
    };

    const completedCount = Object.values(checklist).filter(v => v).length;
    const totalCount = CHECKLIST_ITEMS.length;
    const progressRatio = completedCount / totalCount;

    let statusColor = '#f87171';
    let badgeClass = 'badge-red';
    let statusText = 'Critical Risk Zone';

    if (progressRatio === 1) {
        statusColor = '#34d399';
        badgeClass = 'badge-green';
        statusText = 'Execution Ready & Protected';
    } else if (progressRatio > 0.5) {
        statusColor = '#fbbf24';
        badgeClass = 'badge-yellow';
        statusText = 'Partial Coverage — Fix Gaps';
    }

    const progressFill = progressRatio === 1
        ? 'var(--brand-success)'
        : progressRatio > 0.5
            ? 'var(--brand-warning)'
            : 'var(--brand-danger)';

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Legal Setup</h1>
                <p className="page-description">Protect the foundation. Don't build an empire on sand.</p>
            </header>

            <div className="grid-2">
                <div className="card animate-fade-in-up">
                    <h2 className="card-title mb-6">Execution Checklist</h2>
                    <div className="flex-col gap-4 stagger-children">
                        {CHECKLIST_ITEMS.map((item) => (
                            <label
                                key={item.key}
                                className="flex gap-4 p-4 rounded border cursor-pointer animate-fade-in-up"
                                style={{
                                    background: checklist[item.key] ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface-elevated)',
                                    borderColor: checklist[item.key] ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)',
                                    transition: 'all var(--duration-base) ease',
                                }}
                            >
                                <div className="pt-1">
                                    <input
                                        type="checkbox"
                                        checked={checklist[item.key] || false}
                                        onChange={(e) => handleChange(item.key, e.target.checked)}
                                    />
                                </div>
                                <div>
                                    <span className="block font-bold mb-1" style={{ color: checklist[item.key] ? '#34d399' : 'var(--text-primary)' }}>{item.label}</span>
                                    <p className="text-secondary text-sm leading-relaxed">{item.explanation}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex-col gap-6">
                    <div className="card text-center p-6 animate-fade-in-up">
                        <h3 className="uppercase tracking-widest text-secondary text-sm font-bold mb-4">Risk Status</h3>
                        <div className="mb-4" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: statusColor }}>
                            <span style={{ opacity: 0.5, fontSize: 'var(--text-xl)', marginRight: 8 }}>Status:</span>
                            {Math.round(progressRatio * 100)}%
                        </div>
                        <span className={`badge ${badgeClass} text-lg py-1 px-6`} style={{ display: 'inline-block', marginBottom: 'var(--space-6)' }}>{statusText}</span>
                        <div className="progress-bar" style={{ height: 10 }}>
                            <div
                                className="progress-bar-fill"
                                style={{
                                    width: `${Math.max(5, progressRatio * 100)}%`,
                                    background: progressFill,
                                    transition: 'width 0.5s var(--ease-out)',
                                }}
                            />
                        </div>
                        {progressRatio < 1 && (
                            <p className="text-sm mt-8 text-secondary max-w-sm mx-auto">
                                <strong className="text-danger flex items-center justify-center gap-1 mb-2">⚠️ Warning</strong>
                                Missing legal structure limits defensibility, ruins capital raises, and generates fatal liabilities. Fix immediately.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
