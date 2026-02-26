import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

export function Hiring() {
    const [team, setTeam] = useState([]);
    const [form, setForm] = useState({
        title: '', bottleneck: '', outcomes: '', salary: '', equity: '', stage: 'Sourcing'
    });

    useEffect(() => {
        const data = loadData();
        if (data.hiring && Array.isArray(data.hiring)) {
            setTeam(data.hiring);
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!form.title) return;
        const newRole = { ...form, id: Date.now().toString() };
        const updated = [...team, newRole];
        setTeam(updated);

        const data = loadData();
        data.hiring = updated;
        saveData(data);

        setForm({ title: '', bottleneck: '', outcomes: '', salary: '', equity: '', stage: 'Sourcing' });
    };

    const removeRole = (id) => {
        const updated = team.filter(t => t.id !== id);
        setTeam(updated);
        const data = loadData();
        data.hiring = updated;
        saveData(data);
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Hiring & Team</h1>
                <p className="page-description">Who clears the bottleneck? Hire for outcomes, not tasks.</p>
            </header>

            <div className="grid-2">
                <div className="card animate-fade-in-up">
                    <h2 className="card-title">Role Definition</h2>
                    <form onSubmit={handleAdd}>
                        <div className="form-group">
                            <label className="form-label text-danger font-bold">What Bottleneck does this solve?</label>
                            <input name="bottleneck" className="form-input" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }} placeholder="e.g. Sales velocity is maxed out at 5 calls/day" value={form.bottleneck} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role Title</label>
                            <input name="title" className="form-input" value={form.title} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">First 90-Day Outcomes</label>
                            <textarea name="outcomes" className="form-textarea" placeholder="1. Close $50k MRR..." value={form.outcomes} onChange={handleChange} />
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Target Salary</label>
                                <input name="salary" className="form-input" value={form.salary} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Equity Range %</label>
                                <input name="equity" className="form-input" value={form.equity} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stage</label>
                            <select name="stage" className="form-select" value={form.stage} onChange={handleChange}>
                                <option>Sourcing</option>
                                <option>Interviewing</option>
                                <option>Offer Extended</option>
                                <option>Hired</option>
                                <option>Onboarding</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary mt-4">Open Requisition</button>
                    </form>
                </div>

                <div className="flex-col gap-6">
                    <div className="card animate-fade-in-up">
                        <h2 className="card-title">Candidate Scorecard System</h2>
                        <p className="text-secondary text-sm mb-4">You must measure candidates objectively against outcomes, not "vibes".</p>
                        <div className="p-4 rounded flex-col gap-2" style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
                            <label className="flex items-center gap-2 text-sm text-secondary"><input type="checkbox" disabled /> Do they have a track record doing exactly this?</label>
                            <label className="flex items-center gap-2 text-sm text-secondary"><input type="checkbox" disabled /> Are they a culture accelerant (not just fit)?</label>
                            <label className="flex items-center gap-2 text-sm text-secondary"><input type="checkbox" disabled /> Will they accept the founder's pace?</label>
                            <label className="flex items-center gap-2 text-sm text-secondary"><input type="checkbox" disabled /> Can they operate with zero playbook?</label>
                        </div>
                    </div>

                    <div className="card animate-fade-in-up">
                        <h2 className="card-title">Active Roles</h2>
                        {team.length === 0 ? <p className="text-sm text-secondary">No roles defined.</p> : null}
                        <div className="flex-col gap-4 stagger-children">
                            {team.map(r => (
                                <div key={r.id} className="p-4 rounded border flex justify-between items-start group animate-fade-in-up" style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)' }}>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{r.title} <span className="badge badge-gray text-xs ml-2">{r.stage}</span></h3>
                                        <p className="text-danger text-sm font-medium mb-2">Solves: {r.bottleneck}</p>
                                        <p className="text-secondary text-sm">Comp: {r.salary} | {r.equity} Equity</p>
                                        {r.outcomes && <p className="text-secondary text-xs mt-2 italic pl-2" style={{ borderLeft: '1px solid var(--border-color)' }}>{r.outcomes}</p>}
                                    </div>
                                    <button className="btn btn-ghost p-1 text-danger opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeRole(r.id)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
