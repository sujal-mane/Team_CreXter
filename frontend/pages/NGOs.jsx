import { useEffect, useState } from 'react';
import { donorApi } from '../services/api';
import { organDonations } from '../data/mockData';
import {
    Users, Clock, CheckCircle, XCircle, Eye, Filter,
    Calendar, MapPin, Phone, Mail, Droplets, Heart
} from 'lucide-react';
import './NGOs.css';

const organName = (id) => organDonations.find(o => o.id === id)?.organ || `#${id}`;
const organIcon = (id) => organDonations.find(o => o.id === id)?.icon || '🫀';

const statusColors = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
};

export default function NGOs() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [approvalForm, setApprovalForm] = useState({
        donationDate: '', donationTime: '', hospital: '', doctor: ''
    });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchDonors = async () => {
        try {
            const data = await donorApi.getAll();
            setDonors(data);
        } catch (err) {
            console.error('Failed to fetch donors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDonors(); }, []);

    const filtered = donors.filter(d =>
        activeTab === 'all' ? true : d.status === activeTab
    );

    const counts = {
        all: donors.length,
        pending: donors.filter(d => d.status === 'pending').length,
        approved: donors.filter(d => d.status === 'approved').length,
        rejected: donors.filter(d => d.status === 'rejected').length,
    };

    const handleApprove = (donor) => {
        setSelectedDonor(donor);
        setApprovalForm({ donationDate: '', donationTime: '', hospital: '', doctor: '' });
        setShowApprovalModal(true);
    };

    const submitApproval = async () => {
        if (!approvalForm.donationDate || !approvalForm.hospital || !approvalForm.doctor) return;
        setActionLoading(true);
        try {
            await donorApi.updateStatus(selectedDonor._id, 'approved', approvalForm);
            setShowApprovalModal(false);
            setSelectedDonor(null);
            await fetchDonors();
        } catch (err) {
            console.error('Approval failed:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (donor) => {
        if (!window.confirm(`Reject donation from ${donor.fullName}?`)) return;
        setActionLoading(true);
        try {
            await donorApi.updateStatus(donor._id, 'rejected');
            await fetchDonors();
        } catch (err) {
            console.error('Rejection failed:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const tabs = ['all', 'pending', 'approved', 'rejected'];

    if (loading) {
        return (
            <main className="ngo-page">
                <div className="ngo-dash-loading">
                    <div className="ngo-dash-spinner" />
                    <p>Loading donor registrations...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="ngo-page">
            <div className="ngo-dash">
                {/* Header */}
                <div className="ngo-dash__header">
                    <div>
                        <h1 className="ngo-dash__title">NGO Dashboard</h1>
                        <p className="ngo-dash__subtitle">Manage and review donor registrations</p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="ngo-dash__stats">
                    <div className="ngo-stat-card ngo-stat-card--total">
                        <Users size={24} />
                        <div>
                            <span className="ngo-stat-card__num">{counts.all}</span>
                            <span className="ngo-stat-card__label">Total Donors</span>
                        </div>
                    </div>
                    <div className="ngo-stat-card ngo-stat-card--pending">
                        <Clock size={24} />
                        <div>
                            <span className="ngo-stat-card__num">{counts.pending}</span>
                            <span className="ngo-stat-card__label">Pending</span>
                        </div>
                    </div>
                    <div className="ngo-stat-card ngo-stat-card--approved">
                        <CheckCircle size={24} />
                        <div>
                            <span className="ngo-stat-card__num">{counts.approved}</span>
                            <span className="ngo-stat-card__label">Approved</span>
                        </div>
                    </div>
                    <div className="ngo-stat-card ngo-stat-card--rejected">
                        <XCircle size={24} />
                        <div>
                            <span className="ngo-stat-card__num">{counts.rejected}</span>
                            <span className="ngo-stat-card__label">Rejected</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="ngo-dash__tabs">
                    <Filter size={16} />
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`ngo-dash__tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className="ngo-dash__tab-count">{counts[tab]}</span>
                        </button>
                    ))}
                </div>

                {/* Donor List */}
                {filtered.length === 0 ? (
                    <div className="ngo-dash__empty">
                        <Heart size={48} />
                        <p>No {activeTab === 'all' ? '' : activeTab} donor registrations found.</p>
                    </div>
                ) : (
                    <div className="ngo-dash__list">
                        {filtered.map(donor => (
                            <div key={donor._id} className={`ngo-donor-card ngo-donor-card--${donor.status}`}>
                                <div className="ngo-donor-card__header">
                                    <div className="ngo-donor-card__avatar">
                                        {donor.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ngo-donor-card__info">
                                        <h3 className="ngo-donor-card__name">{donor.fullName}</h3>
                                        <span
                                            className="ngo-donor-card__status"
                                            style={{ background: statusColors[donor.status] + '22', color: statusColors[donor.status] }}
                                        >
                                            {donor.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="ngo-donor-card__details">
                                    <div className="ngo-donor-card__detail">
                                        <Mail size={14} /> {donor.email}
                                    </div>
                                    <div className="ngo-donor-card__detail">
                                        <Phone size={14} /> {donor.phone}
                                    </div>
                                    <div className="ngo-donor-card__detail">
                                        <Droplets size={14} /> Blood: {donor.bloodGroup}
                                    </div>
                                    <div className="ngo-donor-card__detail">
                                        <MapPin size={14} /> {donor.city}{donor.state ? `, ${donor.state}` : ''}
                                    </div>
                                    <div className="ngo-donor-card__detail">
                                        <Calendar size={14} /> {new Date(donor.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {donor.organs?.length > 0 && (
                                    <div className="ngo-donor-card__organs">
                                        <span className="ngo-donor-card__organs-label">Organs Pledged:</span>
                                        <div className="ngo-donor-card__organ-tags">
                                            {donor.organs.map(id => (
                                                <span key={id} className="ngo-organ-tag">
                                                    {organIcon(id)} {organName(id)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {donor.donationType && (
                                    <div className="ngo-donor-card__type">
                                        Donation Type: <strong>{donor.donationType}</strong>
                                    </div>
                                )}

                                {/* Approval details if approved */}
                                {donor.status === 'approved' && donor.approvalDetails && (
                                    <div className="ngo-donor-card__approval">
                                        <h4>Approval Details</h4>
                                        <p>🏥 {donor.approvalDetails.hospital}</p>
                                        <p>👨‍⚕️ Dr. {donor.approvalDetails.doctor}</p>
                                        <p>📅 {donor.approvalDetails.donationDate} at {donor.approvalDetails.donationTime}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {donor.status === 'pending' && (
                                    <div className="ngo-donor-card__actions">
                                        <button
                                            className="ngo-btn ngo-btn--approve"
                                            onClick={() => handleApprove(donor)}
                                            disabled={actionLoading}
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            className="ngo-btn ngo-btn--reject"
                                            onClick={() => handleReject(donor)}
                                            disabled={actionLoading}
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Approval Modal */}
            {showApprovalModal && selectedDonor && (
                <div className="ngo-modal-overlay" onClick={() => setShowApprovalModal(false)}>
                    <div className="ngo-modal" onClick={e => e.stopPropagation()}>
                        <h2 className="ngo-modal__title">Approve Donor</h2>
                        <p className="ngo-modal__subtitle">
                            Approving donation from <strong>{selectedDonor.fullName}</strong>
                        </p>

                        <div className="ngo-modal__form">
                            <label className="ngo-modal__label">
                                Hospital *
                                <input
                                    type="text"
                                    className="ngo-modal__input"
                                    placeholder="Enter hospital name"
                                    value={approvalForm.hospital}
                                    onChange={e => setApprovalForm(p => ({ ...p, hospital: e.target.value }))}
                                />
                            </label>
                            <label className="ngo-modal__label">
                                Doctor Name *
                                <input
                                    type="text"
                                    className="ngo-modal__input"
                                    placeholder="Enter doctor name"
                                    value={approvalForm.doctor}
                                    onChange={e => setApprovalForm(p => ({ ...p, doctor: e.target.value }))}
                                />
                            </label>
                            <label className="ngo-modal__label">
                                Donation Date *
                                <input
                                    type="date"
                                    className="ngo-modal__input"
                                    value={approvalForm.donationDate}
                                    onChange={e => setApprovalForm(p => ({ ...p, donationDate: e.target.value }))}
                                />
                            </label>
                            <label className="ngo-modal__label">
                                Donation Time
                                <input
                                    type="time"
                                    className="ngo-modal__input"
                                    value={approvalForm.donationTime}
                                    onChange={e => setApprovalForm(p => ({ ...p, donationTime: e.target.value }))}
                                />
                            </label>
                        </div>

                        <div className="ngo-modal__actions">
                            <button
                                className="ngo-btn ngo-btn--cancel"
                                onClick={() => setShowApprovalModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="ngo-btn ngo-btn--confirm"
                                onClick={submitApproval}
                                disabled={actionLoading || !approvalForm.hospital || !approvalForm.doctor || !approvalForm.donationDate}
                            >
                                {actionLoading ? 'Approving...' : 'Confirm Approval'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
