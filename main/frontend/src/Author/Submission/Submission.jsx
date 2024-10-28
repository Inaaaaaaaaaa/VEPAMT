import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SubmissionSummary from './SubmissionSummary';
import Pagination from './Pagination';
import SortDropdown from './SortDropdown';
import { fetchSubmissions } from '../../api';  // Ensure fetchSubmissions accepts userId as a parameter

function Submission() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentSort, setCurrentSort] = useState('all');
  const pageSize = 4;

  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword')?.trim().toLowerCase() || '';

  // Use state to store userId for this component
  const [userId, setUserId] = useState(null);

  // Effect to load user ID from localStorage
  useEffect(() => {
    // Helper function to get a value from cookies
    function getCookieValue(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    // Get userID and role from cookies
    const storedUserId = getCookieValue('userID');

    console.log('Retrieved userID:', storedUserId); // Debug log
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID is undefined");
    }
  }, []);

  // Fetch all submissions when userId changes
  useEffect(() => {
    if (userId) {
      fetchAndSortAllSubmissions(userId);
    }
  }, [userId]);

  // Fetch and combine all submissions, then sort them
  const fetchAndSortAllSubmissions = async (userId) => {
    try {
      const allSubmissions = [];
      let currentPage = 0;
      let totalPagesFetched = 1;

      // Fetch all pages until we have all submissions
      while (currentPage < totalPagesFetched) {
        const data = await fetchSubmissions(userId, currentPage, pageSize);
        console.log("Fetched data from page", currentPage, ":", data); // Debug to confirm data structure

        if (data.submissions) {
          allSubmissions.push(...data.submissions);
        }
        totalPagesFetched = data.totalPages;
        currentPage++;
      }

      // Sort all submissions based on submitDate in descending order
      const sortedSubmissions = allSubmissions.sort(
        (a, b) => new Date(b.submitDate).getTime() - new Date(a.submitDate).getTime()
      );

      console.log("All Sorted Submissions:", sortedSubmissions); // Log all sorted submissions

      setSubmissions(sortedSubmissions);
      setTotalPages(Math.ceil(sortedSubmissions.length / pageSize));
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Memoize filtered and sorted submissions based on keyword and sort
  const filteredAndSortedSubmissions = useMemo(() => {
    let filteredSubmissions = Array.isArray(submissions) ? submissions : []; // Ensure submissions is an array

    if (keyword) {
      filteredSubmissions = filteredSubmissions.filter(submission =>
        submission.title.toLowerCase().includes(keyword) ||
        (submission.abstractText && submission.abstractText.toLowerCase().includes(keyword))
      );
    }

    if (currentSort !== 'all') {
      filteredSubmissions = filteredSubmissions.filter(submission => submission.status === currentSort);
    }

    // Paginate the filtered and sorted submissions
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredSubmissions.slice(startIndex, endIndex);
  }, [submissions, keyword, currentSort, page]);

  // Handle sort changes
  const handleSortChange = (sortOption) => {
    setCurrentSort(sortOption || 'all');
  };

  // Show loading indicator while data is fetching
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <div className="flex items-center space-x-4">
          <Link to={`/user/${userId}/create-submission/step-1`} className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Submit Paper
          </Link>
          <SortDropdown onSortChange={handleSortChange} />
        </div>
      </div>
      {filteredAndSortedSubmissions.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No submissions found for "{currentSort.charAt(0).toUpperCase() + currentSort.slice(1)}".</p>
        </div>
      ) : (
        <div className="flex flex-wrap">
          {filteredAndSortedSubmissions.map((submission) => (
            <SubmissionSummary key={submission.submissionID} submission={submission} />
          ))}
        </div>
      )}
      {filteredAndSortedSubmissions.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default Submission;
