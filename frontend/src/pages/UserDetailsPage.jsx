import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../services/api.js';

function UserDetailsPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            try {
                setUser(await getUser(id));
            } catch (apiError) {
                setError(apiError.message);
            }
        };

        loadUser();
    }, [id]);

    if (error) {
        return <div className="notification error">{error}</div>;
    }

    if (!user) {
        return <div className="card">Loading...</div>;
    }

    return (
        <div className="card">
            <h1>user information</h1>
            <p><strong>username:</strong> {user.username}</p>
            <p><strong>role:</strong> {user.role}</p>
            <p className="small">Selected user information screen from Lab 1 is now dynamic.</p>
        </div>
    );
}

export default UserDetailsPage;
