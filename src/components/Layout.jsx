import React, { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Toaster } from 'sonner';
import { Menu, X } from 'lucide-react';

const THEME_KEY = 'unicorn-os-theme';

function getInitialTheme() {
    try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
    } catch { }
    // Default to dark
    return 'dark';
}

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);
    const location = useLocation();

    // Apply theme to <html> on mount and changes
    useEffect(() => {
        const root = document.documentElement;
        // Enable transition
        root.setAttribute('data-theme-transitioning', '');
        root.setAttribute('data-theme', theme);
        // Update meta theme-color
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#f5f5f7' : '#0a0a0f');
        // Persist
        try { localStorage.setItem(THEME_KEY, theme); } catch { }
        // Remove transition class after animation
        const timer = setTimeout(() => root.removeAttribute('data-theme-transitioning'), 350);
        return () => clearTimeout(timer);
    }, [theme]);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Close sidebar on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    return (
        <div className="app-container">
            {/* Mobile menu button */}
            <button
                className="mobile-menu-btn"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
                id="mobile-menu-toggle"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar overlay for mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            <Sidebar isOpen={sidebarOpen} theme={theme} onToggleTheme={toggleTheme} />

            <main className="main-content" id="main-content" role="main">
                <Outlet />
            </main>

            <Toaster
                theme={theme}
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                    },
                }}
            />
        </div>
    );
}
