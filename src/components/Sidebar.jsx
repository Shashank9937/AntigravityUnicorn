import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Lightbulb,
    Radar,
    FlaskConical,
    Castle,
    Coins,
    Users,
    Map,
    TrendingUp,
    Briefcase,
    Scale,
    HandCoins,
    ListTodo,
    LayoutDashboard,
    CalendarCheck,
    Rocket,
    Presentation,
    AlertTriangle,
    Zap,
    Sun,
    Moon
} from 'lucide-react';

const MENU_SECTIONS = [
    {
        title: 'Command',
        items: [
            { path: '/mission-control', label: 'Mission Control', icon: Zap },
            { path: '/weekly-execution', label: 'Daily Execution', icon: CalendarCheck }
        ]
    },
    {
        title: 'Lab',
        items: [
            { path: '/idea-engine', label: 'Idea Engine', icon: Lightbulb },
            { path: '/persona-builder', label: 'Buyer Brain', icon: Users },
            { path: '/validation-sprint', label: 'Validation Sprint', icon: FlaskConical },
            { path: '/opportunity-radar', label: 'Opportunity Radar', icon: Radar }
        ]
    },
    {
        title: 'Market',
        items: [
            { path: '/moat-builder', label: 'Moat Builder', icon: Castle },
            { path: '/monetisation-lab', label: 'Revenue Models', icon: Coins },
            { path: '/competitor-map', label: 'Competitor Map', icon: Map }
        ]
    },
    {
        title: 'Radar',
        items: [
            { path: '/kpi-dashboard', label: 'ROI Metrics', icon: LayoutDashboard },
            { path: '/risk-alerts', label: 'Risk Alerts', icon: AlertTriangle }
        ]
    },
    {
        title: 'Execution',
        items: [
            { path: '/idea-log', label: 'Idea Log', icon: ListTodo },
            { path: '/growth-os', label: 'Growth OS', icon: TrendingUp },
            { path: '/hiring', label: 'Hiring & Team', icon: Briefcase },
            { path: '/legal', label: 'Legal Setup', icon: Scale },
            { path: '/fundraising', label: 'Fundraising', icon: HandCoins },
            { path: '/launch-playbook', label: 'Launch Playbook', icon: Rocket },
            { path: '/pitch-deck', label: 'Pitch Deck', icon: Presentation }
        ]
    }
];

export function Sidebar({ isOpen, theme, onToggleTheme }) {
    const isLight = theme === 'light';

    return (
        <aside
            className={`sidebar ${isOpen ? 'open' : ''}`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="sidebar-header">
                <span className="logo-icon" aria-hidden="true">🦄</span>
                <span>Command Centre</span>
            </div>

            <nav className="sidebar-nav">
                {MENU_SECTIONS.map((section, idx) => (
                    <div key={idx}>
                        <div className="sidebar-section-title">
                            {section.title}
                        </div>
                        {section.items.map(({ path, label, icon: Icon }) => (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <Icon size={18} strokeWidth={1.8} />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Theme Toggle */}
            <div className="theme-toggle-wrapper">
                <span className="theme-toggle-label">
                    {isLight ? <Sun size={14} /> : <Moon size={14} />}
                    {isLight ? 'Light' : 'Dark'}
                </span>
                <label className="theme-toggle" id="theme-toggle" aria-label="Toggle light and dark mode">
                    <input
                        type="checkbox"
                        checked={isLight}
                        onChange={onToggleTheme}
                    />
                    <span className="toggle-thumb">
                        {isLight ? <Sun size={10} /> : <Moon size={10} />}
                    </span>
                    <span className="toggle-track" />
                </label>
            </div>

            <div
                style={{
                    padding: 'var(--space-3) var(--space-5) var(--space-4)',
                    flexShrink: 0,
                }}
            >
                <p
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                        lineHeight: 1.4,
                    }}
                >
                    AntigravityUnicorn v1.0
                </p>
            </div>
        </aside>
    );
}
