import { Activity, Package, CheckCircle, Wifi } from 'lucide-react';

export default function StatsCards({ equipment }) {
    const total = equipment.length;
    const available = equipment.filter(e => e.status === 'Available').length;
    const inUse = equipment.filter(e => e.status === 'In Use').length;
    const lowBattery = equipment.filter(e => e.battery_level < 20).length;

    const cards = [
        { label: 'Total Equipment', value: total, icon: Package, color: '#6366f1' },
        { label: 'Available', value: available, icon: CheckCircle, color: '#10b981' },
        { label: 'In Use', value: inUse, icon: Activity, color: '#f59e0b' },
        { label: 'Low Battery', value: lowBattery, icon: Wifi, color: lowBattery > 0 ? '#ef4444' : '#10b981' },
    ];

    return (
        <div className="tracking-stats">
            {cards.map(c => (
                <div className="tracking-stat-card" key={c.label}>
                    <div className="tracking-stat-card__icon" style={{ background: c.color + '22', color: c.color }}>
                        <c.icon size={22} />
                    </div>
                    <div className="tracking-stat-card__info">
                        <span className="tracking-stat-card__value">{c.value}</span>
                        <span className="tracking-stat-card__label">{c.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
