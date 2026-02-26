import React, { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SLIDES = [
    { id: 'purpose', title: 'Company Purpose', desc: 'Single declarative sentence. What do you do?' },
    { id: 'problem', title: 'The Problem', desc: 'Describe the pain of the customer. How is this addressed today?' },
    { id: 'solution', title: 'The Solution', desc: "Show, don't just tell. Demonstrate your value proposition." },
    { id: 'why_now', title: 'Why Now?', desc: 'Historical category evolution. Recent trends making your solution possible.' },
    { id: 'market', title: 'Market Size', desc: 'Identify your target customer. Calculate the TAM (Top Down & Bottom Up).' },
    { id: 'competition', title: 'Competition', desc: 'The 2x2 grid. Show why you are 10x better or completely differentiated.' },
    { id: 'product', title: 'Product', desc: 'Product line-up (form factor, functionality, IP, architecture).' },
    { id: 'business_model', title: 'Business Model', desc: 'Pricing, Account Size, LTV/CAC, distribution model.' },
    { id: 'team', title: 'Team', desc: 'Why are you the *only* team to build this? Unfair advantages.' },
    { id: 'financials', title: 'Financials', desc: 'P&L, Unit Economics, Burn, and the Ask.' }
];

export function PitchDeck() {
    const [deck, setDeck] = useState(
        SLIDES.reduce((acc, s) => ({ ...acc, [s.id]: { status: 'Not Started', notes: '' } }), {})
    );

    useEffect(() => {
        const data = loadData();
        if (data.pitchDeck && Object.keys(data.pitchDeck).length > 0) {
            setDeck(data.pitchDeck);
        }
    }, []);

    const handleUpdate = (id, field, value) => {
        const updated = {
            ...deck,
            [id]: { ...deck[id], [field]: value }
        };
        setDeck(updated);

        const data = loadData();
        data.pitchDeck = updated;
        saveData(data);

        if (field === 'status' && value === 'Done') {
            toast.success(`Slide Approved: ${SLIDES.find(s => s.id === id).title}`);
        }
    };

    const completed = Object.values(deck).filter(d => d.status === 'Done').length;
    const progress = Math.round((completed / SLIDES.length) * 100);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <header className="page-header">
                <h1 className="page-title">Pitch Deck Constructor</h1>
                <p className="page-description">The Sequoia Framework. Build the narrative. Secure the capital.</p>
            </header>

            <div className="mb-6 card flex items-center justify-between" style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                <div>
                    <h2 className="text-secondary uppercase text-sm font-bold tracking-widest mb-1">Deck Readiness</h2>
                    <div className="text-3xl font-black" style={{ color: 'var(--brand-primary)' }}>{progress}%</div>
                </div>
                <div style={{ width: '50%' }}>
                    <div className="progress-bar" style={{ height: 10, border: '1px solid var(--border-color)' }}>
                        <motion.div
                            className="progress-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid-2 stagger-children">
                {SLIDES.map((slide, i) => (
                    <motion.div
                        key={slide.id}
                        className="card animate-fade-in-up flex-col gap-3"
                        style={{
                            borderColor: deck[slide.id]?.status === 'Done'
                                ? 'rgba(16, 185, 129, 0.3)'
                                : 'var(--border-color)',
                            background: deck[slide.id]?.status === 'Done'
                                ? 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(16, 185, 129, 0.03) 100%)'
                                : 'var(--bg-surface)',
                        }}
                        layout
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg"><span className="text-secondary text-sm mr-2">{i + 1}.</span>{slide.title}</h3>
                            <select
                                className="form-select text-xs py-1"
                                style={{
                                    width: 120,
                                    color: deck[slide.id]?.status === 'Done' ? '#34d399' : deck[slide.id]?.status === 'Drafting' ? '#fbbf24' : 'var(--text-secondary)',
                                }}
                                value={deck[slide.id]?.status}
                                onChange={(e) => handleUpdate(slide.id, 'status', e.target.value)}
                            >
                                <option>Not Started</option>
                                <option>Drafting</option>
                                <option>Reviewing</option>
                                <option>Done</option>
                            </select>
                        </div>
                        <p className="text-sm text-secondary italic pl-2" style={{ borderLeft: '2px solid var(--brand-primary)' }}>{slide.desc}</p>
                        <textarea
                            className="form-textarea mt-2 text-sm"
                            placeholder="Draft your talking points or slide copy here..."
                            value={deck[slide.id]?.notes || ''}
                            onChange={(e) => handleUpdate(slide.id, 'notes', e.target.value)}
                            onBlur={() => toast('Draft auto-saved', { icon: '💾' })}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
