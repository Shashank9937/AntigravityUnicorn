import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const INITIAL_SPRINT = {
    week1: { name: 'Problem Interviews', notes: '', evidence: '', pass: false },
    week2: { name: 'Fake Door Test', notes: '', evidence: '', pass: false },
    week3: { name: 'Pre-Sale', notes: '', evidence: '', pass: false },
    week4: { name: 'Channel Experiment', notes: '', evidence: '', pass: false },
};

export function ValidationSprint() {
    const [sprint, setSprint] = useState(INITIAL_SPRINT);

    useEffect(() => {
        const data = loadData();
        if (data.validation && Object.keys(data.validation).length > 0) {
            setSprint(data.validation);
        }
    }, []);

    const handleChange = (week, field, val) => {
        const updated = {
            ...sprint,
            [week]: { ...sprint[week], [field]: val }
        };
        setSprint(updated);

        const data = loadData();
        data.validation = updated;
        saveData(data);
    };

    const passes = Object.values(sprint).filter(w => w.pass).length;
    let verdict = 'Stop';
    let badgeColor = 'badge-red';
    if (passes === 4) {
        verdict = 'Build';
        badgeColor = 'badge-green';
    } else if (passes >= 2) {
        verdict = 'Pivot';
        badgeColor = 'badge-yellow';
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Validation Sprint</h1>
                <p className="page-description">30-day empirical proof engine. Validate relentlessly before building.</p>
            </div>

            <div className="grid-2">
                {Object.entries(sprint).map(([key, data]) => (
                    <div className="card" key={key}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title mb-0">{data.name}</h2>
                            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.pass}
                                    onChange={(e) => handleChange(key, 'pass', e.target.checked)}
                                />
                                Passed?
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-textarea"
                                placeholder="What did you learn?"
                                value={data.notes}
                                onChange={(e) => handleChange(key, 'notes', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Evidence Upload (URL/Text)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Link to data, screenshots, or transcripts"
                                value={data.evidence}
                                onChange={(e) => handleChange(key, 'evidence', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className={`card text-center border-t-4 ${verdict === 'Build' ? 'border-brand-success' : verdict === 'Pivot' ? 'border-brand-warning' : 'border-brand-danger'} py-8 mt-6`}>
                <h2 className="text-secondary font-medium tracking-wide mb-2 uppercase">Decision Protocol: Verdict</h2>
                <div className="text-5xl font-bold mt-2">
                    {verdict.toUpperCase()}
                </div>
                <p className="mt-4 text-sm text-secondary">
                    {verdict === 'Build' ? 'All experiments passed. Time to execute.' : verdict === 'Pivot' ? 'Mixed signals. Rethink hypothesis and run another sprint.' : 'Failed critical validation. Drop idea or radically shift.'}
                </p>
            </div>
        </div>
    );
}
