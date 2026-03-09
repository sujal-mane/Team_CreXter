import { equipmentApi } from '../../services/api';

const STATUS_STYLES = {
    'Available':   { bg: '#10b98122', color: '#10b981', label: 'Available' },
    'In Use':      { bg: '#f59e0b22', color: '#f59e0b', label: 'In Use' },
    'Maintenance': { bg: '#ef444422', color: '#ef4444', label: 'Maintenance' },
};

const NEXT_STATUS = {
    'Available': 'In Use',
    'In Use': 'Available',
    'Maintenance': 'Available',
};

export default function EquipmentTable({ equipment, onRefresh }) {
    const handleToggle = async (deviceId, currentStatus) => {
        try {
            await equipmentApi.toggleStatus(deviceId, NEXT_STATUS[currentStatus]);
            onRefresh();
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    return (
        <div className="tracking-table-wrap">
            <h3 className="tracking-panel-title">📋 Equipment Inventory</h3>
            <div className="tracking-table-scroll">
                <table className="tracking-table">
                    <thead>
                        <tr>
                            <th>Device ID</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Battery</th>
                            <th>Last Updated</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipment.map(eq => {
                            const st = STATUS_STYLES[eq.status] || STATUS_STYLES['Available'];
                            const lowBat = eq.battery_level < 20;
                            return (
                                <tr key={eq.device_id}>
                                    <td className="tracking-table__id">{eq.device_id}</td>
                                    <td>{eq.equipment_type}</td>
                                    <td>{eq.location}</td>
                                    <td>
                                        <span className="tracking-status-badge" style={{ background: st.bg, color: st.color }}>
                                            {st.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="tracking-battery">
                                            <div className="tracking-battery__bar">
                                                <div
                                                    className="tracking-battery__fill"
                                                    style={{
                                                        width: `${eq.battery_level}%`,
                                                        background: lowBat ? '#ef4444' : eq.battery_level < 50 ? '#f59e0b' : '#10b981',
                                                    }}
                                                />
                                            </div>
                                            <span className={lowBat ? 'tracking-battery--low' : ''}>{eq.battery_level}%</span>
                                        </div>
                                    </td>
                                    <td className="tracking-table__time">
                                        {new Date(eq.last_updated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </td>
                                    <td>
                                        <button
                                            className="tracking-toggle-btn"
                                            onClick={() => handleToggle(eq.device_id, eq.status)}
                                        >
                                            → {NEXT_STATUS[eq.status]}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
