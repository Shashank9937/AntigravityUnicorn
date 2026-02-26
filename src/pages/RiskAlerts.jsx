import React, { useState, useEffect, useMemo } from 'react';
import { loadData } from '../utils/storage';
import { AlertTriangle, ShieldCheck, TrendingDown, DollarSign, Users, Scale } from 'lucide-react';

export function RiskAlerts() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  const risks = useMemo(() => {
    if (!data) return [];
    const alerts = [];

    // Runway check
    const runway = data.kpis?.current?.runway || 0;
    if (runway > 0 && runway < 6) {
      alerts.push({
        id: 'runway-critical',
        severity: 'critical',
        title: 'Runway Below 6 Months',
        description: `Current runway is ${runway} months. You need to either raise capital or drastically cut burn rate immediately.`,
        icon: DollarSign,
        action: 'Review Fundraising →',
        link: '/fundraising',
      });
    }

    // Churn check
    const churn = data.kpis?.current?.churn || 0;
    if (churn > 5) {
      alerts.push({
        id: 'churn-high',
        severity: 'warning',
        title: 'Churn Rate Exceeds 5%',
        description: `Monthly churn is at ${churn}%. Your leaky bucket will destroy growth. Fix retention before scaling acquisition.`,
        icon: TrendingDown,
        action: 'Review KPI Dashboard →',
        link: '/kpi-dashboard',
      });
    }

    // Growth check
    const growth = data.kpis?.current?.growth || 0;
    if (growth > 0 && growth < 10) {
      alerts.push({
        id: 'growth-slow',
        severity: 'warning',
        title: 'MoM Growth Below 10%',
        description: `Current growth rate is ${growth}%. Unicorn trajectory requires sustained 10%+ monthly growth.`,
        icon: TrendingDown,
        action: 'Review Growth OS →',
        link: '/growth-os',
      });
    }

    // Retention vs Acquisition from growth metrics
    if (data.growth?.metrics) {
      const { retention, acquisition } = data.growth.metrics;
      if (retention > 0 && acquisition > 0 && retention < 20) {
        alerts.push({
          id: 'retention-crisis',
          severity: 'critical',
          title: 'Retention Crisis Detected',
          description: 'Week-1 retention is critically low. Stop all acquisition spend and fix the core value proposition.',
          icon: Users,
          action: 'Review Growth OS →',
          link: '/growth-os',
        });
      }
    }

    // Legal gaps
    if (data.legal) {
      const completed = Object.values(data.legal).filter(v => v === true).length;
      if (completed < 4) {
        alerts.push({
          id: 'legal-gaps',
          severity: 'warning',
          title: 'Legal Foundation Incomplete',
          description: `Only ${completed}/8 legal items completed. Missing legal structure blocks fundraising and creates liability.`,
          icon: Scale,
          action: 'Review Legal Setup →',
          link: '/legal',
        });
      }
    }

    // No ideas
    if (!data.ideasList || data.ideasList.length === 0) {
      alerts.push({
        id: 'no-ideas',
        severity: 'info',
        title: 'No Ideas Logged',
        description: 'Start by logging your startup ideas in the Idea Engine to begin the validation process.',
        icon: AlertTriangle,
        action: 'Go to Idea Engine →',
        link: '/idea-engine',
      });
    }

    return alerts;
  }, [data]);

  if (!data) return null;

  const criticalCount = risks.filter(r => r.severity === 'critical').length;
  const warningCount = risks.filter(r => r.severity === 'warning').length;

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">🚨 Risk Alerts</h1>
        <p className="page-description">
          Automated risk detection. Identifies failing assumptions and structural weaknesses.
        </p>
      </header>

      {/* Risk summary */}
      <div className="grid-3 mb-8 stagger-children">
        <div className="stat-card animate-fade-in-up" style={{
          borderColor: criticalCount > 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)',
        }}>
          <div className="stat-label">Critical</div>
          <div className="stat-value text-danger">{criticalCount}</div>
          <div className="stat-hint">Immediate action needed</div>
        </div>
        <div className="stat-card animate-fade-in-up" style={{
          borderColor: warningCount > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-color)',
        }}>
          <div className="stat-label">Warnings</div>
          <div className="stat-value text-warning">{warningCount}</div>
          <div className="stat-hint">Monitor closely</div>
        </div>
        <div className="stat-card animate-fade-in-up" style={{
          borderColor: risks.length === 0 ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)',
        }}>
          <div className="stat-label">Status</div>
          <div className="stat-value" style={{ fontSize: 'var(--text-xl)', color: risks.length === 0 ? '#34d399' : 'var(--text-primary)' }}>
            {risks.length === 0 ? 'All Clear' : `${risks.length} Active`}
          </div>
          <div className="stat-hint">{risks.length === 0 ? 'No risks detected' : 'Resolve to continue'}</div>
        </div>
      </div>

      {/* Alert list */}
      {risks.length === 0 ? (
        <div className="card text-center py-12 animate-fade-in-up" style={{
          borderColor: 'rgba(16, 185, 129, 0.2)',
        }}>
          <ShieldCheck size={48} style={{ color: '#34d399', margin: '0 auto var(--space-4)' }} />
          <h2 className="text-xl font-bold mb-2">No Active Risks</h2>
          <p className="text-secondary text-sm">
            All systems nominal. Continue executing your plan.
          </p>
        </div>
      ) : (
        <div className="flex-col gap-4 stagger-children">
          {risks.map(risk => (
            <div
              key={risk.id}
              className="card animate-fade-in-up"
              style={{
                borderColor: risk.severity === 'critical'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : risk.severity === 'warning'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'var(--border-color)',
                borderLeftWidth: '3px',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    background: risk.severity === 'critical'
                      ? 'var(--brand-danger-muted)'
                      : risk.severity === 'warning'
                        ? 'var(--brand-warning-muted)'
                        : 'var(--brand-primary-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <risk.icon
                    size={20}
                    style={{
                      color: risk.severity === 'critical'
                        ? '#f87171'
                        : risk.severity === 'warning'
                          ? '#fbbf24'
                          : 'var(--brand-primary-hover)',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold">{risk.title}</h3>
                    <span className={`badge ${risk.severity === 'critical' ? 'badge-red' : risk.severity === 'warning' ? 'badge-yellow' : 'badge-blue'}`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-sm text-secondary mb-3" style={{ lineHeight: 1.6 }}>
                    {risk.description}
                  </p>
                  <a
                    href={risk.link}
                    className="text-sm font-semibold"
                    style={{ color: 'var(--brand-primary-hover)' }}
                  >
                    {risk.action}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
