import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [siteName, setSiteName] = useState('Virtual Event Planning and Management Tool');
    const [adminEmail, setAdminEmail] = useState('ina@gmail.com');
    const [password, setPassword] = useState('');
    const [twoFactor, setTwoFactor] = useState(false);
    const [theme, setTheme] = useState('light');
    const [emailNotifications, setEmailNotifications] = useState(true);

    const saveSettings = () => {
        // Normally, you'd send these settings to your server
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            
            <div className="setting-group">
                <h2>General</h2>
                <div className="setting-item">
                    <label htmlFor="site-name">Site Name</label>
                    <input
                        type="text"
                        id="site-name"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                    />
                </div>
                <div className="setting-item">
                    <label htmlFor="admin-email">Admin Email</label>
                    <input
                        type="email"
                        id="admin-email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="setting-group">
                <h2>Security</h2>
                <div className="setting-item">
                    <label htmlFor="password">Change Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="setting-item">
                    <label htmlFor="two-factor">Two-Factor Authentication</label>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            id="two-factor"
                            checked={twoFactor}
                            onChange={() => setTwoFactor(!twoFactor)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            
            <div className="setting-group">
                <h2>Appearance</h2>
                <div className="setting-item">
                    <label htmlFor="theme">Theme</label>
                    <select
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>
            </div>
            
            <div className="setting-group">
                <h2>Notifications</h2>
                <div className="setting-item">
                    <label htmlFor="email-notifications">Email Notifications</label>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            id="email-notifications"
                            checked={emailNotifications}
                            onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            
            <button onClick={saveSettings} className="save-button">Save Changes</button>
        </div>
    );
};

export default Settings;
