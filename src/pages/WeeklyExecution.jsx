import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

export function WeeklyExecution() {
    const [reviews, setReviews] = useState([]);
    const [form, setForm] = useState({
        bottleneck: '',
        experiments: '',
        whatWorked: '',
        whatFailed: '',
        focus: ''
    });

    const [warning, setWarning] = useState(null);

    useEffect(() => {
        const data = loadData();
        if (data.weekly && Array.isArray(data.weekly)) setReviews(data.weekly);

        // Check auto-highlight from GrowthOS
        if (data.growth && data.growth.metrics) {
            const { retention, acquisition } = data.growth.metrics;
            if (retention > 0 && acquisition > 0 && retention < 20) {
                setWarning('Retention is critically low relative to benchmarks. Fix the leaky bucket before scaling acquisition.');
            } else if (retention < acquisition * 0.1) {
                setWarning('Retention is disproportionately lower than acquisition. Stop acquiring and fix the product value loop.');
            }
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.focus || !form.bottleneck) return;

        const newReview = {
            ...form,
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0]
        };

        const updated = [newReview, ...reviews];
        setReviews(updated);

        const data = loadData();
        data.weekly = updated;
        saveData(data);

        setForm({ bottleneck: '', experiments: '', whatWorked: '', whatFailed: '', focus: '' });
    };

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Weekly Execution</h1>
                <p className="page-description">Hold yourself accountable. Cadence is everything.</p>
            </header>

            {warning && (
                <div
                    className="card mb-6 animate-fade-in-up"
                    style={{
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        borderLeftWidth: 3,
                        background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(239, 68, 68, 0.04) 100%)',
                    }}
                >
                    <h2 className="text-danger flex items-center gap-2 font-bold uppercase tracking-widest text-sm mb-2">
                        ⚠️ Automated Growth Alert
                    </h2>
                    <p className="text-sm font-medium">{warning}</p>
                </div>
            )}

            <div className="grid-2">
                <div className="card animate-fade-in-up">
                    <h2 className="card-title">Weekly Review</h2>
                    <form onSubmit={handleSubmit} className="flex-col gap-4">
                        <div className="form-group">
                            <label className="form-label text-danger font-bold">1. Biggest Bottleneck Right Now *</label>
                            <textarea
                                name="bottleneck"
                                className="form-textarea"
                                style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                placeholder="What is the #1 thing slowing growth?"
                                value={form.bottleneck}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">2. Last Week's Experiments</label>
                            <textarea name="experiments" className="form-textarea" placeholder="What did we test?" value={form.experiments} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-success">3. What Worked?</label>
                            <textarea name="whatWorked" className="form-textarea" placeholder="Double down on this..." value={form.whatWorked} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-warning">4. What Failed?</label>
                            <textarea name="whatFailed" className="form-textarea" placeholder="Kill this immediately..." value={form.whatFailed} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label font-bold" style={{ color: 'var(--brand-primary-hover)' }}>5. Next Week's Primary Focus *</label>
                            <textarea
                                name="focus"
                                className="form-textarea"
                                style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}
                                placeholder="The single most important lever..."
                                value={form.focus}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Log Weekly Review</button>
                    </form>
                </div>

                <div className="flex-col gap-6">
                    <h2 className="card-title">Execution History</h2>
                    {reviews.length === 0 ? <p className="text-secondary text-sm">No reviews yet. Start your engine.</p> : null}
                    <div className="flex-col gap-4 stagger-children">
                        {reviews.map((r) => (
                            <div key={r.id} className="card animate-fade-in-up p-5">
                                <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '1px dashed var(--border-color)' }}>
                                    <span className="font-bold text-lg">{r.date}</span>
                                </div>
                                <div className="flex-col gap-3">
                                    <div>
                                        <span className="text-xs text-danger font-bold uppercase tracking-wider block mb-1">Bottleneck</span>
                                        <p className="text-sm p-2 rounded" style={{ background: 'var(--bg-surface-elevated)' }}>{r.bottleneck}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-secondary uppercase tracking-wider block mb-1">Experiments</span>
                                        <p className="text-sm italic text-secondary pl-2" style={{ borderLeft: '2px solid var(--border-color)' }}>{r.experiments || 'None'}</p>
                                    </div>
                                    <div className="grid-2">
                                        <div className="p-3 rounded" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                                            <span className="text-xs text-success font-bold uppercase tracking-wider block mb-1">Worked</span>
                                            <p className="text-sm text-secondary">{r.whatWorked || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 rounded" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                                            <span className="text-xs text-warning font-bold uppercase tracking-wider block mb-1">Failed</span>
                                            <p className="text-sm text-secondary">{r.whatFailed || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded mt-2" style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                                        <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--brand-primary-hover)' }}>Primary Focus</span>
                                        <p className="text-sm font-medium">{r.focus}</p>
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
