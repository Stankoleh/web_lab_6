import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser } from '../services/api.js';

function EditUserPage({ notify }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '', role: 'regular' });
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getUser(id);
                setForm({ username: user.username, password: '', role: user.role });
            } catch (apiError) {
                setError(apiError.message);
            }
        };

        loadUser();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await updateUser(id, { ...form, username: form.username.trim().replace(/\s+/g, '_') });
            notify?.('User updated', form.username);
            navigate('/users');
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    return (
        <div className="card">
            <h1>edit user</h1>
            {error ? <p className="error">{error}</p> : null}
            <form onSubmit={handleSubmit}>
                <div className="form-field"><label htmlFor="username-edit">username</label><input id="username-edit" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></div>
                <div className="form-field"><label htmlFor="password-edit">new password</label><input id="password-edit" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div>
                <div className="form-field"><label htmlFor="role-edit">role</label><select id="role-edit" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="admin">admin</option><option value="regular">regular</option></select></div>
                <button className="button" type="submit">save</button>
            </form>
        </div>
    );
}

export default EditUserPage;
