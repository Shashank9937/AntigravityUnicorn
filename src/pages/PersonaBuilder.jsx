import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

export function PersonaBuilder() {
    const [persona, setPersona] = useState({
        name: '', age: '', location: '', job: '', income: '',
        workflow: '', primaryPain: '', secondaryPain: '', alternatives: '',
        budget: '', objections: '', findThem: '',
        antiPersona: ''
    });

    useEffect(() => {
        const data = loadData();
        if (data.persona && Object.keys(data.persona).length > 0) {
            setPersona(data.persona);
        }
    }, []);

    const handleChange = (e) => {
        const updated = { ...persona, [e.target.name]: e.target.value };
        setPersona(updated);

        const data = loadData();
        data.persona = updated;
        saveData(data);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Persona Builder</h1>
                <p className="page-description">Get hyper-specific on who feels the pain the most.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="card-title">Demographics & Psychographics</h2>
                    <div className="grid-2">
                        <div className="form-group flex-col">
                            <label className="form-label">Persona Name</label>
                            <input name="name" className="form-input" value={persona.name} onChange={handleChange} />
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label">Age</label>
                            <input name="age" className="form-input" value={persona.age} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="grid-2">
                        <div className="form-group flex-col">
                            <label className="form-label">Location</label>
                            <input name="location" className="form-input" value={persona.location} onChange={handleChange} />
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label">Job Title</label>
                            <input name="job" className="form-input" value={persona.job} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group flex-col">
                        <label className="form-label">Income / Rev Tier</label>
                        <input name="income" className="form-input" value={persona.income} onChange={handleChange} />
                    </div>
                    <div className="form-group flex-col">
                        <label className="form-label">Daily Workflow (Context)</label>
                        <textarea name="workflow" className="form-textarea" placeholder="Describe their typical day..." value={persona.workflow} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex-col gap-6">
                    <div className="card">
                        <h2 className="card-title">Pain & Alternative</h2>
                        <div className="form-group flex-col">
                            <label className="form-label text-danger font-bold">Primary Pain *</label>
                            <input name="primaryPain" className="form-input border-danger" value={persona.primaryPain} onChange={handleChange} />
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label">Secondary Pain</label>
                            <input name="secondaryPain" className="form-input" value={persona.secondaryPain} onChange={handleChange} />
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label">Current Alternatives</label>
                            <input name="alternatives" className="form-input" placeholder="What hack are they using today?" value={persona.alternatives} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="card-title">Go-to-Market</h2>
                        <div className="grid-2">
                            <div className="form-group flex-col">
                                <label className="form-label">Budget Range</label>
                                <input name="budget" className="form-input" value={persona.budget} onChange={handleChange} />
                            </div>
                            <div className="form-group flex-col">
                                <label className="form-label">Where to find them?</label>
                                <input name="findThem" className="form-input" placeholder="e.g. Reddit r/SaaS" value={persona.findThem} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label">Common Objections</label>
                            <input name="objections" className="form-input" value={persona.objections} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-warning">
                <h2 className="card-title">Anti-Persona</h2>
                <div className="form-group flex-col">
                    <label className="form-label text-warning font-bold">Who are we explicitly NOT building for?</label>
                    <textarea
                        name="antiPersona"
                        className="form-textarea border-warning"
                        placeholder="e.g. Enterprise companies that demand on-premise deployments..."
                        value={persona.antiPersona}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
}
