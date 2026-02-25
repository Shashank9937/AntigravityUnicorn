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
        setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
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
            <div className="page-header">
                <h1 className="page-title">Competitor Map</h1>
                <p className="page-description">Identify the whitespace. Where aren't they?</p>
            </div>

            <div className="grid-2">
                <div className="flex-col gap-6">
                    <div className="card">
                        <h2 className="card-title">Add Competitor</h2>
                        <form onSubmit={handleAdd}>
                            <div className="form-group flex-col">
                                <label className="form-label">Competitor Name</label>
                                <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="grid-2 mb-4">
                                <div className="form-group flex-col mb-0">
                                    <label className="form-label">Price (0=Low, 100=High)</label>
                                    <input type="range" name="price" min="0" max="100" value={form.price} onChange={handleChange} />
                                </div>
                                <div className="form-group flex-col mb-0">
                                    <label className="form-label">Complexity (0=Simple, 100=Complex)</label>
                                    <input type="range" name="complexity" min="0" max="100" value={form.complexity} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group flex-col">
                                <label className="form-label">Strengths</label>
                                <input name="strengths" className="form-input" value={form.strengths} onChange={handleChange} />
                            </div>
                            <div className="form-group flex-col">
                                <label className="form-label">Weaknesses</label>
                                <input name="weaknesses" className="form-input" value={form.weaknesses} onChange={handleChange} />
                            </div>
                            <div className="form-group flex-col">
                                <label className="form-label">Positioning</label>
                                <input name="positioning" className="form-input" placeholder="e.g. For large enterprise teams" value={form.positioning} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">Add Competitor</button>
                        </form>
                    </div>

                    <div className="card">
                        <h2 className="card-title">Competitor List</h2>
                        {competitors.length === 0 ? <p className="text-secondary text-sm">No competitors mapped yet.</p> : null}
                        <div className="flex-col gap-3">
                            {competitors.map(c => (
                                <div key={c.id} className="bg-surface-elevated p-3 rounded flex justify-between items-start">
                                    <div>
                                        <strong className="block">{c.name}</strong>
                                        <span className="text-xs text-secondary mt-1 block">S: {c.strengths} | W: {c.weaknesses}</span>
                                    </div>
                                    <button className="btn btn-ghost text-xs p-1 h-auto text-danger" onClick={() => removeCompetitor(c.id)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card flex items-center justify-center flex-col h-[600px] overflow-hidden">
                    <h2 className="card-title w-full text-center">2x2 Market Map</h2>
                    <div className="relative w-full h-[500px] bg-surface-elevated rounded border border-color mt-4 overflow-hidden">
                        {/* Grid Lines */}
                        <div className="absolute top-1/2 left-0 w-full border-t border-color border-dashed"></div>
                        <div className="absolute top-0 left-1/2 h-full border-l border-color border-dashed"></div>

                        {/* Labels */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-secondary font-bold uppercase tracking-wider bg-surface-elevated px-2">Complex</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-secondary font-bold uppercase tracking-wider bg-surface-elevated px-2">Simple</div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-secondary font-bold uppercase tracking-wider bg-surface-elevated py-2">Low Price</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-secondary font-bold uppercase tracking-wider bg-surface-elevated py-2">High Price</div>

                        {/* Whitespace text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                            <span className="text-6xl font-bold uppercase rotate-45 select-none whitespace-nowrap">Find the Gap</span>
                        </div>

                        {/* Points */}
                        {competitors.map(c => (
                            <div
                                key={c.id}
                                className="absolute w-4 h-4 rounded-full bg-brand-danger transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group"
                                style={{
                                    left: `${c.price}%`,
                                    top: `${100 - c.complexity}%` // 100 (top) is complex, 0 (bottom) is simple
                                }}
                            >
                                <div className="absolute opacity-0 group-hover:opacity-100 bg-black text-white text-xs whitespace-nowrap px-2 py-1 rounded bottom-5 transition-opacity pointer-events-none z-10">
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
