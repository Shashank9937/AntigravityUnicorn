import React, { useState, useEffect, useMemo } from 'react';
import { loadData } from '../utils/storage';

export function IdeaLog() {
    const [ideas, setIdeas] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const data = loadData();
        if (data.ideasList && Array.isArray(data.ideasList)) {
            setIdeas(data.ideasList);
        }
    }, []);

    const filtered = useMemo(() => {
        if (filter === 'All') return ideas;
        return ideas.filter(i => i.status === filter);
    }, [ideas, filter]);

    const statusOptions = ['All', 'Seed', 'Exploring', 'Active', 'Paused', 'Dead'];

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Idea Log</h1>
                <p className="page-description">Historical record of all ideas. Pattern-match against your own thinking.</p>
            </header>

            <div className="card animate-fade-in-up mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                    {statusOptions.map(s => (
                        <button
                            key={s}
                            className={`btn ${filter === s ? 'btn-primary' : 'btn-secondary'} text-sm`}
                            onClick={() => setFilter(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <span className="text-sm text-secondary font-bold">{filtered.length} idea{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {filtered.length === 0 ? (
                <div className="card text-center py-12 animate-fade-in-up">
                    <p className="text-secondary">No ideas found. <a href="/idea-engine" className="font-semibold" style={{ color: 'var(--brand-primary-hover)' }}>Start ideating →</a></p>
                </div>
            ) : (
                <div className="card animate-fade-in-up overflow-x-auto">
                    <table>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th className="text-xs text-secondary uppercase tracking-wider font-bold py-3 px-4">Name</th>
                                <th className="text-xs text-secondary uppercase tracking-wider font-bold py-3 px-4">Category</th>
                                <th className="text-xs text-secondary uppercase tracking-wider font-bold py-3 px-4">Status</th>
                                <th className="text-xs text-secondary uppercase tracking-wider font-bold py-3 px-4">Riskiest Assumption</th>
                                <th className="text-xs text-secondary uppercase tracking-wider font-bold py-3 px-4">Unfair Advantage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((idea, i) => (
                                <tr
                                    key={idea.id || i}
                                    className="animate-fade-in-up"
                                    style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        animationDelay: `${i * 30}ms`,
                                    }}
                                >
                                    <td className="py-3 px-4 font-bold">{idea.name || 'Untitled'}</td>
                                    <td className="py-3 px-4 text-sm text-secondary">{idea.category || '—'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`badge ${idea.status === 'Active' ? 'badge-green' :
                                            idea.status === 'Dead' ? 'badge-red' :
                                                idea.status === 'Paused' ? 'badge-yellow' : 'badge-gray'
                                            }`}>{idea.status || 'Seed'}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-secondary" style={{ maxWidth: 250 }}>{idea.risk || '—'}</td>
                                    <td className="py-3 px-4 text-sm text-secondary" style={{ maxWidth: 250 }}>{idea.advantage || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
