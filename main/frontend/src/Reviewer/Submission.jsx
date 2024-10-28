import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubmissionCard from './Submission/SubmissionCard';

function Review() {
  const [submissions, setSubmissions] = useState([]);

  // Helper function to get a value from cookies
  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Get userID and role from cookies
  const userID = getCookieValue('userID');
  const role = getCookieValue('userType');

  // Log values to verify
  console.log('userID:', userID);
  console.log('role:', role);


  useEffect(() => {
    if (userID) {
      axios.get(`http://localhost:8080/api/user/${userID}/assigned`)
        .then((response) => {
          console.log(response.data); // Log the response to confirm unique IDs
          setSubmissions(response.data);
        })
        .catch((error) => {
          console.error('Error fetching assigned submissions:', error);
        });
    } else {
      console.error('User ID not found in localStorage');
    }
  }, [userID]);

  return (
    <div className="flex flex-col p-6 bg-blue-100 dark:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Submissions</h1>
      {/* <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Submissions - UserID: {userID}, Role: {role}</h1> */}
      <div className="grid grid-cols-12 gap-6">
        {submissions.map((submission, index) => (
          <div key={submission.id || index} className="col-span-full sm:col-span-6 xl:col-span-4">
            <SubmissionCard
              id={submission.submissionID}
              title={submission.title}
              authors={submission.authors}
              keywords={submission.keywords}
              submissionDate={submission.submitDate}
              status={submission.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


function Reviewed() {
  const [reviewedSubmissions, setReviewedSubmissions] = useState([]);

  // Helper function to get a value from cookies
  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Get userID and role from cookies
  const userID = getCookieValue('userID');
  const role = getCookieValue('userType');

  // Log values to verify
  console.log('userID:', userID);
  console.log('role:', role);


  useEffect(() => {
    if (userID) {
      axios.get(`http://localhost:8080/api/user/${userID}/reviewed`)
        .then((response) => {
          console.log(response.data); // Log to verify unique IDs
          setReviewedSubmissions(response.data);
        })
        .catch((error) => {
          console.error('Error fetching reviewed submissions:', error);
        });
    } else {
      console.error('User ID not found in localStorage');
    }
  }, [userID]);

  return (
    <div className="flex flex-col p-6 bg-blue-100 dark:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Submissions</h1>
      {/* <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Submissions - UserID: {userID}, Role: {role}</h1> */}
      <div className="grid grid-cols-12 gap-6">
        {reviewedSubmissions.map((submission, index) => (
          <div key={submission.id || index} className="col-span-full sm:col-span-6 xl:col-span-4">
            <SubmissionCard
              id={submission.submissionID} // Pass the id prop to SubmissionCard if needed
              title={submission.title}
              authors={submission.authors}
              keywords={submission.keywords}
              submissionDate={submission.submitDate}
              status={submission.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


function Submission() {
  const [activeTab, setActiveTab] = useState('Review');

  const renderContent = () => {
    switch (activeTab) {
      case 'Review':
        return <Review />;
      case 'Reviewed':
        return <Reviewed />;
      default:
        return <Review />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Submission Management</h1>

      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap -space-x-px w-1/2">
          <button
            className={`btn flex-1 text-center py-2 first:rounded-l last:rounded-r first:border-l-transparent ${activeTab === 'Review' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'
              }`}
            onClick={() => setActiveTab('Review')}
          >
            Review
          </button>
          <button
            className={`btn flex-1 text-center py-2 first:rounded-l last:rounded-r first:border-l-transparent ${activeTab === 'Reviewed' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'
              }`}
            onClick={() => setActiveTab('Reviewed')}
          >
            Reviewed
          </button>
        </div>
      </div>

      <div className="mb-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default Submission;
