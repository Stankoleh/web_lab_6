const getApiUrl = () => {
    const configured = import.meta.env.VITE_API_URL;
    if (configured) return configured.replace(/\/$/, '');

    const host = window.location.hostname || 'localhost';
    return `http://${host}:3001/api`;
};

const API_URL = getApiUrl();
const AUTH_KEY = 'playlist-auth';

const clearBadAuth = () => {
    localStorage.removeItem(AUTH_KEY);
};

const normalizeError = (data) => {
    if (!data) return 'Request failed';
    if (data.message) return data.message;
    if (data.detail) return data.detail;
    if (typeof data === 'string') return data;
    return Object.entries(data).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
};

const readAuth = () => {
    try {
        const rawAuth = localStorage.getItem(AUTH_KEY);
        return rawAuth ? JSON.parse(rawAuth) : null;
    } catch {
        clearBadAuth();
        return null;
    }
};

const request = async (path, options = {}) => {
    const auth = readAuth();
    const headers = { 'Content-Type': 'application/json', ...options.headers };

    if (auth?.token) headers.Authorization = `Token ${auth.token}`;

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = normalizeError(data);

        if (response.status === 401 && /token|credentials|authentication/i.test(message)) {
            clearBadAuth();
            if (!window.location.pathname.includes('/login')) {
                window.dispatchEvent(new CustomEvent('auth-expired', { detail: message }));
            }
        }

        throw new Error(message);
    }
    if (response.status === 204) return null;
    return response.json();
};

export const login = (payload) => request('/login/', { method: 'POST', body: JSON.stringify(payload) });
export const getUsers = () => request('/users/');
export const getUser = (id) => request(`/users/${id}/`);
export const createUser = (payload) => request('/users/', { method: 'POST', body: JSON.stringify(payload) });
export const updateUser = (id, payload) => request(`/users/${id}/`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteUser = (id) => request(`/users/${id}/`, { method: 'DELETE' });
export const getPlaylists = () => request('/playlists/');
export const getPlaylist = (id) => request(`/playlists/${id}/`);
export const createPlaylist = (payload) => request('/playlists/', { method: 'POST', body: JSON.stringify(payload) });
export const updatePlaylist = (id, payload) => request(`/playlists/${id}/`, { method: 'PUT', body: JSON.stringify(payload) });
export const deletePlaylist = (id) => request(`/playlists/${id}/`, { method: 'DELETE' });
export const addTrack = (id, payload) => request(`/playlists/${id}/tracks/`, { method: 'POST', body: JSON.stringify(payload) });
export const deleteTrack = (playlistId, trackId) => request(`/playlists/${playlistId}/tracks/${trackId}/`, { method: 'DELETE' });

export const getPlaylistMessages = (id) => request(`/playlists/${id}/messages/`);
