const AUTH_KEY = 'playlist-auth';

export const getStoredAuth = () => {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        localStorage.removeItem(AUTH_KEY);
        return null;
    }
};

export const saveStoredAuth = (auth) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = () => {
    localStorage.removeItem(AUTH_KEY);
};

export const isAdmin = (auth) => auth?.user?.role === 'admin';
