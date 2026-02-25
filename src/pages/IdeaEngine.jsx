import React, { useState, useEffect } from 'react';
import { loadData, updateModule } from '../utils/storage';

export function IdeaEngine() {
    const [ideas, setIdeas] = useState([]);

    const [form, setForm] = useState({
        name: '',
        category: '',
        description: '',
        hypothesis: '',
        riskiestAssumption: '',
        unfairAdvantage: '',
        status: 'Seed'
    });

    useEffect(() => {
        const data = loadData();
        setIdeas(data.ideasList || []);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.riskiestAssumption || !form.unfairAdvantage || !form.name) {
            alert("Name, Riskiest Assumption, and Why Me (Unfair Advantage) are mandatory.");
            return;
        }

        const newIdea = { ...form, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
        const updated = [...ideas, newIdea];
        setIdeas(updated);

        // Save to storage
        const data = loadData();
        data.ideasList = updated;
        localStorage.setItem('unicorn_builder_os_data', JSON.stringify(data));

        setForm({
            name: '',
            category: '',
            description: '',
            hypothesis: '',
            riskiestAssumption: '',
            unfairAdvantage: '',
            status: 'Seed'
        });
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Idea Engine</h1>
                <p className="page-description">Log, refine, and stress-test your startup ideas.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="card-title">Add New Idea</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Idea Name *</label>
                            <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <input name="category" placeholder="e.g. SaaS, Marketplace..." className="form-input" value={form.category} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                                <option>Seed</option>
                                <option>Exploring</option>
                                <option>Active</option>
                                <option>Paused</option>
                                <option>Dropped</option>
                                <option>Revisit</option>
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
                            <label className="form-label text-danger">Riskiest Assumption *</label>
                            <textarea name="riskiestAssumption" className="form-textarea border-danger" placeholder="What must be true for this to work?" value={form.riskiestAssumption} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-success">Why Me? (Unfair Advantage) *</label>
                            <textarea name="unfairAdvantage" className="form-textarea border-success" placeholder="Why are you uniquely positioned to win?" value={form.unfairAdvantage} onChange={handleChange} required />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" className="btn btn-secondary" onClick={() => alert("AI Refinement Placeholder")}>✨ AI Refine</button>
                            <button type="submit" className="btn btn-primary">Save Idea</button>
                        </div>
                    </form>
                </div>

                <div>
                    <h2 className="card-title">Recent Ideas</h2>
                    <div className="flex-col gap-4">
                        {ideas.length === 0 ? <p className="text-secondary">No ideas logged yet. Start ideating!</p> : null}
                        {ideas.map(idea => (
                            <div key={idea.id} className="card">
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-bold">{idea.name}</h3>
                                    <span className="badge badge-gray">{idea.status}</span>
                                </div>
                                <p className="text-sm text-secondary mb-2">{idea.description}</p>
                                <p className="text-xs text-danger font-medium">⚠️ {idea.riskiestAssumption}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
