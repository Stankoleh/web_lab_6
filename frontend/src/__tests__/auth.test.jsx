import { clearStoredAuth, getStoredAuth, isAdmin, saveStoredAuth } from '../utils/auth.js';

describe('auth utils', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('saves and loads auth data', () => {
        const auth = { token: '1', user: { username: 'admin', role: 'admin' } };
        saveStoredAuth(auth);
        expect(getStoredAuth()).toEqual(auth);
    });

    it('clears auth data', () => {
        saveStoredAuth({ token: '1', user: { username: 'anna', role: 'regular' } });
        clearStoredAuth();
        expect(getStoredAuth()).toBeNull();
    });

    it('detects admin user', () => {
        expect(isAdmin({ user: { role: 'admin' } })).toBe(true);
        expect(isAdmin({ user: { role: 'regular' } })).toBe(false);
    });
});
