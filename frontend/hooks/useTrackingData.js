import { useState, useEffect, useCallback } from 'react';
import { equipmentApi, historyApi } from '../services/api';

const REFRESH_INTERVAL = 5000;

export default function useTrackingData() {
    const [equipment, setEquipment] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [eqData, histData] = await Promise.all([
                equipmentApi.getAll(search),
                historyApi.getAll(50),
            ]);
            setEquipment(eqData);
            setHistory(histData);
        } catch (err) {
            console.error('Failed to fetch tracking data:', err);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchData]);

    return { equipment, history, loading, search, setSearch, refetch: fetchData };
}
