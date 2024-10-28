import React, { useState } from 'react';

export default function Step1() {
  const [selectedSubmission, setSelectedSubmission] = useState('');

  const handleSubmissionChange = (e) => {
    setSelectedSubmission(e.target.value);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 1: Submission Selection (Optional)</h2>
      <p className="mb-4">Select a submission to associate with the conference, or skip this step.</p>
      <select
        value={selectedSubmission}
        onChange={handleSubmissionChange}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select a Submission</option>
        <option value="submission1">Submission 1</option>
        <option value="submission2">Submission 2</option>
        <option value="submission3">Submission 3</option>
      </select>
    </div>
  );
}
