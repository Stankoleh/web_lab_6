import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPlaylist, getPlaylist, updatePlaylist } from '../services/api.js';

function PlaylistFormPage({ notify }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({ name: '', description: '', isPublic: true });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        const loadPlaylist = async () => {
            try {
                const playlist = await getPlaylist(id);
                setForm({ name: playlist.name, description: playlist.description, isPublic: playlist.isPublic });
            } catch (apiError) {
                setError(apiError.message);
            }
        };
        loadPlaylist();
    }, [id, isEdit]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            if (isEdit) {
                await updatePlaylist(id, form);
                notify?.('Playlist updated', form.name);
            } else {
                await createPlaylist(form);
                notify?.('Playlist created', form.name);
            }
            navigate('/playlists');
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    return (
        <div className="form-layout">
            <section className="card card--wide">
                <p className="eyebrow">Playlist editor</p>
                <h1>{isEdit ? 'Edit playlist' : 'Create playlist'}</h1>
                {error ? <p className="error">{error}</p> : null}
                <form onSubmit={handleSubmit}>
                    <div className="form-field"><label htmlFor="playlist-name">name</label><input id="playlist-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div>
                    <div className="form-field"><label htmlFor="playlist-description">description</label><textarea id="playlist-description" rows="5" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
                    <div className="form-field"><label htmlFor="playlist-visibility">visibility</label><select id="playlist-visibility" value={form.isPublic ? 'public' : 'private'} onChange={(event) => setForm({ ...form, isPublic: event.target.value === 'public' })}><option value="public">public</option><option value="private">private</option></select></div>
                    <button className="button button--large" type="submit">save playlist</button>
                </form>
            </section>
        </div>
    );
}

export default PlaylistFormPage;
