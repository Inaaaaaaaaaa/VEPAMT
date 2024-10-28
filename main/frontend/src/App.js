import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Login from './Login/Login.jsx';
import OTPInput from './Login/OTPInput.jsx';
import Recovered from './Login/Recovered.jsx';
import Reset from './Login/Reset.jsx';
import UserRegistration from './Login/UserRegistration.jsx';

// Import Author Components
import AuthorLayout from './Author/AuthorLayout.jsx';
import AuthorDashboard from './Author/Dashboard/Dashboard.jsx';
import Submission from './Author/Submission/Submission.jsx';
import SubmissionDetails from './Author/Submission/SubmissionDetails.jsx';
import CreateSubmissionDraft from './Author/Submission/CreateSubmissionDraft';
import Conference from './Author/Conference/Conference.jsx';
import ConferenceDetails from './Author/Conference/ConferenceDetails';
import Message from './Author/Message/Message.jsx';
import Profile from './Author/Profile';
import Settings from './Author/Settings';
import AuthorSupport from './Author/Support/Support.jsx';
import Calendar from './Author/Calandar/Calendar.jsx';

// Import Organizer Components
import OrganizerLayout from './Organizer/OrganizerLayout.jsx';
import OrganizerDashboard from './Organizer/Dashboard';
import OrganizerSubmission from './Organizer/Submission';
import OrganizerConference from './Organizer/Conference';
import OrganizerProfile from './Organizer/Profile';
import OrganizerSettings from './Organizer/Settings';
import OrganizerSupport from './Organizer/Support';
import OrganizerAnalytics from './Organizer/Analytics';
import AddConference from './Organizer/Conference/AddConference';
import OrganizerSchedule from './Organizer/Schedule';
import OrganizerMessage from './Organizer/Message';
import OrganizerConferenceDetails from './Organizer/Conference/ConferenceDetails';
import OrganizerSubmissionDetails from './Organizer/Submission/SubmissionDetails';

// Import Reviewer Components
import ReviewerLayout from './Reviewer/ReviewerLayout.jsx';
import ReviewerDashboard from './Reviewer/Dashboard';
import ReviewerSubmission from './Reviewer/Submission';
import ReviewerCalendar from './Reviewer/Calendar';
import ReviewerMessage from './Reviewer/Message';
import ReviewerSupport from './Reviewer/Support';
import ReviewerSubmissionDetails from './Reviewer/Submission/SubmissionDetails';

// Create Contexts
export const AuthContext = createContext();
export const RecoveryContext = createContext();

// AuthProvider Component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    function getCookieValue(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }
  
    const storedUserID = getCookieValue('userID');
    const storedUserType = getCookieValue('userType');
    const isAuthenticated = getCookieValue('isAuthenticated') === 'true';
  
    console.log("storedUserID from cookie:", storedUserID);
    console.log("storedUserType from cookie:", storedUserType);
    console.log("isAuthenticated from cookie:", isAuthenticated);
  
    if (storedUserID && storedUserType && isAuthenticated) {
      setUserID(storedUserID);
      setUserType(storedUserType);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userType, setUserType, userID, setUserID }}>
      {children}
    </AuthContext.Provider>
  );
};

// RecoveryProvider Component
const RecoveryProvider = ({ children }) => {
  const [recoveryData, setRecoveryData] = useState({});
  return (
    <RecoveryContext.Provider value={{ recoveryData, setRecoveryData }}>
      {children}
    </RecoveryContext.Provider>
  );
};

// ProtectedRoute Component for authentication and role-based routing
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <RecoveryProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/otp-input" element={<OTPInput />} />
            <Route path="/recovered" element={<Recovered />} />
            <Route path="/reset" element={<Reset />} />

            {/* Role-Based Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <RoleBasedRoutes />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </RecoveryProvider>
    </AuthProvider>
  );
}

// Role-Based Routing Component
const RoleBasedRoutes = () => {
  const { userType } = useContext(AuthContext);

  switch (userType) {
    case 'author':
      return (
        <Routes>
          <Route path="/user/:userID/*" element={<AuthorLayout />}>
            <Route index element={<AuthorDashboard />} />
            <Route path="submission" element={<Submission />} />
            <Route path="submission/:submissionID" element={<SubmissionDetails />} />
            <Route path="create-submission/*" element={<CreateSubmissionDraft />} />
            <Route path="conference" element={<Conference />} />
            <Route path="conference/:conferenceID" element={<ConferenceDetails />} />
            <Route path="message" element={<Message />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<AuthorSupport />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>
        </Routes>
      );

    case 'reviewer':
      return (
        <Routes>
          <Route path="/" element={<ReviewerLayout />}>
            <Route index element={<ReviewerDashboard />} />
            <Route path="submission" element={<ReviewerSubmission />} />
            <Route path="submission/:id" element={<ReviewerSubmissionDetails />} />
            <Route path="calendar" element={<ReviewerCalendar />} />
            <Route path="message" element={<ReviewerMessage />} />
            <Route path="settings" element={<ReviewerSettings />} />
            <Route path="support" element={<ReviewerSupport />} />
          </Route>
        </Routes>
      );

    case 'organizer':
      return (
        <Routes>
          <Route path="/" element={<OrganizerLayout />}>
            <Route index element={<OrganizerDashboard />} />
            <Route path="submission" element={<OrganizerSubmission />} />
            <Route path="submission/:id" element={<OrganizerSubmissionDetails />} />
            <Route path="conference" element={<OrganizerConference />} />
            <Route path="add-conference" element={<AddConference />} />
            <Route path="conference/:id" element={<OrganizerConferenceDetails />} />
            <Route path="profile" element={<OrganizerProfile />} />
            <Route path="settings" element={<OrganizerSettings />} />
            <Route path="support" element={<OrganizerSupport />} />
            <Route path="analytics" element={<OrganizerAnalytics />} />
            <Route path="schedule" element={<OrganizerSchedule />} />
            <Route path="message" element={<OrganizerMessage />} />
          </Route>
        </Routes>
      );

    default:
      return <Navigate to="/login" />;
  }
};

export default App;
