// // Submission.js
// import React, { useState, useEffect } from 'react';
// import SubmissionSummary from './SubmissionSummary';
// import Pagination from './Pagination';
// import SortDropdown from './SortDropdown';

// const sortOptions = [
//   { id: 1, name: 'Approve', value: 'Approve' },
//   { id: 2, name: 'Pending', value: 'Pending' },
//   { id: 3, name: 'Rejected', value: 'Rejected' },
//   { id: 4, name: 'Date', value: 'Date' },
//   { id: 5, name: 'Resubmitting', value: 'Resubmitting' },
// ];

// function Submission() {
//   const [submissions, setSubmissions] = useState([]);
//   const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`/api/submissions?sort=${selectedSort.value}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch submissions');
//         }
//         const data = await response.json();
//         setSubmissions(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubmissions();
//   }, [selectedSort]);

//   const handleSortChange = (sortOption) => {
//     setSelectedSort(sortOption);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-3xl font-bold">Submission</h1>
//         <div className="flex items-center space-x-4">
//           <a
//             href="#"
//             className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             Submit Paper
//           </a>
//           <SortDropdown selectedSort={selectedSort} onChange={handleSortChange} />
//         </div>
//       </div>
//       <div className="flex flex-wrap">
//         {submissions.map((submission) => (
//           <SubmissionSummary key={submission.id} submission={submission} />
//         ))}
//       </div>
//       <Pagination />
//     </div>
//   );
// }

// export default Submission;
