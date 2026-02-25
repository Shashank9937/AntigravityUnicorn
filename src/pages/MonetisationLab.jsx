import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const REVENUE_MODELS = [
    'Subscription', 'Usage-based', 'Freemium', 'Per seat',
    'Outcome-based', 'Marketplace', 'Service + Software', 'Licensing', 'Advertising', 'Community', 'Data insights'
];

export function MonetisationLab() {
    const [data, setData] = useState({
        models: REVENUE_MODELS.reduce((acc, curr) => ({ ...acc, [curr]: { viable: false, arpu: 0, ltv: 0, cac: 0, tier: 'Pro' } }), {})
    });

    useEffect(() => {
        const loaded = loadData();
        if (loaded.monetisation && Object.keys(loaded.monetisation).length > 0) {
            setData({ models: loaded.monetisation });
        }
    }, []);

    const handleChange = (model, field, val) => {
        const updated = {
            ...data.models,
            [model]: { ...data.models[model], [field]: val }
        };

        setData({ models: updated });

        const storageData = loadData();
        storageData.monetisation = updated;
        saveData(storageData);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Monetisation Lab</h1>
                <p className="page-description">Experiment with value capture models and unit economics.</p>
            </div>

            <div className="flex-col gap-6">
                {Object.entries(data.models).map(([modelName, modelData]) => {
                    const ratio = modelData.cac > 0 ? (modelData.ltv / modelData.cac).toFixed(1) : 0;
                    const isDanger = modelData.viable && ratio > 0 && ratio < 3;
                    const isHealthy = modelData.viable && ratio >= 3;

                    return (
                        <div key={modelName} className={`card ${modelData.viable ? 'border-brand-primary' : 'border-color'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="card-title mb-0">{modelName}</h3>
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={modelData.viable}
                                        onChange={(e) => handleChange(modelName, 'viable', e.target.checked)}
                                    />
                                    Viable Model
                                </label>
                            </div>

                            {modelData.viable && (
                                <div className="grid-4 bg-surface-elevated p-4 rounded mt-4 items-end">
                                    <div className="form-group flex-col">
                                        <label className="form-label">Tier Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={modelData.tier}
                                            onChange={(e) => handleChange(modelName, 'tier', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group flex-col">
                                        <label className="form-label">ARPU ($)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={modelData.arpu}
                                            onChange={(e) => handleChange(modelName, 'arpu', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group flex-col">
                                        <label className="form-label">LTV ($)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={modelData.ltv}
                                            onChange={(e) => handleChange(modelName, 'ltv', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group flex-col">
                                        <label className="form-label">CAC ($)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={modelData.cac}
                                            onChange={(e) => handleChange(modelName, 'cac', parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                            )}

                            {modelData.viable && modelData.cac > 0 && (
                                <div className="mt-4 flex items-center gap-4 border-t border-color pt-4">
                                    <div className="flex-col">
                                        <span className="text-secondary text-xs uppercase font-bold tracking-wide">Unit Economics</span>
                                        <div className={`text-2xl font-bold mt-1 ${isDanger ? 'text-danger' : isHealthy ? 'text-success' : ''}`}>
                                            LTV:CAC = {ratio}
                                        </div>
                                    </div>
                                    {isDanger && (
                                        <span className="badge badge-red ml-auto py-1 px-3">
                                            ⚠️ LTV/CAC &lt; 3 (Warning: Fatal Unit Economics)
                                        </span>
                                    )}
                                    {isHealthy && (
                                        <span className="badge badge-green ml-auto py-1 px-3">
                                            ✅ Compound Growth Ready
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
