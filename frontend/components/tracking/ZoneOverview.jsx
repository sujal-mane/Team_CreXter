const ZONES = ['Emergency Room', 'ICU', 'Ward A', 'Ward B', 'Corridor', 'Radiology'];

const ZONE_COLORS = {
    'Emergency Room': '#ef4444',
    'ICU':            '#f59e0b',
    'Ward A':         '#10b981',
    'Ward B':         '#06b6d4',
    'Corridor':       '#8b5cf6',
    'Radiology':      '#ec4899',
};

export default function ZoneOverview({ equipment }) {
    const counts = {};
    ZONES.forEach(z => { counts[z] = 0; });
    equipment.forEach(eq => {
        if (counts[eq.location] !== undefined) counts[eq.location]++;
    });

    const max = Math.max(...Object.values(counts), 1);

    return (
        <div className="tracking-zones">
            <h3 className="tracking-panel-title">🗺️ Zone Overview</h3>
            <div className="tracking-zones__grid">
                {ZONES.map(zone => {
                    const count = counts[zone];
                    const color = ZONE_COLORS[zone];
                    return (
                        <div className="tracking-zone-card" key={zone}>
                            <div className="tracking-zone-card__header">
                                <span className="tracking-zone-card__dot" style={{ background: color }} />
                                <span className="tracking-zone-card__name">{zone}</span>
                            </div>
                            <div className="tracking-zone-card__count">{count}</div>
                            <span className="tracking-zone-card__label">device{count !== 1 ? 's' : ''}</span>
                            <div className="tracking-zone-card__bar">
                                <div
                                    className="tracking-zone-card__fill"
                                    style={{ width: `${(count / max) * 100}%`, background: color }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
