import React, { useRef, useEffect } from 'react';

const NotificationsPopup = ({ isOpen, onClose, notifications = [] }) => {
    const popupRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="notifications-popup" ref={popupRef}>
            <div className="notifications-header">
                <h3>Notifications</h3>
                <button className="clear-button" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="notifications-body">
                {notifications.length === 0 ? (
                    <div className="no-notifications">
                        <i className="fas fa-bell-slash"></i>
                        <p>No new notifications</p>
                    </div>
                ) : (
                    <ul className="notifications-list">
                        {notifications.map((notification, index) => (
                            <li key={index} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                                <div className="notification-icon">
                                    <i className={`fas ${notification.icon || 'fa-bell'}`}></i>
                                </div>
                                <div className="notification-content">
                                    <p className="notification-text">{notification.message}</p>
                                    <span className="notification-time">
                                        {notification.time}
                                    </span>
                                </div>
                                {!notification.read && <div className="unread-indicator"></div>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {notifications.length > 0 && (
                <div className="notifications-footer">
                    <button className="mark-all-read">Mark all as read</button>
                    <button className="view-all">View all</button>
                </div>
            )}
        </div>
    );
};

export default NotificationsPopup;
