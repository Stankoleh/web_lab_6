import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import EditUserPage from './pages/EditUserPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage.jsx';
import PlaylistFormPage from './pages/PlaylistFormPage.jsx';
import PlaylistsPage from './pages/PlaylistsPage.jsx';
import UserDetailsPage from './pages/UserDetailsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import { clearStoredAuth, getStoredAuth, saveStoredAuth } from './utils/auth.js';

function App() {
    const [auth, setAuth] = useState(getStoredAuth());
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const handleExpiredAuth = (event) => {
            clearStoredAuth();
            setAuth(null);
            setNotifications([{ id: Date.now(), title: 'Session expired', message: event.detail || 'Please login again.' }]);
        };

        window.addEventListener('auth-expired', handleExpiredAuth);
        return () => window.removeEventListener('auth-expired', handleExpiredAuth);
    }, []);

    const pushNotification = useCallback((title, message) => {
        setNotifications((current) => [{ id: Date.now() + Math.random(), title, message }, ...current].slice(0, 5));
    }, []);

    const handleLogin = (nextAuth) => {
        saveStoredAuth(nextAuth);
        setAuth(nextAuth);
        pushNotification('Login', `Welcome, ${nextAuth.user.username}`);
    };

    const handleLogout = () => {
        clearStoredAuth();
        setAuth(null);
        setNotifications([]);
    };

    const protectedLayout = useMemo(() => (
        <Layout auth={auth} onLogout={handleLogout} notifications={notifications}>
            <Routes>
                <Route path="/users" element={<UsersPage auth={auth} notify={pushNotification} />} />
                <Route path="/users/:id" element={<UserDetailsPage />} />
                <Route path="/users/:id/edit" element={<EditUserPage notify={pushNotification} />} />
                <Route path="/playlists" element={<PlaylistsPage notify={pushNotification} />} />
                <Route path="/playlists/new" element={<PlaylistFormPage notify={pushNotification} />} />
                <Route path="/playlists/:id" element={<PlaylistDetailsPage auth={auth} notify={pushNotification} />} />
                <Route path="/playlists/:id/edit" element={<PlaylistFormPage notify={pushNotification} />} />
                <Route path="*" element={<Navigate to="/playlists" replace />} />
            </Routes>
        </Layout>
    ), [auth, notifications, pushNotification]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route
                path="/*"
                element={(
                    <ProtectedRoute isAllowed={Boolean(auth)}>
                        {protectedLayout}
                    </ProtectedRoute>
                )}
            />
        </Routes>
    );
}

export default App;
