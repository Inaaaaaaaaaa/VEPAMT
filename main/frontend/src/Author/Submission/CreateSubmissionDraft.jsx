// CreateSubmissionDraft.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StepNavigation from './StepNavigation';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function CreateSubmissionDraft() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/create-submission') {
      navigate('/create-submission/step-1');
    }
  }, [location, navigate]);

  const handleBack = () => {
    navigate('/submission');
  };

  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 mb-4">{'< Back to submission'}</button>
      <h1 className="text-3xl font-bold mb-4">Create Submission Draft</h1>
      <StepNavigation />
      <div className="bg-white p-6 rounded-md shadow-md mt-4">
        <Routes>
          <Route path="step-1" element={<Step1 />} />
          <Route path="step-2" element={<Step2 />} />
          <Route path="step-3" element={<Step3 />} />
        </Routes>
      </div>
    </div>
  );
}
