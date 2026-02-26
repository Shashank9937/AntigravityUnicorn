import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const LAUNCH_PLATFORMS = [
    { key: 'ph', name: 'Product Hunt', target: 'Top 5 Product of the Day', audience: 'Early Adopters, Investors, Makers' },
    { key: 'hn', name: 'Hacker News', target: 'Front Page', audience: 'Engineers, Technical Founders' },
    { key: 'x', name: 'X (Twitter)', target: '100k+ Impressions', audience: 'Venture Capital, Tech Ecosystem' },
    { key: 'linkedin', name: 'LinkedIn', target: 'Viral post among 2nd degree', audience: 'B2B Buyers, Enterprise' },
    { key: 'betalist', name: 'BetaList', target: '500+ Signups', audience: 'Hobbyists, Early Testers' }
];

export function LaunchPlaybook() {
    const [playbook, setPlaybook] = useState({
        status: {},
        assets: { video: false, makers: false, copy: false, cta: false, screenshots: false },
        notes: ''
    });

    useEffect(() => {
        const data = loadData();
        if (data.launch && Object.keys(data.launch).length > 0) {
            setPlaybook(data.launch);
        }
    }, []);

    const handleAssetChange = (k, v) => {
        const updated = { ...playbook, assets: { ...playbook.assets, [k]: v } };
        setPlaybook(updated);

        const data = loadData();
        data.launch = updated;
        saveData(data);
        toast.success('Strategy asset updated');
    };

    const handleStatusChange = (k, v) => {
        const updated = { ...playbook, status: { ...playbook.status, [k]: v } };
        setPlaybook(updated);

        const data = loadData();
        data.launch = updated;
        saveData(data);
        if (v === 'Launched') {
            toast.success(`🚀 Deployed to ${LAUNCH_PLATFORMS.find(p => p.key === k)?.name}!`);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <header className="page-header">
                <h1 className="page-title">Launch Playbook</h1>
                <p className="page-description">Distribution is king. Coordinate your initial velocity and compound it.</p>
            </header>

            <div className="grid-2">
                <div className="flex-col gap-6">
                    <div className="card animate-fade-in-up">
                        <h2 className="card-title">Pre-Launch Asset Factory</h2>
                        <div className="flex-col gap-3">
                            {[
                                { k: 'video', label: 'High-Conversion Demo Video (<2 min)' },
                                { k: 'copy', label: 'Traction-Optimized Headlines & Copywriting' },
                                { k: 'screenshots', label: 'Eye-catching UI Teasers / Screenshots' },
                                { k: 'makers', label: 'Maker Comment & Backstory Prepared' },
                                { k: 'cta', label: 'Frictionless Sign-up & Onboarding Flow' }
                            ].map(asset => (
                                <label
                                    key={asset.k}
                                    className="flex items-center gap-3 p-3 rounded border cursor-pointer"
                                    style={{
                                        background: playbook.assets[asset.k] ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface-elevated)',
                                        borderColor: playbook.assets[asset.k] ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)',
                                        color: playbook.assets[asset.k] ? '#34d399' : 'var(--text-primary)',
                                        transition: 'all var(--duration-base) ease',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={playbook.assets[asset.k] || false}
                                        onChange={(e) => handleAssetChange(asset.k, e.target.checked)}
                                    />
                                    <span className="font-medium text-sm">{asset.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="card animate-fade-in-up">
                        <h2 className="card-title">Strategic Launch Notes</h2>
                        <textarea
                            className="form-textarea w-full"
                            style={{ height: 128 }}
                            placeholder="Hunt angles, key influencers to DM, specific timing/timezone tactics..."
                            value={playbook.notes}
                            onChange={(e) => {
                                const updated = { ...playbook, notes: e.target.value };
                                setPlaybook(updated);
                                const data = loadData();
                                data.launch = updated;
                                saveData(data);
                            }}
                            onBlur={() => toast('Draft saved', { icon: '📝' })}
                        />
                    </div>
                </div>

                <div className="card animate-fade-in-up">
                    <h2 className="card-title mb-6">Distribution Channels</h2>
                    <div className="flex-col gap-4 stagger-children">
                        {LAUNCH_PLATFORMS.map(platform => (
                            <motion.div
                                key={platform.key}
                                className="p-4 rounded border animate-fade-in-up"
                                style={{
                                    borderColor: playbook.status[platform.key] === 'Launched' ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-color)',
                                    background: playbook.status[platform.key] === 'Launched' ? 'rgba(99, 102, 241, 0.04)' : 'var(--bg-surface-elevated)',
                                }}
                                layout
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold">{platform.name}</h3>
                                        <p className="text-secondary text-xs mt-1">Target: {platform.target}</p>
                                        <p className="text-secondary text-xs italic mt-1 pb-1">Audience: {platform.audience}</p>
                                    </div>
                                    <select
                                        className="form-select text-sm"
                                        style={{ width: 120 }}
                                        value={playbook.status[platform.key] || 'Drafting'}
                                        onChange={(e) => handleStatusChange(platform.key, e.target.value)}
                                    >
                                        <option>Drafting</option>
                                        <option>Scheduled</option>
                                        <option>Launched</option>
                                        <option>Skipped</option>
                                    </select>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
