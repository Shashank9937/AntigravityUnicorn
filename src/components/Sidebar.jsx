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
    Zap
} from 'lucide-react';

const MENU_SECTIONS = [
    {
        title: 'COMMAND (Operations)',
        items: [
            { path: '/mission-control', label: 'Mission Control', icon: Zap },
            { path: '/weekly-execution', label: 'Daily Execution', icon: CalendarCheck }
        ]
    },
    {
        title: 'LAB (Strategy & Ideas)',
        items: [
            { path: '/idea-engine', label: 'Idea Engine', icon: Lightbulb },
            { path: '/persona-builder', label: 'Buyer Brain', icon: Users },
            { path: '/validation-sprint', label: 'Validation Sprint', icon: FlaskConical },
            { path: '/opportunity-radar', label: 'Opportunity Radar', icon: Radar }
        ]
    },
    {
        title: 'MARKET (Intelligence)',
        items: [
            { path: '/moat-builder', label: 'Moat Builder', icon: Castle },
            { path: '/monetisation-lab', label: 'Revenue Models', icon: Coins },
            { path: '/competitor-map', label: 'Competitor Map', icon: Map },
        ]
    },
    {
        title: 'RADAR (Decisions & Data)',
        items: [
            { path: '/kpi-dashboard', label: 'ROI Metrics', icon: LayoutDashboard },
            { path: '/risk-alerts', label: 'Risk Alerts', icon: AlertTriangle }
        ]
    },
    {
        title: 'LEGACY & ARCHIVE',
        items: [
            { path: '/idea-log', label: 'Idea Log', icon: ListTodo },
            { path: '/growth-os', label: 'Growth OS', icon: TrendingUp },
            { path: '/hiring', label: 'Hiring & Team', icon: Briefcase },
            { path: '/legal', label: 'Legal Setup', icon: Scale },
            { path: '/fundraising', label: 'Fundraising', icon: HandCoins },
            { path: '/launch-playbook', label: 'Launch Playbook', icon: Rocket },
            { path: '/pitch-deck', label: 'Pitch Deck', icon: Presentation },
        ]
    }
];

export function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                🦄 AI Command Center
            </div>
            <nav className="sidebar-nav" style={{ overflowY: 'auto', paddingBottom: '2rem' }}>
                {MENU_SECTIONS.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '1rem', textTransform: 'uppercase' }}>
                            {section.title}
                        </div>
                        {section.items.map(({ path, label, icon: Icon }) => (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={18} />
                                <span style={{ marginLeft: '0.5rem' }}>{label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
