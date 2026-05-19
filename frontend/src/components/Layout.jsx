import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter.jsx';

function Layout({ auth, onLogout, notifications, children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand-card">
                    <div className="brand-icon">♪</div>
                    <div>
                        <div className="sidebar__brand">Playlist Lab 6</div>
                        <div className="sidebar__subtitle">SPA + API + Music</div>
                    </div>
                </div>
                <div className="profile-card">
                    <div className="avatar">{auth?.user?.username?.[0]?.toUpperCase() || 'U'}</div>
                    <div>
                        <strong>{auth?.user?.username}</strong>
                        <div className="small small--light">{auth?.user?.role}</div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <NavLink className="sidebar__link" to="/playlists">Playlists</NavLink>
                    <NavLink className="sidebar__link" to="/playlists/new">Create playlist</NavLink>
                    <NavLink className="sidebar__link" to="/users">Users</NavLink>
                    <button className="button button--ghost button--full" type="button" onClick={handleLogout}>Logout</button>
                </nav>
                <NotificationCenter notifications={notifications} />
            </aside>
            <main className="content">{children}</main>
        </div>
    );
}

export default Layout;
