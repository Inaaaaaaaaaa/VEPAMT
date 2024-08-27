import React, { useEffect, useState } from 'react';
import './View.css';

const View = () => {
    const [notifications, setNotifications] = useState([
        {
            title: "Paper review",
            content: "Lucy has assigned a reviewer for COMP702",
            time: "2 minutes ago",
            read: false
        },
        {
            title: "Conference schedules",
            content: "Alex has scheduled a conference on the 19th August with 3 others.",
            time: "3 hours ago",
            read: false
        },
        {
            title: "Paper submission request",
            content: "Brian has requested Admin to accept a submission request",
            time: "3 hours ago",
            read: false
        },
        {
            title: "New Feature Request",
            content: "Users have requested a dark mode feature. Review and prioritize.",
            time: "Yesterday",
            read: false
        },
        {
            title: "Review request",
            content: "John has requested Admin to change reviewers.",
            time: "2 days ago",
            read: false
        }
    ]);

    const [selectedNotifications, setSelectedNotifications] = useState([]);

    const handleCheckboxChange = (index) => {
        setSelectedNotifications((prevSelected) =>
            prevSelected.includes(index)
                ? prevSelected.filter((i) => i !== index)
                : [...prevSelected, index]
        );
    };

    const clearSelectedNotifications = () => {
        setNotifications(notifications.filter((_, index) => !selectedNotifications.includes(index)));
        setSelectedNotifications([]); // Clear the selection
    };

    const markSelectedAsRead = () => {
        const newNotifications = [...notifications];
        selectedNotifications.forEach(index => {
            newNotifications[index].read = true;
        });
        setNotifications(newNotifications);
        setSelectedNotifications([]); // Clear the selection
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    const renderNotifications = () => {
        if (notifications.length === 0) {
            return <li className="no-notifications">No new notifications</li>;
        }

        return notifications.map((notification, index) => (
            <li key={index} className={`notification-item ${notification.read ? 'read' : ''}`}>
                <input
                    type="checkbox"
                    checked={selectedNotifications.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                />
                <div className="notification-content-wrapper">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-content">{notification.content}</div>
                    <div className="notification-time">{notification.time}</div>
                </div>
            </li>
        ));
    };

    const hasSelectedNotifications = selectedNotifications.length > 0;

    return (
        <div className="notification-container">
            <h1>Admin Notifications</h1>
            <p>Manage all your notifications here!</p>
            <ul className="notification-list" id="notificationList">
                {renderNotifications()}
            </ul>
            <div className="notification-buttons">
                <button
                    className="clear-button"
                    onClick={hasSelectedNotifications ? clearSelectedNotifications : clearAllNotifications}
                >
                    {hasSelectedNotifications ? 'Delete Selected' : 'Delete All'}
                </button>
                <button
                    className="read-all-button"
                    onClick={hasSelectedNotifications ? markSelectedAsRead : markAllAsRead}
                >
                    {hasSelectedNotifications ? 'Mark Selected as Read' : 'Read All'}
                </button>
            </div>
        </div>
    );
};

export default View;
