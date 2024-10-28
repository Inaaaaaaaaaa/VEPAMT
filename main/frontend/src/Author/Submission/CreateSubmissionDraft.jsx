import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StepNavigation from './StepNavigation';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function CreateSubmissionDraft() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authors, setAuthors] = useState([
    { authorID: null, firstName: '', lastName: '', email: '', country: '', organization: '' },
  ]);
  
  const [, setAuthorID] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    title: "",
    track: "",
    keywords: "", // Keywords entered as a comma-separated string
    abstractText: "",
    authors: authors,
  });
  const [localFiles, setLocalFiles] = useState([]);
  
  useEffect(() => {
    if (location.pathname === '/create-submission') {
      navigate('/user/:userID/create-submission/step-1');
    }
  }, [location, navigate]);

  const handleBack = () => {
    navigate('/user/${userId}/submission');
  };

  const handleSaveAuthors = (savedAuthors) => {
    setAuthors(savedAuthors);
    if (savedAuthors && savedAuthors.length > 0) {
      setAuthorID(savedAuthors[0].authorID); // Use the first author's ID
    }
  };

  const handleOnSaveFile = (saveFile) => {
    setLocalFiles(saveFile);
  };

  const handleSaveSubmission = (submission) => {
    // Pass the submissionID down to Step 3 using the route path
    setSubmissionData(submission);
    navigate(`/user/:userID/create-submission/step-3/${submission.submissionID}`);
  };
    
  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 mb-4">{'< Back to submission'}</button>
      <h1 className="text-3xl font-bold mb-4">Create Submission Draft</h1>
      <StepNavigation />
      <div className="bg-white p-6 rounded-md shadow-md mt-4">
        <Routes>
          <Route path="step-1" element={<Step1 onSaveAuthors={handleSaveAuthors} authors1={authors} submission={submissionData}/>} />
          <Route path="step-2" element={<Step2 onSaveSubmission={handleSaveSubmission} onSaveAuthor={handleSaveAuthors} authors={authors} submi={submissionData} setSubmissionData1={setSubmissionData}/>} />
          <Route path="step-3/:submissionID" element={<Step3 submissionID={submissionData?.submissionID}  onSaveFile={handleOnSaveFile} localFiles1={localFiles}/>} />
          <Route path="step-3" element={<Step3 submissionID={submissionData?.submissionID} onSaveFile={handleOnSaveFile} localFiles1={localFiles}/>}/>
        </Routes>
      </div>
    </div>
  );
}
