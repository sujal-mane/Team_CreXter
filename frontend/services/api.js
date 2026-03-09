const BASE = '/api';

async function request(url, options = {}) {
    const res = await fetch(`${BASE}${url}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
}

// ── Donors ──────────────────────────────────────
export const donorApi = {
    register: (donor) => request('/donors', { method: 'POST', body: JSON.stringify(donor) }),
    getAll: () => request('/donors'),
    getById: (id) => request(`/donors/${encodeURIComponent(id)}`),
    search: ({ email, phone }) => {
        const params = new URLSearchParams();
        if (email) params.set('email', email);
        if (phone) params.set('phone', phone);
        return request(`/donors/search?${params}`);
    },
    updateStatus: (id, status, approvalDetails) =>
        request(`/donors/${encodeURIComponent(id)}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, approvalDetails }),
        }),
    updateTracking: (id, stageIndex, note) =>
        request(`/donors/${encodeURIComponent(id)}/tracking`, {
            method: 'PATCH',
            body: JSON.stringify({ stageIndex, notes: note }),
        }),
};

// ── NGOs ────────────────────────────────────────
export const ngoApi = {
    getAll: () => request('/ngos'),
    getById: (id) => request(`/ngos/${encodeURIComponent(id)}`),
};

// ── Hospitals ───────────────────────────────────
export const hospitalApi = {
    getAll: () => request('/hospitals'),
    getById: (id) => request(`/hospitals/${encodeURIComponent(id)}`),
};
