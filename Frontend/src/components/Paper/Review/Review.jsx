import React, { useState, useEffect } from 'react';
import './Review.css';
import axios from 'axios';
import _ from 'lodash';

const Review = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showForm, setShowForm] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for saved data in Local Storage
    const savedData = localStorage.getItem('reviewData');

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
      setFilteredPapers(parsedData);
    } else {
      // Fetch papers data
      axios
        .get('http://localhost:8080/users_name')
        .then((response) => {
          const papersData = response.data.map((paper) => ({
            ...paper,
            status: paper.status || 'Unassigned' // Default to 'Unassigned'
          }));
          setData(papersData);
          setFilteredPapers(papersData);

          // Save the initial data to localStorage
          localStorage.setItem('reviewData', JSON.stringify(papersData));
        })
        .catch((error) => {
          console.error('Error fetching papers data:', error);
        });
    }

    // Fetch users data
    axios
      .get('http://localhost:8080/users_name')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users data:', error);
      });
  }, []);

  useEffect(() => {
    filterAndSortPapers();
  }, [searchTerm, sortBy, data]);

const filterAndSortPapers = () => {
  let filtered = data.filter((paper) => {
    const title = (paper.title || '').toString().toLowerCase(); // Ensure it's a string
    const firstName = (paper.firstName || '').toString().toLowerCase();
    const lastName = (paper.lastName || '').toString().toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    return (
      title.includes(searchTermLower) ||
      firstName.includes(searchTermLower) ||
      lastName.includes(searchTermLower)
    );
  });

  filtered = _.sortBy(filtered, sortBy);
  setFilteredPapers(filtered);
};


  const handleView = (paper) => {
    setSelectedPaper(paper);
    setShowForm(true);
  };
  

  // Toggle status and save in localStorage
  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 'Assigned' ? 'Unassigned' : 'Assigned';

    setData((prevData) => {
      const updatedData = prevData.map((paper) =>
        paper.id === id ? { ...paper, status: newStatus } : paper
      );
      setFilteredPapers(updatedData);

      // Save the updated data to Local Storage
      localStorage.setItem('reviewData', JSON.stringify(updatedData));

      return updatedData;
    });
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPapers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <div className="review-container">
      <h1>Paper Reviews</h1>

      <div id="review-cards-container">
        {currentItems.map((paper) => (
          <div key={paper.id} className="paper-card">
            <div className="paper-title">{paper.paper_id || 'No Paper ID'}</div>
            <div className="paper-reviewer">
              {paper.firstName} {paper.lastName}
            </div>
            <div className="paper-status">
              Status: {paper.status}
              <button
                className={`status-btn ${paper.status.toLowerCase()}`}
                onClick={() => handleStatusToggle(paper.id, paper.status)}
              >
                Change Status
              </button>
            </div>

            <div className="paper-actions">
              {/* View button */}
              <button onClick={() => handleView(paper)}>View</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Review;
