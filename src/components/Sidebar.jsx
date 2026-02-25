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
    Presentation
} from 'lucide-react';

const MENU_ITEMS = [
    { path: '/idea-engine', label: 'Idea Engine', icon: Lightbulb },
    { path: '/opportunity-radar', label: 'Opportunity Radar', icon: Radar },
    { path: '/validation-sprint', label: 'Validation Sprint', icon: FlaskConical },
    { path: '/moat-builder', label: 'Moat Builder', icon: Castle },
    { path: '/monetisation-lab', label: 'Monetisation Lab', icon: Coins },
    { path: '/persona-builder', label: 'Persona Builder', icon: Users },
    { path: '/competitor-map', label: 'Competitor Map', icon: Map },
    { path: '/growth-os', label: 'Growth OS', icon: TrendingUp },
    { path: '/hiring', label: 'Hiring & Team', icon: Briefcase },
    { path: '/legal', label: 'Legal Setup', icon: Scale },
    { path: '/fundraising', label: 'Fundraising', icon: HandCoins },
    { path: '/idea-log', label: 'Idea Log', icon: ListTodo },
    { path: '/kpi-dashboard', label: 'KPI Dashboard', icon: LayoutDashboard },
    { path: '/weekly-execution', label: 'Weekly Execution', icon: CalendarCheck },
    { path: '/launch-playbook', label: 'Launch Playbook', icon: Rocket },
    { path: '/pitch-deck', label: 'Pitch Deck', icon: Presentation },
];

export function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                🦄 Unicorn Builder
            </div>
            <nav className="sidebar-nav">
                {MENU_ITEMS.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Icon />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
