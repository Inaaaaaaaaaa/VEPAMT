import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Dashboard/Sidebar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Submissions from './components/Paper/Submissions/Submissions'; 
import Review from './components/Paper/Review/Review';
import Header from './components/Dashboard/Header';
import Roles from './components/User management/Roles/Roles';
import Update from './components/User management/Update user/Update';
import Conference from './components/Other/Conference/Conference';
import Notifications from './components/Other/Notifications/Notifications';
import Settings from './components/Other/Settings/Settings';
import History from './components/User management/History/History';
import View from './components/User management/Viewallusers/View';
import Login from './components/Login/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const notificationsRef = useRef();

    // Check localStorage for auth token on mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('authToken', 'yourAuthToken'); // Store token
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken'); // Remove token
    };

    return (
        <Router>
            <Routes>
                {/* Redirect the root path to login or dashboard based on authentication */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard/submissions" : "/login"} replace />} />
                
                {/* If not authenticated, show only the login page */}
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                
                {/* If authenticated, show the dashboard layout and routes */}
                {isAuthenticated && (
                    <Route
                        path="/dashboard/*"
                        element={
                            <div style={{ display: 'flex' }}>
                                <Sidebar onLogout={handleLogout} />
                                <div style={{ flex: 1, width: '100%' }}>
                                    <Header />
                                    <Routes>
                                        <Route path="submissions" element={<Submissions />} />
                                        <Route path="update" element={<Update />} />
                                        <Route path="notifications" element={<Notifications ref={notificationsRef} />} />
                                        <Route path="review-management" element={<Review notificationsRef={notificationsRef} />} />
                                        <Route path="roles" element={<Roles />} />
                                        <Route path="view" element={<View />} />
                                        <Route path="conferences" element={<Conference />} />
                                        <Route path="settings" element={<Settings />} />
                                        <Route path="history" element={<History />} />
                                    </Routes>
                                </div>
                            </div>
                        }
                    />
                )}

                {/* Catch-all route to redirect unknown paths */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard/submissions" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;
