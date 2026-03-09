export default function MovementHistory({ history }) {
    if (history.length === 0) {
        return (
            <div className="tracking-history">
                <h3 className="tracking-panel-title">📜 Movement History</h3>
                <p className="tracking-history__empty">No movement events yet. The simulator will start generating events shortly.</p>
            </div>
        );
    }

    return (
        <div className="tracking-history">
            <h3 className="tracking-panel-title">📜 Movement History</h3>
            <div className="tracking-history__list">
                {history.map((ev, i) => {
                    const time = new Date(ev.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                    return (
                        <div className="tracking-history__item" key={ev._id || i}>
                            <span className="tracking-history__time">{time}</span>
                            <span className="tracking-history__device">{ev.device_id}</span>
                            <span className="tracking-history__arrow">
                                <span className="tracking-history__from">{ev.previous_location}</span>
                                &nbsp;→&nbsp;
                                <span className="tracking-history__to">{ev.new_location}</span>
                            </span>
                            {ev.signal_strength && (
                                <span className="tracking-history__signal">{ev.signal_strength} dBm</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
