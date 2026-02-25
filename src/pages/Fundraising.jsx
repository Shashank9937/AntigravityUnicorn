import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

export function Fundraising() {
    const [data, setData] = useState({
        details: { round: 'Pre-Seed', amount: '', valuation: '', runway: '', useOfFunds: '', milestone: '' },
        investors: []
    });

    const [invForm, setInvForm] = useState({ name: '', stage: '', status: 'Contacted' });

    useEffect(() => {
        const stored = loadData();
        if (stored.fundraising && stored.fundraising.details) {
            setData(stored.fundraising);
        }
    }, []);

    const handleDetailsChange = (e) => {
        const updated = { ...data, details: { ...data.details, [e.target.name]: e.target.value } };
        setData(updated);

        const stored = loadData();
        stored.fundraising = updated;
        saveData(stored);
    };

    const handleInvChange = (e) => {
        setInvForm({ ...invForm, [e.target.name]: e.target.value });
    };

    const addInvestor = (e) => {
        e.preventDefault();
        if (!invForm.name) return;
        const inv = { ...invForm, id: Date.now().toString() };
        const updated = { ...data, investors: [...data.investors, inv] };
        setData(updated);

        const stored = loadData();
        stored.fundraising = updated;
        saveData(stored);

        setInvForm({ name: '', stage: '', status: 'Contacted' });
    };

    const removeInvestor = (id) => {
        const updated = { ...data, investors: data.investors.filter(i => i.id !== id) };
        setData(updated);
        const stored = loadData();
        stored.fundraising = updated;
        saveData(stored);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Fundraising</h1>
                <p className="page-description">Runway is life. Plan the round. Track the funnel.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 className="card-title">Round Details</h2>
                    <div className="grid-2">
                        <div className="form-group flex-col">
                            <label className="form-label">Round Type</label>
                            <select name="round" className="form-select" value={data.details.round} onChange={handleDetailsChange}>
                                <option>Pre-Seed</option>
                                <option>Seed</option>
                                <option>Series A</option>
                                <option>Bridge</option>
                            </select>
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label">Amount Raising ($)</label>
                            <input name="amount" className="form-input" value={data.details.amount} onChange={handleDetailsChange} />
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label">Post-Money Valuation</label>
                            <input name="valuation" className="form-input" value={data.details.valuation} onChange={handleDetailsChange} />
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label text-warning font-bold">New Runway (Months) *</label>
                            <input name="runway" type="number" className="form-input focus:border-warning" placeholder="Must be 18-24+" value={data.details.runway} onChange={handleDetailsChange} />
                        </div>
                    </div>
                    <div className="form-group flex-col mt-4">
                        <label className="form-label">Use of Funds (%)</label>
                        <input name="useOfFunds" className="form-input" placeholder="e.g. 60% Eng, 30% GTM, 10% Ops" value={data.details.useOfFunds} onChange={handleDetailsChange} />
                    </div>
                    <div className="form-group flex-col">
                        <label className="form-label text-success font-bold">Milestone Achieved by Next Round *</label>
                        <textarea name="milestone" className="form-textarea border-success" placeholder="e.g. $1M ARR with 120% NRR..." value={data.details.milestone} onChange={handleDetailsChange} />
                    </div>
                </div>

                <div className="card">
                    <h2 className="card-title mb-6">Investor Funnel</h2>
                    <form className="mb-6 bg-surface-elevated p-4 rounded" onSubmit={addInvestor}>
                        <div className="grid-2">
                            <div className="form-group flex-col">
                                <label className="form-label">Investor Name</label>
                                <input name="name" className="form-input" value={invForm.name} onChange={handleInvChange} required />
                            </div>
                            <div className="form-group flex-col">
                                <label className="form-label">Firm/Stage</label>
                                <input name="stage" className="form-input" placeholder="e.g. YC, Seed" value={invForm.stage} onChange={handleInvChange} />
                            </div>
                        </div>
                        <div className="form-group flex-col">
                            <label className="form-label">Pipeline Status</label>
                            <select name="status" className="form-select" value={invForm.status} onChange={handleInvChange}>
                                <option>Contacted</option>
                                <option>Meeting</option>
                                <option>Partner Meeting</option>
                                <option>Term Sheet</option>
                                <option>Closed</option>
                                <option>Passed</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Log Interaction</button>
                    </form>

                    <h3 className="text-secondary uppercase text-xs font-bold tracking-widest mb-3">Active Tracker</h3>
                    {data.investors.length === 0 ? <p className="text-sm text-secondary">No investors tracked.</p> : null}
                    <div className="flex-col gap-3">
                        {data.investors.map(inv => (
                            <div key={inv.id} className={`p-4 rounded border flex justify-between items-center group
                ${inv.status === 'Closed' ? 'border-success bg-brand-success bg-opacity-10' :
                                    inv.status === 'Passed' ? 'border-danger opacity-50' : 'border-color bg-surface-elevated'}`}
                            >
                                <div>
                                    <h4 className="font-bold mb-1">{inv.name}</h4>
                                    <p className="text-xs text-secondary tracking-wide">{inv.stage}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`badge ${inv.status === 'Closed' ? 'badge-green' :
                                            inv.status === 'Term Sheet' ? 'badge-blue' :
                                                inv.status === 'Passed' ? 'badge-red' : 'badge-yellow'
                                        }`}>{inv.status}</span>
                                    <button className="text-danger text-xs hover:underline opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeInvestor(inv.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
