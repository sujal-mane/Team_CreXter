import { useState } from 'react';
import { LayoutDashboard, Package, Clock, Search, Radio } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'equipment', label: 'Equipment', icon: Package },
    { id: 'history',   label: 'Movement History', icon: Clock },
];

export default function TrackingSidebar({ active, onNavigate }) {
    return (
        <aside className="tracking-sidebar">
            <div className="tracking-sidebar__brand">
                <Radio size={22} className="tracking-sidebar__brand-icon" />
                <span>Asset Tracker</span>
            </div>
            <nav className="tracking-sidebar__nav">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        className={`tracking-sidebar__link ${active === item.id ? 'tracking-sidebar__link--active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="tracking-sidebar__footer">
                <div className="tracking-sidebar__pulse" />
                <span>Simulation Active</span>
            </div>
        </aside>
    );
}
