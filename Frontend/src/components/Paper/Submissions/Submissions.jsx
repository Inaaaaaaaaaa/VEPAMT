import React, { useState, useEffect } from 'react';
import './Submissions.css';
import axios from 'axios';
import _ from 'lodash';
import PieChart from './PieChart';
import SubmittedChart from './SubmittedChart';

const statusOrder = ['Submitted', 'Unsubmitted', 'Pending', 'Rejected'];

const Submissions = () => {
  const [data, setData] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    // Load saved data from localStorage first
    const savedData = localStorage.getItem('submissionData');

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
      setFilteredPapers(parsedData);
      const counts = _.countBy(parsedData, 'submissions_status');
      setStatusCounts(counts);
    } else {
      // If no saved data, fetch from backend
      axios
        .get('http://localhost:8080/users_name')
        .then((response) => {
          const papersData = response.data.map((paper) => ({
            ...paper,
            title: paper.title || '', // Ensure title is a string
            firstName: paper.firstName || '', // Ensure firstName is a string
            lastName: paper.lastName || '', // Ensure lastName is a string
            submissions_status: paper.submissions_status || 'Unsubmitted', // Default to 'Unsubmitted'
          }));
          setData(papersData);
          setFilteredPapers(papersData);

          const counts = _.countBy(papersData, 'submissions_status');
          setStatusCounts(counts);

          // Save the initial data to localStorage
          localStorage.setItem('submissionData', JSON.stringify(papersData));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  // Handle status change and update the frontend state and Local Storage
  const handleStatusChange = (id, currentStatus) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const newStatus = statusOrder[nextIndex];

    // Update the status in the data state
    setData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.id === id ? { ...item, submissions_status: newStatus } : item
      );

      // Update filtered papers state
      setFilteredPapers(updatedData);

      // Recalculate status counts
      const updatedCounts = _.countBy(updatedData, 'submissions_status');
      setStatusCounts(updatedCounts);

      // Save the updated data to Local Storage
      localStorage.setItem('submissionData', JSON.stringify(updatedData));

      return updatedData;
    });
  };

  // Separate counts for the two graphs
  const unsubmittedRejectedCounts = {
    Unsubmitted: statusCounts['Unsubmitted'] || 0,
    Rejected: statusCounts['Rejected'] || 0,
  };

  const submittedPendingCounts = {
    Submitted: statusCounts['Submitted'] || 0,
    Pending: statusCounts['Pending'] || 0,
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPapers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <div className="submission-container">
      <h1>Paper submissions</h1>

      {/* Charts container */}
      <div id="chart-container">
        <div className="chart-item">
          <PieChart statusCounts={unsubmittedRejectedCounts} />
        </div>
        <div className="chart-item">
          <SubmittedChart statusCounts={submittedPendingCounts} />
        </div>
      </div>

      {/* Papers container */}
      <div id="papers-container">
        {currentItems.map((paper) => (
          <div key={paper.id} className="paper-card">
            <div className="paper-title">{paper.paperId || 'No Paper ID'}</div>
            <div className="paper-author">
              {paper.firstName} {paper.lastName}
            </div>
            <div className="paper-status">
              Status: {paper.submissions_status}
              <button
                className={`status-btn ${paper.submissions_status.toLowerCase()}`}
                onClick={() => handleStatusChange(paper.id, paper.submissions_status)}
              >
                Change Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? 'active' : ''}>
            {number}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Submissions;
