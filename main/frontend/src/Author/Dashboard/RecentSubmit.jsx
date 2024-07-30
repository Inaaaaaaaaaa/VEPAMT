// RecentSubmit.js
import React from 'react';

function RecentSubmit() {
  const submissions = [
    {
      paperName: 'Paper Name 1',
      author: 'John Doe',
      date: 'January 31, 2024',
      status: 'Approved',
      progress: 1.25 // full circle
    },
    {
      paperName: 'Paper Name 2',
      author: 'Jane Smith',
      date: 'January 31, 2024',
      status: 'Pending',
      progress: 0.5
    },
    {
      paperName: 'Paper Name 3',
      author: 'Alice Johnson',
      date: 'January 31, 2024',
      status: 'Rejected',
      progress: 0
    },
    {
      paperName: 'Paper Name 4',
      author: 'Bob Brown',
      date: 'January 31, 2024',
      status: 'In Review',
      progress: 0.75 // half
    }
  ];

  const conferences = [
    {
      conferenceName: 'Conference 1',
      location: 'New York, USA',
      date: 'March 15, 2024',
      status: 'Upcoming'
    },
    {
      conferenceName: 'Conference 2',
      location: 'London, UK',
      date: 'April 10, 2024',
      status: 'Upcoming'
    },
    {
      conferenceName: 'Conference 3',
      location: 'Tokyo, Japan',
      date: 'May 5, 2024',
      status: 'Upcoming'
    },
    {
      conferenceName: 'Conference 4',
      location: 'Sydney, Australia',
      date: 'June 20, 2024',
      status: 'Upcoming'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Rejected':
        return 'bg-red-500';
      case 'In Review':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
      <div className="grid grid-cols-1 gap-4">
        {submissions.map((submission, index) => (
          <div key={index} className="relative flex flex-col justify-between bg-gray-50 p-4 rounded-lg shadow-sm h-48">
            <div className="absolute top-4 right-4">
              <div className="relative w-8 h-8">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="4"
                  />
                  <path
                    className="circle"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray={`${submission.progress * 100}, 100`}
                    strokeDashoffset="25"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold">{submission.paperName}</div>
              <div className="text-sm text-gray-600">Author: {submission.author}</div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">{submission.date}</div>
              <div className={`text-white px-2 py-1 rounded-lg ${getStatusColor(submission.status)}`}>
                {submission.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Recent Conferences</h2>
      <div className="space-y-4">
        {conferences.map((conference, index) => (
          <div key={index} className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="text-lg font-semibold">{conference.conferenceName}</div>
            <div className="text-sm text-gray-600">Location: {conference.location}</div>
            <div className="mt-2 flex justify-between items-center">
              <div className="text-sm text-gray-600">{conference.date}</div>
              <div className="text-white px-2 py-1 rounded-lg bg-blue-500">
                {conference.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSubmit;
