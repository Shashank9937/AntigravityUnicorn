import React, { useState, useEffect } from 'react';
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

    const filteredIdeas = filter === 'All' ? ideas : ideas.filter(i => i.status === filter);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Idea Log</h1>
                <p className="page-description">The historical vault of hypotheses and pivots.</p>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6 border-b border-color pb-4">
                    <h2 className="card-title mb-0">Structured Log</h2>
                    <div className="flex gap-2">
                        {['All', 'Seed', 'Exploring', 'Active', 'Paused', 'Dropped', 'Revisit'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${filter === status ? 'bg-brand-primary text-white' : 'bg-surface-elevated text-secondary hover:bg-border-color'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredIdeas.length === 0 ? (
                    <div className="text-center py-12 text-secondary">
                        <p>No ideas found in this category.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-color text-secondary text-sm uppercase tracking-wider">
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Idea</th>
                                    <th className="p-3">Hypothesis</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIdeas.map((idea, idx) => (
                                    <tr key={idea.id || idx} className="border-b border-color border-opacity-50 hover:bg-surface-elevated transition-colors">
                                        <td className="p-3 text-sm text-secondary whitespace-nowrap">{idea.date || 'Unknown'}</td>
                                        <td className="p-3 font-bold text-primary">{idea.name}</td>
                                        <td className="p-3 text-sm text-secondary max-w-md truncate" title={idea.hypothesis}>{idea.hypothesis || '—'}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            <span className={`badge ${idea.status === 'Active' ? 'badge-green' :
                                                    idea.status === 'Dropped' ? 'badge-red' :
                                                        idea.status === 'Seed' || idea.status === 'Exploring' ? 'badge-blue' : 'badge-yellow'
                                                }`}>
                                                {idea.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
