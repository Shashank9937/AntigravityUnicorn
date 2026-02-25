import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const DEFAULT_SCORES = {
    marketSize: 5,
    painIntensity: 5,
    willingnessToPay: 5,
    timing: 5,
    competition: 5,
    founderFit: 5,
    aiAdvantage: 5,
    speedToRevenue: 5
};

export function OpportunityRadar() {
    const [scores, setScores] = useState(DEFAULT_SCORES);

    useEffect(() => {
        const data = loadData();
        if (data.radar && Object.keys(data.radar).length > 0) {
            setScores(data.radar);
        }
    }, []);

    const handleChange = (field, val) => {
        const newVal = parseInt(val, 10);
        const updated = { ...scores, [field]: newVal };
        setScores(updated);

        const data = loadData();
        data.radar = updated;
        saveData(data);
    };

    const total = Object.values(scores).reduce((a, b) => a + b, 0);

    const getVerdict = () => {
        if (total >= 65) return { label: 'Exceptional', color: 'badge-green' };
        if (total >= 50) return { label: 'Strong', color: 'badge-blue' };
        if (total >= 35) return { label: 'Weak', color: 'badge-yellow' };
        return { label: 'Do not pursue', color: 'badge-red' };
    };

    const verdict = getVerdict();
    const hasVetos = Object.entries(scores).filter(([_, val]) => val < 6);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Opportunity Radar</h1>
                <p className="page-description">Unicorn Convergence Framework: Score your idea across 8 dimensions.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="card-title">Score Interface (1-10)</h2>
                    <div className="flex-col gap-4">
                        {Object.entries(scores).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between mb-1">
                                    <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    <span className={`text-sm font-bold ${val < 6 ? 'text-danger' : 'text-success'}`}>{val}/10</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="10"
                                    value={val}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-col gap-6">
                    <div className="card text-center py-8">
                        <h3 className="text-secondary mb-2">Total Score</h3>
                        <div className="text-6xl font-bold mb-4">{total}<span className="text-2xl text-secondary">/80</span></div>
                        <span className={`badge ${verdict.color} text-lg py-1 px-4`}>{verdict.label}</span>
                    </div>

                    {hasVetos.length > 0 && (
                        <div className="card border-danger">
                            <h3 className="card-title text-danger flex items-center gap-2">
                                ⚠️ Weak Points Detected
                            </h3>
                            <p className="text-sm text-secondary mb-4">Any score below 6 creates a structural risk to a unicorn outcome.</p>
                            <ul className="flex-col gap-2">
                                {hasVetos.map(([key, val]) => (
                                    <li key={key} className="text-sm text-secondary bg-surface-elevated p-3 rounded">
                                        <strong>{key.replace(/([A-Z])/g, ' $1').trim()} ({val}/10):</strong> What must change to move this to an 8?
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
