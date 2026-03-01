// Centralized API service – all backend communication lives here
// Base URL auto-detected from Vite proxy (relative paths → proxied to :5000)

const API_BASE = '/api';

function getToken() {
    const token = sessionStorage.getItem('token');
    console.log("Auth token:", token);
    return token;
}

function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handleResponse(res) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function apiLogin(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
}

export async function apiRegister(email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
}

export async function apiHeartbeat() {
    const res = await fetch(`${API_BASE}/auth/heartbeat`, { headers: authHeaders() });
    return handleResponse(res);
}

// ─── Contexts ─────────────────────────────────────────────────────────────────
export async function apiGetContexts() {
    const res = await fetch(`${API_BASE}/contexts`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiGetContext(id) {
    const res = await fetch(`${API_BASE}/contexts/${id}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiCreateContext(name, icon, tag) {
    const res = await fetch(`${API_BASE}/contexts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, icon: icon || '⚡', tag: tag || 'Active' }),
    });
    return handleResponse(res);
}

export async function apiDeleteContext(id) {
    const res = await fetch(`${API_BASE}/contexts/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// ─── Notes ────────────────────────────────────────────────────────────────────
export async function apiGetNotes(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/notes`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiCreateNote(contextId, title, content) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/notes`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title, content }),
    });
    return handleResponse(res);
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
export async function apiGetTasks(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/tasks`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiCreateTask(contextId, title, content) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/tasks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title, content }),
    });
    return handleResponse(res);
}

export async function apiUpdateTask(contextId, taskId, updates) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(updates),
    });
    return handleResponse(res);
}

// ─── Files ────────────────────────────────────────────────────────────────────
export async function apiGetFiles(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/files`, { headers: authHeaders() });
    return handleResponse(res);
}

// ─── Members ──────────────────────────────────────────────────────────────────
export async function apiGetMembers(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/members`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiGetPendingRequests(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/pending-requests`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiInviteMember(contextId, email, role = 'viewer') {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/members`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email, targetRole: role }),
    });
    return handleResponse(res);
}



// ─── Activity ─────────────────────────────────────────────────────────────────
export async function apiGetActivityStats(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/activity-stats`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiGetActivity(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/activity`, { headers: authHeaders() });
    return handleResponse(res);
}

// ─── Member Requests ──────────────────────────────────────────────────────────
export async function apiApproveRequest(requestId) {
    const res = await fetch(`${API_BASE}/member-requests/${requestId}/approve`, {
        method: 'POST',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function apiRejectRequest(requestId) {
    const res = await fetch(`${API_BASE}/member-requests/${requestId}/reject`, {
        method: 'POST',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function apiTransferHost(contextId, targetUserId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/members/transfer-host`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ targetUserId }),
    });
    return handleResponse(res);
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function apiGetNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiMarkNotificationRead(notificationId) {
    const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// ─── Smart Search ─────────────────────────────────────────────────────────────
export async function apiSearch(query, type = 'all') {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&type=${type}`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export async function apiGetDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`, { headers: authHeaders() });
    return handleResponse(res);
}

// ─── Intelligence ─────────────────────────────────────────────────────────────
export async function apiGetIntelligence(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/intelligence`, { headers: authHeaders() });
    return handleResponse(res);
}

// ─── Graph ────────────────────────────────────────────────────────────────────
export async function apiGetGraph(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/graph`, { headers: authHeaders() });
    return handleResponse(res);
}

// ─── Notes CRUD extensions ────────────────────────────────────────────────────
export async function apiUpdateNote(contextId, noteId, updates) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/notes/${noteId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(updates),
    });
    return handleResponse(res);
}

export async function apiDeleteNote(contextId, noteId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/notes/${noteId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// ─── Tasks CRUD extensions ────────────────────────────────────────────────────
export async function apiDeleteTask(contextId, taskId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// ─── Files CRUD ───────────────────────────────────────────────────────────────
export async function apiCreateFile(contextId, name, size) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/files`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, size }),
    });
    return handleResponse(res);
}

export async function apiDeleteFile(contextId, fileId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/files/${fileId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// ─── Deadlines CRUD ───────────────────────────────────────────────────────────
export async function apiGetDeadlines(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/deadlines`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiCreateDeadline(contextId, title, dueAt) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/deadlines`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title, due_at: dueAt }),
    });
    return handleResponse(res);
}

export async function apiDeleteDeadline(contextId, deadlineId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/deadlines/${deadlineId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// ─── Tags ───────────────────────────────────────────────────────────────────
export async function apiGetTags(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/tags`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiCreateTag(contextId, name) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/tags`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name }),
    });
    return handleResponse(res);
}

export async function apiAttachTag(contextId, itemId, itemType, tagId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/items/${itemId}/tags`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ item_type: itemType, tag_id: tagId }),
    });
    return handleResponse(res);
}

export async function apiRemoveTag(contextId, itemId, itemType, tagId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/items/${itemId}/tags/${tagId}`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ item_type: itemType }),
    });
    return handleResponse(res);
}

// ─── Chat ───────────────────────────────────────────────────────────────────
export async function apiGetMessages(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/messages`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function apiCreateMessage(contextId, content) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/messages`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content }),
    });
    return handleResponse(res);
}

// ─── Structure Stats ───────────────────────────────────────────────────────
export async function apiGetStructureStats(contextId) {
    const res = await fetch(`${API_BASE}/contexts/${contextId}/structure-stats`, { headers: authHeaders() });
    return handleResponse(res);
}
