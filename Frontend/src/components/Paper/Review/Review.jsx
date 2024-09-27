import React, { useState, useEffect } from 'react';
import './Review.css';
import axios from 'axios';
import _ from 'lodash';

const Review = () => {
  const [data, setData] = useState([]);
  // For holding the list of users
  const [users, setUsers] = useState([]); 
  const [selectedPaper, setSelectedPaper] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showForm, setShowForm] = useState(false); 
  // To hold the selected reviewers
  const [selectedReviewers, setSelectedReviewers] = useState([]); 
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Fetch papers data
    axios
      .get('http://localhost:8080/users_name')
      .then((response) => {
        setData(response.data);
        setFilteredPapers(response.data); // Initialize with fetched data
      })
      .catch((error) => {
        console.error('Error fetching papers data:', error);
      });

    // Fetch users data
    axios
      .get('http://localhost:8080/users_name') // Adjust to the correct endpoint if needed
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
      const title = paper.title ? paper.title.toLowerCase() : '';
      const firstName = paper.firstName ? paper.firstName.toLowerCase() : '';
      const lastName = paper.lastName ? paper.lastName.toLowerCase() : '';
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

  // Show the white form when view is clicked
  const handleView = (paper) => {
    setSelectedPaper(paper);
    setShowForm(true);
    setSelectedReviewers([]); // Reset selected reviewers when opening a new paper
  };

  const handleAddReviewer = (reviewerId) => {
    if (selectedReviewers.includes(reviewerId)) {
      // Remove the reviewer from the selection
      setSelectedReviewers(selectedReviewers.filter((id) => id !== reviewerId));
    } else {
      // Add the reviewer to the selection
      setSelectedReviewers([...selectedReviewers, reviewerId]);
    }
  };

  const handleSaveReviewer = () => {
    if (selectedReviewers.length === 0 || !selectedPaper) return;
  
    // Set loading to true when saving starts
    setLoading(true);
  
    // Get selected reviewers' details
    const selectedReviewerDetails = users.filter((user) => selectedReviewers.includes(user.id));
  
    axios
      .put(`http://localhost:8080/users_name/${selectedPaper.id}/reviewer`, {
        Reviewers: selectedReviewers, // Ensure this matches what your server expects
      })
      .then((response) => {
        // Handle successful save
        const updatedPaper = {
          ...selectedPaper,
          reviewers: selectedReviewerDetails,
        };
  
        setData((prevData) =>
          prevData.map((paper) => (paper.id === selectedPaper.id ? updatedPaper : paper))
        );
  
        // Close the modal and reset states
        setShowForm(false);
        setSelectedPaper(null);
        setSelectedReviewers([]);
  
        // Set loading to false when save is complete
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          console.error('Server responded with status:', error.response.status);
          console.error('Error response data:', error.response.data); // Log additional server error details
          console.error('Headers:', error.response.headers); // Log headers for more context
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
  
        setLoading(false);
      });
  };
  
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPapers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  const handleCloseModal = () => {
    setShowForm(false);
    setSelectedPaper(null);
    setSelectedReviewers([]); // Clear selected reviewers
  };

  return (
    <div className="review-container">
      <h1>Paper Reviews</h1>

      {/* Sorting dropdown */}
      <div id="filter-container">
        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort by Paper name</option>
          <option value="status">Sort by status</option>
        </select>
      </div>

      <div id="review-cards-container">
        {currentItems.map((paper) => (
          <div key={paper.id} className="paper-card">
            <div className="paper-title">{paper.paper_id || 'No Paper ID'}</div>
            <div className="paper-reviewer">
              {paper.firstName} {paper.lastName}
            </div>
            <div className="paper-status">Status: {paper.submissions_status}</div>

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

      {/* Modal-like white form */}
      {showForm && selectedPaper && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="white-form" onClick={(e) => e.stopPropagation()}>
            <h2>Paper Details</h2>
            <p>
              <strong>Paper ID:</strong> {selectedPaper.paperId}
            </p>
            {/* Display selected reviewers */}
            <p>
            <strong>Reviewer(s):</strong>{' '}
            {selectedReviewers.length > 0
              ? users
                  .filter((user) => selectedReviewers.includes(user.id))
                  .map((user) => `${user.firstName} ${user.lastName}`)
                  .join(', ')
              : 'No reviewers selected'}
          </p>


            {/* Table displaying users when user clicks on view button */}
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelected = selectedReviewers.includes(user.id);
                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>
                        <button 
                          className={isSelected ? 'remove-button' : 'select-button'} 
                          onClick={() => handleAddReviewer(user.id)}>
                          {isSelected ? 'Remove' : 'Select'}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="form-actions">
              <button onClick={handleSaveReviewer} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCloseModal} disabled={loading}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
