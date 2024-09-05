import React, { useRef } from 'react';
import './App.css';
import Sidebar from './components/Dashboard/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
function App() {
    const notificationsRef = useRef();

    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flex: 1, width: '100%' }}> 
                    <Header />
                    <Routes>
                        <Route path="/submissions" element={<Submissions />} />
                        <Route path="/update" element={<Update />} />
                        <Route path="/notifications" element={<Notifications ref={notificationsRef} />} />
                        <Route path="/review-management" element={<Review notificationsRef={notificationsRef} />} />
                        <Route path="/roles" element={<Roles />} />
                        <Route path="/view" element={<View />} />
                        <Route path="/conferences" element={<Conference />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/history" element={<History />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
