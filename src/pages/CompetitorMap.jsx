import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

export function CompetitorMap() {
    const [competitors, setCompetitors] = useState([]);
    const [form, setForm] = useState({ name: '', price: 50, complexity: 50, strengths: '', weaknesses: '', positioning: '' });

    useEffect(() => {
        const data = loadData();
        if (data.competitors && Array.isArray(data.competitors)) {
            setCompetitors(data.competitors);
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.type === 'number' || e.target.type === 'range' ? Number(e.target.value) : e.target.value });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!form.name) return;
        const newComp = { ...form, id: Date.now().toString() };
        const updated = [...competitors, newComp];
        setCompetitors(updated);

        const data = loadData();
        data.competitors = updated;
        saveData(data);

        setForm({ name: '', price: 50, complexity: 50, strengths: '', weaknesses: '', positioning: '' });
    };

    const removeCompetitor = (id) => {
        const updated = competitors.filter(c => c.id !== id);
        setCompetitors(updated);
        const data = loadData();
        data.competitors = updated;
        saveData(data);
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Competitor Map</h1>
                <p className="page-description">Identify the whitespace. Where aren't they?</p>
            </header>

            <div className="grid-2">
                <div className="flex-col gap-6">
                    <div className="card animate-fade-in-up">
                        <h2 className="card-title">Add Competitor</h2>
                        <form onSubmit={handleAdd}>
                            <div className="form-group">
                                <label className="form-label">Competitor Name</label>
                                <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="grid-2 mb-4">
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Price (0=Low, 100=High): <strong>{form.price}</strong></label>
                                    <input type="range" name="price" min="0" max="100" value={form.price} onChange={handleChange} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Complexity (0=Simple, 100=Complex): <strong>{form.complexity}</strong></label>
                                    <input type="range" name="complexity" min="0" max="100" value={form.complexity} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Strengths</label>
                                <input name="strengths" className="form-input" value={form.strengths} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Weaknesses</label>
                                <input name="weaknesses" className="form-input" value={form.weaknesses} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Positioning</label>
                                <input name="positioning" className="form-input" placeholder="e.g. For large enterprise teams" value={form.positioning} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">Add Competitor</button>
                        </form>
                    </div>

                    <div className="card animate-fade-in-up">
                        <h2 className="card-title">Competitor List</h2>
                        {competitors.length === 0 ? <p className="text-secondary text-sm">No competitors mapped yet.</p> : null}
                        <div className="flex-col gap-3">
                            {competitors.map(c => (
                                <div key={c.id} className="p-3 rounded flex justify-between items-start group" style={{ background: 'var(--bg-surface-elevated)' }}>
                                    <div>
                                        <strong className="block">{c.name}</strong>
                                        <span className="text-xs text-secondary mt-1 block">S: {c.strengths} | W: {c.weaknesses}</span>
                                    </div>
                                    <button className="btn btn-ghost text-xs p-1 h-auto text-danger opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeCompetitor(c.id)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card animate-fade-in-up flex-col" style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <h2 className="card-title w-full text-center">2×2 Market Map</h2>
                    <div
                        className="relative w-full rounded overflow-hidden"
                        style={{
                            height: 500,
                            background: 'var(--bg-surface-elevated)',
                            border: '1px solid var(--border-color)',
                            marginTop: 'var(--space-4)',
                        }}
                    >
                        {/* Grid Lines */}
                        <div className="absolute" style={{ top: '50%', left: 0, width: '100%', borderTop: '1px dashed var(--border-color)' }} />
                        <div className="absolute" style={{ top: 0, left: '50%', height: '100%', borderLeft: '1px dashed var(--border-color)' }} />

                        {/* Labels */}
                        <div className="absolute text-xs text-secondary font-bold uppercase tracking-wider" style={{ top: 8, left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-surface-elevated)', padding: '0 8px' }}>Complex</div>
                        <div className="absolute text-xs text-secondary font-bold uppercase tracking-wider" style={{ bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-surface-elevated)', padding: '0 8px' }}>Simple</div>
                        <div className="absolute text-xs text-secondary font-bold uppercase tracking-wider" style={{ left: 8, top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-surface-elevated)', padding: '8px 0' }}>Low Price</div>
                        <div className="absolute text-xs text-secondary font-bold uppercase tracking-wider" style={{ right: 8, top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-surface-elevated)', padding: '8px 0' }}>High Price</div>

                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.06 }}>
                            <span className="font-bold uppercase select-none whitespace-nowrap" style={{ fontSize: '3.5rem', transform: 'rotate(-12deg)' }}>Find the Gap</span>
                        </div>

                        {/* Competitor Points */}
                        {competitors.map(c => (
                            <div
                                key={c.id}
                                className="absolute group"
                                style={{
                                    left: `${c.price}%`,
                                    top: `${100 - c.complexity}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    background: 'var(--brand-primary)',
                                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)',
                                    cursor: 'pointer',
                                    transition: 'transform var(--duration-fast) ease',
                                }}
                            >
                                <div
                                    className="tooltip"
                                    style={{ bottom: 22, left: '50%', transform: 'translateX(-50%)' }}
                                >
                                    {c.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
