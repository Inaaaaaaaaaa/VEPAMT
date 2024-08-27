import React, { useState, useEffect, useCallback } from 'react';
import './Submissions.css';
import axios from 'axios';
import _ from 'lodash';

const Submissions = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredPapers, setFilteredPapers] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    axios
      .get('http://localhost:8080/users_name')
      .then((response) => {
        console.log('Fetched data:', response.data);
        setData(response.data);
        setFilteredPapers(response.data);

        // Extract unique categories
        const uniqueCategories = _.uniq(
          response.data.map((paper) => paper.category)
        ).filter(Boolean); // Remove undefined/null categories
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    filterAndSortPapers();
  }, [searchTerm, category, sortBy, data, currentPage]);

  const filterAndSortPapers = () => {
    let filtered = data.filter((paper) => {
      const title = paper.title ? paper.title.toLowerCase() : '';
      const firstName = paper.firstName ? paper.firstName.toLowerCase() : '';
      const lastName = paper.lastName ? paper.lastName.toLowerCase() : '';
      const searchTermLower = searchTerm.toLowerCase();

      return (
        (title.includes(searchTermLower) ||
          firstName.includes(searchTermLower) ||
          lastName.includes(searchTermLower)) &&
        (category === '' || paper.category === category)
      );
    });

    filtered = _.sortBy(filtered, sortBy);
    setFilteredPapers(filtered);
  };

  //Linking backend with frontend
  const handleStatusChange = useCallback((id, newStatus) => {
    axios
      .put(`http://localhost:8080/submissions/${id}/status`, { status: newStatus })
      .then((response) => {
        console.log('Status updated:', response.data);

        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, submissions_status: newStatus } : item
          )
        );

        setEditId(null);
        setEditStatus('');
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  }, []);

  // Save the status if changed from user
  const handleEditStatus = (id, currentStatus) => {
    if (editId !== null) {
      handleStatusChange(id, editStatus); 
    } else {
      setEditId(id);
      setEditStatus(currentStatus);
    }
  };

  // Calculate current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPapers.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination controls
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <div className="submission-container">
      <h1>Paper submissions</h1>

      <div id="filter-container">
        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} >
          <option value="title">Sort by Paper name</option>
          <option value="author">Sort by Reviewers</option>
        </select>
      </div>

      <div id="papers-container">
        {currentItems.map((paper) => (
          <div key={paper.id} className="paper-card">
            {/* Display Paper ID as Title */}
            <div className="paper-title">{paper.paperId || 'No Paper ID'}</div>
            <div className="paper-author">
              {paper.firstName} {paper.lastName}
            </div>
            <div className="paper-status">
              Status: {paper.submissions_status}
            </div>
            {editId === paper.id ? (
              <div className="edit-status-dialog">
                <input
                  type="text"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                />
                <button onClick={() => handleStatusChange(paper.id, editStatus)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => handleEditStatus(paper.id, paper.submissions_status)}> Edit Status </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}> Previous
        </button>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? 'active' : ''} > {number}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}> Next</button>
      </div>
    </div>
  );
};

export default Submissions;
