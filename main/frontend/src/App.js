import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Author/Layout';
import Dashboard from './Author/Dashboard';  
import Submission from './Author/Submission';  
import SubmissionDetails from './Author/Submission/SubmissionDetails'; 
import CreateSubmissionDraft from './Author/Submission/CreateSubmissionDraft'; // 导入CreateSubmissionDraft组件及其步骤页面
import Conference from './Author/Conference';  
import ConferenceDetails from './Author/Conference/ConferenceDetails'; 
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
          <Route path="submission/:id" element={<SubmissionDetails />} />
          <Route path="create-submission/*" element={<CreateSubmissionDraft />} /> {/* 新增的路由 */}
          <Route path="conference" element={<Conference />} />
          <Route path="conference/:id" element={<ConferenceDetails />} />
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
