import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import useTrackingData from '../../hooks/useTrackingData';
import TrackingSidebar from '../../components/tracking/TrackingSidebar';
import StatsCards from '../../components/tracking/StatsCards';
import HospitalLayout from '../../components/tracking/HospitalLayout';
import EquipmentTable from '../../components/tracking/EquipmentTable';
import MovementHistory from '../../components/tracking/MovementHistory';
import ZoneOverview from '../../components/tracking/ZoneOverview';
import './AssetTracking.css';

export default function AssetTracking() {
    const { equipment, history, loading, search, setSearch, refetch } = useTrackingData();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (loading && equipment.length === 0) {
        return (
            <div className="tracking-loading">
                <div className="tracking-loading__spinner" />
                <p>Connecting to BLE gateway...</p>
            </div>
        );
    }

    return (
        <div className="tracking-page">
            <TrackingSidebar active={activeTab} onNavigate={setActiveTab} />

            <main className="tracking-main">
                {/* Top bar */}
                <header className="tracking-topbar">
                    <div>
                        <h1 className="tracking-topbar__title">Hospital Indoor Asset Tracking</h1>
                        <p className="tracking-topbar__subtitle">
                            BLE beacon simulation — {equipment.length} devices across 6 zones
                        </p>
                    </div>
                    <div className="tracking-topbar__actions">
                        <div className="tracking-search">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search device ID..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="tracking-refresh-btn" onClick={refetch}>
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </header>

                {/* Dashboard view */}
                {activeTab === 'dashboard' && (
                    <div className="tracking-content">
                        <StatsCards equipment={equipment} />
                        <div className="tracking-grid-2">
                            <HospitalLayout equipment={equipment} />
                            <ZoneOverview equipment={equipment} />
                        </div>
                        <div className="tracking-grid-2">
                            <EquipmentTable equipment={equipment} onRefresh={refetch} />
                            <MovementHistory history={history} />
                        </div>
                    </div>
                )}

                {/* Equipment view */}
                {activeTab === 'equipment' && (
                    <div className="tracking-content">
                        <StatsCards equipment={equipment} />
                        <EquipmentTable equipment={equipment} onRefresh={refetch} />
                    </div>
                )}

                {/* History view */}
                {activeTab === 'history' && (
                    <div className="tracking-content">
                        <MovementHistory history={history} />
                    </div>
                )}
            </main>
        </div>
    );
}
