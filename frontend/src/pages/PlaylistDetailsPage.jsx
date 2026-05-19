import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { addTrack, deleteTrack, getPlaylist, getPlaylistMessages } from '../services/api.js';

function PlaylistLiveRoom({ playlistId, auth }) {
    const socketRef = useRef(null);
    const [status, setStatus] = useState('connecting');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const wsUrl = useMemo(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        return `${protocol}://${window.location.hostname}:3001/ws/playlists/${playlistId}/`;
    }, [playlistId]);

    useEffect(() => {
        let isMounted = true;

        getPlaylistMessages(playlistId)
            .then((history) => {
                if (isMounted) setMessages(history || []);
            })
            .catch(() => {
                if (isMounted) setMessages([]);
            });

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;
        setStatus('connecting');

        socket.onopen = () => setStatus('connected');
        socket.onclose = () => setStatus('disconnected');
        socket.onerror = () => setStatus('error');
        socket.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                setMessages((current) => {
                    if (payload.id && current.some((item) => item.id === payload.id)) return current;
                    return [payload, ...current].slice(0, 30);
                });
            } catch {
                setMessages((current) => [{
                    type: 'message',
                    author: 'Unknown',
                    message: event.data,
                    createdAt: new Date().toLocaleTimeString(),
                }, ...current].slice(0, 30));
            }
        };

        return () => {
            isMounted = false;
            socket.close();
        };
    }, [playlistId, wsUrl]);

    const sendMessage = (event) => {
        event.preventDefault();
        const cleanMessage = message.trim();
        if (!cleanMessage || socketRef.current?.readyState !== WebSocket.OPEN) return;

        socketRef.current.send(JSON.stringify({
            type: 'playlist-message',
            author: auth?.user?.username || 'Anonymous',
            message: cleanMessage,
        }));
        setMessage('');
    };

    return (
        <section className="card live-room-card">
            <div className="live-room__header">
                <div>
                    <p className="eyebrow">WebSocket mini subproject</p>
                    <h2>Live room for this playlist</h2>
                    <p className="small">Open this playlist in two tabs or on another device. Messages appear in real time and are saved in the database, so they remain after logout or refresh.</p>
                </div>
                <span className={`status-pill status-pill--${status}`}>{status}</span>
            </div>

            <form className="live-room__form" onSubmit={sendMessage}>
                <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write live message for this playlist..." />
                <button className="button" type="submit" disabled={status !== 'connected'}>send</button>
            </form>

            <ul className="live-feed">
                {messages.length ? messages.map((item, index) => (
                    <li className="live-feed__item" key={item.id || `${item.createdAt}-${index}`}>
                        <div className="live-feed__meta">
                            <strong>{item.author}</strong>
                            <span>{item.createdAt}</span>
                        </div>
                        <p>{item.message}</p>
                        {item.persisted ? <span className="small">saved in DB</span> : null}
                    </li>
                )) : <li className="small">No live messages yet.</li>}
            </ul>
        </section>
    );
}

function PlaylistDetailsPage({ auth, notify }) {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [track, setTrack] = useState({ title: '', artist: '', url: '' });
    const [error, setError] = useState('');

    const loadPlaylist = async () => {
        try {
            setPlaylist(await getPlaylist(id));
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    useEffect(() => { loadPlaylist(); }, [id]);

    const handleAddTrack = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await addTrack(id, track);
            notify?.('Track added', `${track.title} — ${track.artist}`);
            setTrack({ title: '', artist: '', url: '' });
            loadPlaylist();
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    const handleDeleteTrack = async (trackId) => {
        try {
            await deleteTrack(id, trackId);
            notify?.('Track deleted', 'Track was removed from playlist.');
            loadPlaylist();
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    if (error) return <div className="notification error">{error}</div>;
    if (!playlist) return <div className="card">Loading...</div>;

    return (
        <div>
            <section className="details-hero">
                <div className="cover cover--big">♫</div>
                <div>
                    <p className="eyebrow">Playlist details + WebSocket</p>
                    <h1>{playlist.name}</h1>
                    <p>{playlist.description}</p>
                    <span className={`badge ${playlist.isPublic ? 'badge--public' : 'badge--private'}`}>{playlist.isPublic ? 'public' : 'private'}</span>
                    <p className="small">Owner: {playlist.ownerUsername} · Tracks: {playlist.tracks.length}</p>
                </div>
                <Link className="button" to={`/playlists/${playlist.id}/edit`}>edit playlist</Link>
            </section>

            <div className="grid grid--two">
                <section className="card">
                    <h2>Music in playlist</h2>
                    {playlist.tracks.length ? (
                        <ul className="track-list">
                            {playlist.tracks.map((item, index) => (
                                <li key={item.id}>
                                    <div className="track-index">{String(index + 1).padStart(2, '0')}</div>
                                    <div className="track-info">
                                        <strong>{item.title}</strong>
                                        <span>{item.artist}</span>
                                        {item.url ? <a className="small" href={item.url} target="_blank" rel="noreferrer">open link</a> : null}
                                    </div>
                                    <button className="button button--danger button--small" type="button" onClick={() => handleDeleteTrack(item.id)}>delete</button>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="small">No tracks yet. Add the first song from the form.</p>}
                </section>

                <section className="card">
                    <h2>Add music</h2>
                    <form onSubmit={handleAddTrack}>
                        <div className="form-field"><label htmlFor="track-title">title</label><input id="track-title" value={track.title} onChange={(event) => setTrack({ ...track, title: event.target.value })} required /></div>
                        <div className="form-field"><label htmlFor="track-artist">artist</label><input id="track-artist" value={track.artist} onChange={(event) => setTrack({ ...track, artist: event.target.value })} required /></div>
                        <div className="form-field"><label htmlFor="track-url">music url</label><input id="track-url" value={track.url} onChange={(event) => setTrack({ ...track, url: event.target.value })} placeholder="https://..." /></div>
                        <button className="button button--large" type="submit">add track</button>
                    </form>
                    <p className="small">This block implements the “music to playlist” feature for Lab 6.</p>
                </section>
            </div>

            <PlaylistLiveRoom playlistId={playlist.id} auth={auth} />
        </div>
    );
}

export default PlaylistDetailsPage;
