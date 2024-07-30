import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Author/Layout';
import Dashboard from './Author/Dashboard';  
import Submission from './Author/Submission';  
import Conference from './Author/Conference';  
import Message from './Author/Message';  
import Profile from './Author/Profile';  
import Settings from './Author/Settings';
import Support from './Author/Support';
import Calendar from './Author/Calendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="submission" element={<Submission />} />
          <Route path="conference" element={<Conference />} />
          <Route path="message" element={<Message />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
