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
  ArrowRight
} from 'lucide-react';

export function MissionControl() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const ideas = data.ideasList?.length || 0;
    const activeIdeas = data.ideasList?.filter(i => i.status === 'Active')?.length || 0;
    const competitors = data.competitors?.length || 0;
    const weeklyReviews = data.weekly?.length || 0;
    const mrr = data.kpis?.current?.mrr || 0;
    const runway = data.kpis?.current?.runway || 0;
    const legalDone = data.legal
      ? Object.values(data.legal).filter(v => v === true).length
      : 0;
    const investors = data.fundraising?.investors?.length || 0;
    return { ideas, activeIdeas, competitors, weeklyReviews, mrr, runway, legalDone, investors };
  }, [data]);

  const quickActions = [
    { path: '/idea-engine', label: 'Log New Idea', icon: Lightbulb, color: 'var(--brand-primary)' },
    { path: '/weekly-execution', label: 'Weekly Review', icon: CalendarCheck, color: 'var(--brand-warning)' },
    { path: '/validation-sprint', label: 'Run Validation', icon: FlaskConical, color: 'var(--brand-success)' },
    { path: '/opportunity-radar', label: 'Score Opportunity', icon: Radar, color: 'var(--brand-primary)' },
    { path: '/growth-os', label: 'Growth Experiments', icon: TrendingUp, color: '#34d399' },
    { path: '/launch-playbook', label: 'Launch Playbook', icon: Rocket, color: '#f87171' },
  ];

  if (!stats) return null;

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">⚡ Mission Control</h1>
        <p className="page-description">
          Your founder dashboard. Everything at a glance.
        </p>
      </header>

      {/* KPI Strip */}
      <section className="dashboard-grid mb-8 stagger-children" aria-label="Key metrics">
        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Total Ideas</div>
          <div className="stat-value text-brand-primary">{stats.ideas}</div>
          <div className="stat-hint">{stats.activeIdeas} active</div>
        </div>
        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">MRR</div>
          <div className="stat-value text-success">${stats.mrr.toLocaleString()}</div>
          <div className="stat-hint">Monthly recurring</div>
        </div>
        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Runway</div>
          <div className="stat-value" style={{ color: stats.runway < 6 ? '#f87171' : '#34d399' }}>
            {stats.runway}<span className="text-secondary text-lg ml-1">mo</span>
          </div>
          <div className="stat-hint">{stats.runway < 6 ? 'Critical — act now' : 'Healthy buffer'}</div>
        </div>
        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Competitors</div>
          <div className="stat-value">{stats.competitors}</div>
          <div className="stat-hint">Mapped in landscape</div>
        </div>
        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Weekly Reviews</div>
          <div className="stat-value">{stats.weeklyReviews}</div>
          <div className="stat-hint">Execution cadence</div>
        </div>
        <div className="stat-card animate-fade-in-up">
          <div className="stat-label">Legal</div>
          <div className="stat-value">{stats.legalDone}<span className="text-secondary text-lg">/8</span></div>
          <div className="stat-hint">Compliance items</div>
        </div>
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
