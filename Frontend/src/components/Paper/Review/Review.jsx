import React, { useState, useEffect, useCallback } from 'react';
import './Review.css';
import axios from 'axios';
import _ from 'lodash';

const Review = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]); // For holding the list of users from users_name
  const [selectedPaper, setSelectedPaper] = useState(null); // For holding the selected paper
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showForm, setShowForm] = useState(false); // To control visibility of the modal form
  const [selectedReviewer, setSelectedReviewer] = useState(null); // To hold the selected reviewer during editing

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
  };

  const handleAddReviewer = (reviewerId) => {
    setSelectedReviewer(reviewerId); 
  };

  const handleSaveReviewer = () => {
    if (!selectedReviewer || !selectedPaper) return;

    // Logic to save the reviewer for the selected paper
    axios.put(`http://localhost:8080/users_name/${selectedPaper.id}/reviewer`, { reviewer: selectedReviewer })
      .then((response) => {
        console.log('Reviewer added:', response.data);
        setShowForm(false); // Close the form after saving
        setSelectedPaper(null); // Reset the selected paper
      })
      .catch((error) => {
        console.error('Error adding reviewer:', error);
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
            <div className="paper-title">{paper.paperId || 'No Paper ID'}</div>
            <div className="paper-reviwer">
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
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
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
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Modal-like white form */}
      {showForm && selectedPaper && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="white-form" onClick={(e) => e.stopPropagation()}>
            <h2>Paper Details</h2>
            <p><strong>Paper ID:</strong> {selectedPaper.paperId}</p>
            <p><strong>Reviewer(s):</strong> {selectedPaper.firstName} {selectedPaper.lastName}</p>

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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>
                      <button onClick={() => handleAddReviewer(user.id)}>Select</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="form-actions">
              <button onClick={handleSaveReviewer}>Save</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
