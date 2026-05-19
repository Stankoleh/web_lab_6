import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser, deleteUser, getUsers } from '../services/api.js';
import { isAdmin } from '../utils/auth.js';

function UsersPage({ auth, notify }) {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({ username: '', password: '', role: 'regular' });

    const loadUsers = async () => {
        try { setUsers(await getUsers()); } catch (apiError) { setError(apiError.message); }
    };

    useEffect(() => { loadUsers(); }, []);

    const filteredUsers = useMemo(() => users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase())), [users, query]);

    const handleCreate = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const payload = { ...form, username: form.username.trim().replace(/\s+/g, '_') };
            await createUser(payload);
            notify?.('User created', payload.username);
            setForm({ username: '', password: '', role: 'regular' });
            loadUsers();
        } catch (apiError) { setError(apiError.message); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            notify?.('User deleted', 'Account was removed.');
            loadUsers();
        } catch (apiError) { setError(apiError.message); }
    };

    return (
        <div>
            <section className="hero hero--compact">
                <div>
                    <p className="eyebrow">Administration</p>
                    <h1>Users listing</h1>
                    <p className="hero-text">Login/logout, role checking, user filtering and CRUD actions.</p>
                </div>
                <Link className="button" to="/playlists">Go to playlists</Link>
            </section>
            {error ? <div className="notification error">{error}</div> : null}
            <div className="grid grid--two">
                <div className="card">
                    <div className="toolbar toolbar--inner"><h2>Users</h2><input className="search" placeholder="Filter user..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
                    <table className="table">
                        <thead><tr><th>username</th><th>role</th><th>actions</th></tr></thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td><span className="badge badge--private">{user.role}</span></td>
                                    <td><div className="button-row">
                                        <button className="button button--secondary button--small" type="button" onClick={() => navigate(`/users/${user.id}`)}>view</button>
                                        <button className="button button--small" type="button" onClick={() => navigate(`/users/${user.id}/edit`)}>edit</button>
                                        {isAdmin(auth) ? <button className="button button--danger button--small" type="button" onClick={() => handleDelete(user.id)}>delete</button> : null}
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="card">
                    <h2>Create user</h2>
                    {isAdmin(auth) ? (
                        <form onSubmit={handleCreate}>
                            <div className="form-field"><label htmlFor="new-username">username</label><input id="new-username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required /></div>
                            <div className="form-field"><label htmlFor="new-password">password</label><input id="new-password" value={form.password} type="password" onChange={(event) => setForm({ ...form, password: event.target.value })} required /></div>
                            <div className="form-field"><label htmlFor="new-role">role</label><select id="new-role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="admin">admin</option><option value="regular">regular</option></select></div>
                            <button className="button button--large" type="submit">create</button>
                        </form>
                    ) : <p className="small">Only admin can create users.</p>}
                </div>
            </div>
        </div>
    );
}

export default UsersPage;
