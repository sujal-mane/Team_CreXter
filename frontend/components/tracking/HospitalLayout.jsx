const ZONE_COLORS = {
    'Emergency Room': '#ef4444',
    'ICU':            '#f59e0b',
    'Ward A':         '#10b981',
    'Ward B':         '#06b6d4',
    'Corridor':       '#8b5cf6',
    'Radiology':      '#ec4899',
};

const ZONE_ICONS = {
    'Emergency Room': '🚨',
    'ICU':            '🏥',
    'Ward A':         '🛏️',
    'Ward B':         '🛏️',
    'Corridor':       '🚶',
    'Radiology':      '📡',
};

const EQUIP_ICONS = {
    'Wheelchair':       '♿',
    'Stretcher':        '🛏️',
    'Oxygen Cylinder':  '🫁',
    'IV Stand':         '💉',
};

// SVG layout positions for each zone (x, y, w, h)
const ZONE_LAYOUT = {
    'Emergency Room': { x: 20,  y: 20,  w: 260, h: 180 },
    'ICU':            { x: 310, y: 20,  w: 260, h: 180 },
    'Ward A':         { x: 20,  y: 230, w: 260, h: 180 },
    'Ward B':         { x: 310, y: 230, w: 260, h: 180 },
    'Corridor':       { x: 600, y: 20,  w: 170, h: 180 },
    'Radiology':      { x: 600, y: 230, w: 170, h: 180 },
};

const ZONES = Object.keys(ZONE_LAYOUT);

export default function HospitalLayout({ equipment }) {
    // Group equipment by location
    const byZone = {};
    ZONES.forEach(z => { byZone[z] = []; });
    equipment.forEach(eq => {
        if (byZone[eq.location]) byZone[eq.location].push(eq);
    });

    return (
        <div className="tracking-layout">
            <h3 className="tracking-panel-title">🏥 Hospital Floor Plan — Live Equipment</h3>
            <svg viewBox="0 0 800 440" className="tracking-layout__svg">
                {/* Background */}
                <rect x="0" y="0" width="800" height="440" rx="16" fill="#0f172a" />

                {ZONES.map(zone => {
                    const { x, y, w, h } = ZONE_LAYOUT[zone];
                    const color = ZONE_COLORS[zone];
                    const items = byZone[zone];

                    return (
                        <g key={zone}>
                            {/* Zone rect */}
                            <rect x={x} y={y} width={w} height={h} rx="12"
                                fill={color + '18'} stroke={color} strokeWidth="2" />
                            {/* Zone label */}
                            <text x={x + 12} y={y + 28} fill={color} fontSize="14" fontWeight="700">
                                {ZONE_ICONS[zone]} {zone}
                            </text>
                            <text x={x + w - 12} y={y + 28} fill="#94a3b8" fontSize="11" textAnchor="end">
                                {items.length} device{items.length !== 1 ? 's' : ''}
                            </text>

                            {/* Equipment markers */}
                            {items.map((eq, idx) => {
                                const col = idx % 3;
                                const row = Math.floor(idx / 3);
                                const mx = x + 24 + col * 80;
                                const my = y + 55 + row * 55;
                                const lowBat = eq.battery_level < 20;

                                return (
                                    <g key={eq.device_id}>
                                        <rect x={mx - 8} y={my - 8} width={72} height={42} rx="8"
                                            fill="#1e293b" stroke={lowBat ? '#ef4444' : color} strokeWidth="1.5"
                                            className="tracking-marker" />
                                        <text x={mx + 28} y={my + 8} fill="#e2e8f0" fontSize="18" textAnchor="middle">
                                            {EQUIP_ICONS[eq.equipment_type] || '📦'}
                                        </text>
                                        <text x={mx + 28} y={my + 26} fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="600">
                                            {eq.device_id}
                                        </text>
                                        {lowBat && (
                                            <circle cx={mx + 58} cy={my - 2} r="5" fill="#ef4444">
                                                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
                                            </circle>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    );
                })}

                {/* Legend */}
                <text x="20" y="432" fill="#64748b" fontSize="10">
                    ● Live BLE tracking simulation — updates every 5-8 seconds
                </text>
            </svg>
        </div>
    );
}
