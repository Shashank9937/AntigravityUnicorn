import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { toast } from 'sonner';

export function IdeaEngine() {
    const [ideas, setIdeas] = useState([]);
    const [form, setForm] = useState({
        name: '', category: '', status: 'Seed', description: '', hypothesis: '',
        risk: '', advantage: ''
    });

    useEffect(() => {
        const data = loadData();
        if (data.ideasList && Array.isArray(data.ideasList)) {
            setIdeas(data.ideasList);
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.risk || !form.advantage) {
            toast.error('Name, Riskiest Assumption, and Unfair Advantage are mandatory.');
            return;
        }

        const newIdea = { ...form, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
        const updated = [newIdea, ...ideas];
        setIdeas(updated);

        const data = loadData();
        data.ideasList = updated;
        saveData(data);

        toast.success(`Idea logged: ${form.name}`);
        setForm({ name: '', category: '', status: 'Seed', description: '', hypothesis: '', risk: '', advantage: '' });
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Idea Engine</h1>
                <p className="page-description">Log, refine, and stress-test your startup ideas.</p>
            </header>

            <div className="grid-2">
                <div className="card animate-fade-in-up">
                    <h2 className="card-title">Add New Idea</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Idea Name *</label>
                            <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <input name="category" className="form-input" placeholder="e.g. SaaS, Marketplace..." value={form.category} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                                <option>Seed</option>
                                <option>Exploring</option>
                                <option>Active</option>
                                <option>Paused</option>
                                <option>Dead</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Short Description</label>
                            <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Core Hypothesis</label>
                            <textarea name="hypothesis" className="form-textarea" placeholder="If we build X, then Y will happen..." value={form.hypothesis} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-danger font-bold">Riskiest Assumption *</label>
                            <textarea
                                name="risk"
                                className="form-textarea"
                                style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                placeholder="What single thing, if false, kills this idea?"
                                value={form.risk}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label font-bold" style={{ color: 'var(--brand-primary-hover)' }}>Unfair Advantage *</label>
                            <textarea
                                name="advantage"
                                className="form-textarea"
                                style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}
                                placeholder="What is your moat? Why can't someone bigger just copy you?"
                                value={form.advantage}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Submit Idea</button>
                    </form>
                </div>

                <div className="flex-col gap-6">
                    <h2 className="card-title">Recent Ideas</h2>
                    {ideas.length === 0 ? <p className="text-secondary text-sm">No ideas logged yet. Start ideating!</p> : null}
                    <div className="flex-col gap-4 stagger-children">
                        {ideas.slice(0, 8).map(idea => (
                            <div
                                key={idea.id}
                                className="card p-5 animate-fade-in-up"
                                style={{
                                    borderColor: idea.status === 'Active' ? 'rgba(16, 185, 129, 0.3)' : idea.status === 'Dead' ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-color)',
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{idea.name}</h3>
                                    <span className={`badge ${idea.status === 'Active' ? 'badge-green' : idea.status === 'Dead' ? 'badge-red' : idea.status === 'Paused' ? 'badge-yellow' : 'badge-gray'}`}>{idea.status}</span>
                                </div>
                                {idea.description && <p className="text-sm text-secondary mb-3">{idea.description}</p>}
                                <div className="grid-2 mt-3">
                                    <div className="p-3 rounded text-sm" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                                        <span className="text-danger text-xs font-bold uppercase tracking-wider block mb-1">Risk</span>
                                        <span className="text-secondary">{idea.risk || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 rounded text-sm" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                                        <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--brand-primary-hover)' }}>Advantage</span>
                                        <span className="text-secondary">{idea.advantage || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
