import React, { useState, useEffect, useMemo } from 'react';
import { loadData } from '../utils/storage';
import { NavLink } from 'react-router-dom';
import {
  Lightbulb,
  FlaskConical,
  Radar,
  TrendingUp,
  HandCoins,
  Scale,
  CalendarCheck,
  Rocket,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

const AARRR_METRICS = [
  { key: 'acquisition', label: 'Acquisition (Traffic)', target: 1000 },
  { key: 'activation', label: 'Activation (Signups %)', target: 20 },
  { key: 'retention', label: 'Retention (W1 Active %)', target: 40 },
  { key: 'revenue', label: 'Revenue (Paying %)', target: 5 },
  { key: 'referral', label: 'Referral (K-Factor)', target: 0.2 },
];

export function MissionControl() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  const intelligence = useMemo(() => {
    if (!data) return null;

    // Active idea count
    const ideas = data.ideasList?.length || 0;
    const activeIdeas = data.ideasList?.filter(i => i.status === 'Active')?.length || 0;

    // Validation progress %
    const passedWeeks = data.validation ? Object.values(data.validation).filter(w => w.passed).length : 0;
    const validationProgress = (passedWeeks / 4) * 100;

    // Moat strength score
    const moatScore = data.moat?.confidence || 0;

    // Legal completion %
    const legalDone = data.legal ? Object.values(data.legal).filter(v => v === true).length : 0;
    const legalProgress = (legalDone / 8) * 100;

    // Current bottleneck from AARRR
    let bottleneck = 'None';
    if (data.growth && data.growth.metrics) {
      const calculateHealth = (key, val) => {
        const target = AARRR_METRICS.find(m => m.key === key).target;
        return val / target;
      };
      const metrics = data.growth.metrics;
      const scores = Object.keys(metrics).map(k => ({ key: k, ratio: calculateHealth(k, metrics[k]) }));

      if (scores.length > 0) {
        const worst = scores.reduce((prev, curr) => (prev.ratio < curr.ratio ? prev : curr), scores[0]);
        const found = AARRR_METRICS.find(m => m.key === worst.key);
        bottleneck = found ? found.label : 'None';
      }
    }

    // Latest weekly note
    let latestNote = 'No weekly reviews logged yet.';
    if (data.weekly && data.weekly.length > 0) {
      // Assume the first one is the latest (since it's usually prepended)
      const latestInfo = data.weekly[0];
      latestNote = latestInfo.learnings || latestInfo.wins || `Week starting ${latestInfo.date}`;
    }

    // Incomplete status check
    const isSectionIncomplete = ideas === 0 || passedWeeks === 0 || legalDone < 8 || moatScore === 0;

    return {
      ideas, activeIdeas, validationProgress, moatScore, legalProgress,
      bottleneck, latestNote, legalDone, isSectionIncomplete,
      mrr: data.kpis?.current?.mrr || 0,
      runway: data.kpis?.current?.runway || 0
    };
  }, [data]);

  const quickActions = [
    { path: '/idea-engine', label: 'Log New Idea', icon: Lightbulb, color: 'var(--brand-primary)' },
    { path: '/weekly-execution', label: 'Weekly Review', icon: CalendarCheck, color: 'var(--brand-warning)' },
    { path: '/validation-sprint', label: 'Run Validation', icon: FlaskConical, color: 'var(--brand-success)' },
    { path: '/opportunity-radar', label: 'Score Opportunity', icon: Radar, color: 'var(--brand-primary)' },
    { path: '/growth-os', label: 'Growth Experiments', icon: TrendingUp, color: '#34d399' },
    { path: '/launch-playbook', label: 'Launch Playbook', icon: Rocket, color: '#f87171' },
  ];

  if (!intelligence) return null;

  return (
    <div>
      <header className="page-header flex justify-between items-start">
        <div>
          <h1 className="page-title">⚡ Mission Control</h1>
          <p className="page-description">
            Your founder dashboard. Everything at a glance.
          </p>
        </div>
        {intelligence.isSectionIncomplete && (
          <div className="badge badge-yellow flex items-center gap-1 mt-2">
            <AlertTriangle size={14} /> System Incomplete
          </div>
        )}
      </header>

      {/* DASHBOARD INTELLIGENCE LAYER */}
      <section className="dashboard-grid mb-8 stagger-children" aria-label="Key metrics">
        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Active Ideas</div>
          <div className="stat-value text-brand-primary">{intelligence.activeIdeas}</div>
          <div className="stat-hint">Out of {intelligence.ideas} total</div>
        </div>

        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Validation Progress</div>
          <div className="stat-value text-success">{intelligence.validationProgress}%</div>
          <div className="stat-hint">Sprint completion</div>
        </div>

        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Moat Strength</div>
          <div className="stat-value" style={{ color: intelligence.moatScore >= 8 ? '#34d399' : intelligence.moatScore >= 5 ? '#fbbf24' : '#f87171' }}>
            {intelligence.moatScore}<span className="text-secondary text-lg ml-1">/10</span>
          </div>
          <div className="stat-hint">{intelligence.moatScore < 5 ? 'Highly vulnerable' : 'Defensible'}</div>
        </div>

        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Legal Setup</div>
          <div className="stat-value">{intelligence.legalProgress}%</div>
          <div className="stat-hint">{intelligence.legalDone}/8 compliance items</div>
        </div>

        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Core Bottleneck (AARRR)</div>
          <div className="stat-value text-warning text-lg leading-tight mt-1">{intelligence.bottleneck}</div>
          <div className="stat-hint mt-1">Focus engineering here</div>
        </div>

        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Runway</div>
          <div className="stat-value" style={{ color: intelligence.runway < 6 ? '#f87171' : '#34d399' }}>
            {intelligence.runway}<span className="text-secondary text-lg ml-1">mo</span>
          </div>
          <div className="stat-hint">{intelligence.runway < 6 ? 'Critical — act now' : 'Healthy buffer'}</div>
        </div>
      </section>

      {/* Latest Weekly Note display */}
      <section className="mb-8 card animate-fade-in-up" style={{
        borderColor: 'rgba(245, 158, 11, 0.2)',
        background: 'var(--bg-surface-elevated)',
      }}>
        <h2 className="text-sm uppercase font-bold tracking-widest text-warning mb-2 flex items-center gap-2">
          <CalendarCheck size={16} /> Latest Weekly Note
        </h2>
        <p className="text-secondary italic">"{intelligence.latestNote}"</p>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <h2 className="text-lg font-bold mb-4" style={{ letterSpacing: '-0.01em' }}>Quick Actions</h2>
        <div className="grid-3 stagger-children">
          {quickActions.map(action => (
            <NavLink
              key={action.path}
              to={action.path}
              className="card animate-fade-in-up"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all var(--duration-base) ease',
              }}
              id={`quick-action-${action.path.slice(1)}`}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: `${action.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <span className="font-semibold text-sm">{action.label}</span>
              </div>
              <ArrowRight size={16} className="text-secondary" style={{ opacity: 0.4 }} />
            </NavLink>
          ))}
        </div>
      </section>

      {/* Founder Philosophy */}
      <section
        className="card mt-8 animate-fade-in-up"
        style={{
          borderColor: 'rgba(99, 102, 241, 0.15)',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(99, 102, 241, 0.03) 100%)',
        }}
      >
        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-3">
          Daily Reminder
        </h3>
        <blockquote
          className="text-lg font-medium"
          style={{
            lineHeight: 1.6,
            borderLeft: '3px solid var(--brand-primary)',
            paddingLeft: 'var(--space-5)',
            color: 'var(--text-primary)',
            opacity: 0.9,
          }}
        >
          "The only metric that matters is: are you making something people want?
          Everything else is noise."
        </blockquote>
        <p className="text-xs text-tertiary mt-3" style={{ color: 'var(--text-tertiary)' }}>
          — Paul Graham, Y Combinator
        </p>
      </section>
    </div>
  );
}
