import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SubmissionSummary from './Submission/SubmissionSummary';
import Pagination from './Pagination';
import SortDropdown from './SortDropdown';

function Submission() {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      paperName: 'AI in Healthcare',
      track: 'Track 1',
      status: 'Approve',
      author: 'John Doe ,Author2',
      submitDate: '2024-01-31',
      keywords: ['AI', 'Healthcare'],
    },
    {
      id: 2,
      paperName: 'Blockchain Technology',
      track: 'Track 2',
      status: 'Pending',
      author: 'Jane Smith',
      submitDate: '2024-02-01',
      keywords: ['Blockchain', 'Finance'],
    },
    {
      id: 3,
      paperName: 'Quantum Computing',
      track: 'Track 3',
      status: 'Rejected',
      author: 'Alice Johnson',
      submitDate: '2024-02-02',
      keywords: ['Quantum', 'Computing'],
    },
    {
      id: 4,
      paperName: 'Cybersecurity Trends',
      track: 'Track 4',
      status: 'Resubmitting',
      author: 'Bob Lee',
      submitDate: '2024-02-03',
      keywords: ['Cybersecurity', 'Trends'],
    },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Submission</h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/create-submission/step-1"
            className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Paper
          </Link>
          <SortDropdown />
        </div>
      </div>
      <div className="flex flex-wrap">
        {submissions.map((submission) => (
          <SubmissionSummary key={submission.id} submission={submission} />
        ))}
      </div>
      <Pagination />
    </div>
  );
}

export default Submission;
