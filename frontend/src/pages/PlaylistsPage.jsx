import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePlaylist, getPlaylists } from '../services/api.js';

function PlaylistsPage({ notify }) {
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [tab, setTab] = useState('all');
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    const loadPlaylists = async () => {
        try {
            setPlaylists(await getPlaylists());
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    useEffect(() => { loadPlaylists(); }, []);

    const filteredPlaylists = useMemo(() => playlists.filter((playlist) => {
        const visibilityOk = tab === 'all' || (tab === 'public' ? playlist.isPublic : !playlist.isPublic);
        const query = search.trim().toLowerCase();
        const searchOk = !query || playlist.name.toLowerCase().includes(query) || playlist.description.toLowerCase().includes(query);
        return visibilityOk && searchOk;
    }), [playlists, tab, search]);

    const totalTracks = playlists.reduce((sum, playlist) => sum + playlist.tracks.length, 0);

    const handleDelete = async (id) => {
        try {
            await deletePlaylist(id);
            notify?.('Playlist deleted', 'Playlist was removed from the library.');
            loadPlaylists();
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    return (
        <div>
            <section className="hero">
                <div>
                    <p className="eyebrow">Music management</p>
                    <h1>Playlist dashboard</h1>
                    <p className="hero-text">Create playlists, filter them, open details and add tracks directly to every playlist.</p>
                </div>
                <button className="button button--large" type="button" onClick={() => navigate('/playlists/new')}>+ New playlist</button>
            </section>

            <div className="stats-grid">
                <div className="stat-card"><span>{playlists.length}</span><p>playlists</p></div>
                <div className="stat-card"><span>{totalTracks}</span><p>tracks</p></div>
                <div className="stat-card"><span>{playlists.filter((p) => p.isPublic).length}</span><p>public</p></div>
            </div>

            {error ? <div className="notification error">{error}</div> : null}

            <div className="toolbar glass">
                <div className="tabs">
                    {['all', 'public', 'private'].map((item) => (
                        <button className={`tab ${tab === item ? 'tab--active' : ''}`} key={item} type="button" onClick={() => setTab(item)}>{item}</button>
                    ))}
                </div>
                <input className="search" placeholder="Search playlist..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>

            <div className="playlist-grid">
                {filteredPlaylists.map((playlist, index) => (
                    <article className="playlist-card" key={playlist.id}>
                        <div className="cover">{index % 2 === 0 ? '♫' : '♪'}</div>
                        <div className="playlist-card__body">
                            <div className="playlist-card__top">
                                <h2>{playlist.name}</h2>
                                <span className={`badge ${playlist.isPublic ? 'badge--public' : 'badge--private'}`}>
                                    {playlist.isPublic ? 'public' : 'private'}
                                </span>
                            </div>
                            <p>{playlist.description || 'No description yet.'}</p>
                            <p className="small">Owner: {playlist.ownerUsername} · Tracks: {playlist.tracks.length}</p>
                            <div className="button-row">
                                <button className="button button--secondary" type="button" onClick={() => navigate(`/playlists/${playlist.id}`)}>open</button>
                                <button className="button" type="button" onClick={() => navigate(`/playlists/${playlist.id}/edit`)}>edit</button>
                                <button className="button button--danger" type="button" onClick={() => handleDelete(playlist.id)}>delete</button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default PlaylistsPage;
