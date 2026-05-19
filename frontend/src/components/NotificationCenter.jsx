import React from 'react';

function NotificationCenter({ notifications = [] }) {
    if (!notifications.length) return null;
    return (
        <div className="notification-stack">
            {notifications.map((item) => (
                <div className="notification notification--dark" key={item.id}>
                    <strong>{item.title}</strong>
                    <div className="small small--light">{item.message}</div>
                </div>
            ))}
        </div>
    );
}

export default NotificationCenter;
