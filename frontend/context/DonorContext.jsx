import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { donorApi } from '../services/api';

const DonorContext = createContext();

export function DonorProvider({ children }) {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch donors from backend on mount
    const fetchDonors = useCallback(async () => {
        try {
            setLoading(true);
            const data = await donorApi.getAll();
            setDonors(data);
        } catch {
            console.error('Failed to fetch donors, falling back to empty list');
            setDonors([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDonors(); }, [fetchDonors]);

    const registerDonor = async (donorData) => {
        const newDonor = await donorApi.register(donorData);
        setDonors(prev => [newDonor, ...prev]);
        return newDonor;
    };

    const updateDonorStatus = async (donorId, status, approvalDetails = null) => {
        const updated = await donorApi.updateStatus(donorId, status, approvalDetails);
        setDonors(prev => prev.map(d => (d._id === donorId ? updated : d)));
        return updated;
    };

    const updateTracking = async (donorId, stageIndex, note = '') => {
        const updated = await donorApi.updateTracking(donorId, stageIndex, note);
        setDonors(prev => prev.map(d => (d._id === donorId ? updated : d)));
        return updated;
    };

    const searchDonor = async ({ email, phone }) => {
        return donorApi.search({ email, phone });
    };

    return (
        <DonorContext.Provider value={{ donors, loading, registerDonor, updateDonorStatus, updateTracking, searchDonor, refetch: fetchDonors }}>
            {children}
        </DonorContext.Provider>
    );
}

export function useDonors() {
    const ctx = useContext(DonorContext);
    if (!ctx) throw new Error('useDonors must be used within DonorProvider');
    return ctx;
}
