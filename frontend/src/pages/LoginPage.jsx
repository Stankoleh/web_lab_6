import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api.js';

function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const auth = await login({ username, password });
            onLogin(auth);
            navigate('/playlists');
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    return (
        <div className="login-page">
            <section className="login-art">
                <p className="eyebrow">Lab 6</p>
                <h1>Playlist Service</h1>
                <p>React SPA with Django REST API, user roles, playlist cards and music management.</p>
            </section>
            <div className="login-card-wrap">
                <form className="login-card" onSubmit={handleSubmit}>
                    <p className="eyebrow">Authorization</p>
                    <h1>Sign in</h1>
                    <div className="form-field"><label htmlFor="username">username</label><input id="username" value={username} onChange={(event) => setUsername(event.target.value)} /></div>
                    <div className="form-field"><label htmlFor="password">password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
                    {error ? <p className="error">{error}</p> : null}
                    <button className="button button--large" type="submit">login</button>
                    <p className="small">Demo users: admin/admin123, anna/anna123, mark/mark123</p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
