import React, { useState, useEffect } from 'react';
import './Review.css';
import axios from 'axios';
import _ from 'lodash';
import Select from 'react-select';

const Review = () => {
  const [data, setData] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [saveMessage, setSaveMessage] = useState(''); // To display save confirmation
  const itemsPerPage = 6;

  useEffect(() => {
    axios.get('http://localhost:8080/users_name')
      .then((response) => {
        const papersData = response.data.map((paper) => ({
          ...paper,
          status: paper.status || 'Unassigned'
        }));
        setData(papersData);
        setFilteredPapers(papersData);
        localStorage.setItem('reviewData', JSON.stringify(papersData));
      })
      .catch((error) => console.error('Error fetching papers data:', error));
  }, []);

  useEffect(() => {
    filterAndSortPapers();
  }, [searchTerm, reviewStatusFilter, sortBy, data]);

  const reviewStatusOptions = [
    { value: 'Assigned', label: 'Assigned' },
    { value: 'Unassigned', label: 'Unassigned' },
    { value: 'Pending', label: 'Pending' },
  ];

  const filterAndSortPapers = () => {
    let filtered = data.filter((paper) => {
      const title = (paper.title || '').toLowerCase();
      const firstName = (paper.firstName || '').toLowerCase();
      const lastName = (paper.lastName || '').toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch = title.includes(searchTermLower) || 
                            firstName.includes(searchTermLower) || 
                            lastName.includes(searchTermLower);
      
      const matchesStatus = reviewStatusFilter.length === 0 || reviewStatusFilter.includes(paper.status);
      
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'ascFirst') {
      filtered.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
    } else if (sortBy === 'descFirst') {
      filtered.sort((a, b) => (b.firstName || '').localeCompare(a.firstName || ''));
    } else if (sortBy === 'ascLast') {
      filtered.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
    } else if (sortBy === 'descLast') {
      filtered.sort((a, b) => (b.lastName || '').localeCompare(a.lastName || ''));
    }

    setFilteredPapers(filtered);
  };

  const handleSave = () => {
    const updatedData = selectedPaper.id
      ? data.map((paper) => (paper.id === selectedPaper.id ? selectedPaper : paper))
      : [...data, { ...selectedPaper, id: _.uniqueId() }];
    
    setData(updatedData);
    setFilteredPapers(updatedData);
    localStorage.setItem('reviewData', JSON.stringify(updatedData));
    
    setSaveMessage('Changes have been saved successfully!'); // Show confirmation message
    setTimeout(() => setSaveMessage(''), 3000); // Clear message after 3 seconds
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPapers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);

  return (
    <div className="review-container">
      <h1>Paper Reviews</h1>

      <button
        className="add-review-button"
        onClick={() => {
          setShowForm(true);
          setSelectedPaper({ paper_id: '', firstName: '', lastName: '', status: 'Unassigned', reviewer: '' });
          setIsEditing(true);
          setSaveMessage(''); // Clear save message when opening a new form
        }}
      >
        Add Review
      </button>

      {/* Filter Options */}
      <div className="filter-options">
        <Select
          options={reviewStatusOptions}
          isMulti
          onChange={(options) => setReviewStatusFilter(options.map((o) => o.value))}
          placeholder="Filter by Status"
          className="status-filter"
        />
      </div>

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
                onClick={() => {
                  setSelectedPaper(paper);
                  setShowForm(true);
                  setIsEditing(false);
                  setSaveMessage(''); // Clear save message when opening an existing form
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? 'active' : ''}>
            {number}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Form for viewing/editing selected paper details */}
      {showForm && selectedPaper && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPaper.id ? 'Edit Review' : 'Add Review'}</h2>
            <div className="modal-form">
              <label>Paper Name:</label>
              <input type="text" name="paper_id" value={selectedPaper.paper_id || ''} onChange={(e) => setSelectedPaper({ ...selectedPaper, paper_id: e.target.value })} readOnly={!isEditing} />
              <label>First Name:</label>
              <input type="text" name="firstName" value={selectedPaper.firstName || ''} onChange={(e) => setSelectedPaper({ ...selectedPaper, firstName: e.target.value })} readOnly={!isEditing} />
              <label>Last Name:</label>
              <input type="text" name="lastName" value={selectedPaper.lastName || ''} onChange={(e) => setSelectedPaper({ ...selectedPaper, lastName: e.target.value })} readOnly={!isEditing} />
              <label>Review Status:</label>
              <select name="status" value={selectedPaper.status || 'Unassigned'} onChange={(e) => setSelectedPaper({ ...selectedPaper, status: e.target.value })} disabled={!isEditing}>
                <option value="Assigned">Assigned</option>
                <option value="Unassigned">Unassigned</option>
                <option value="Pending">Pending</option>
              </select>
              <label>Reviewed By:</label>
              <input type="text" name="reviewer" value={selectedPaper.reviewer || ''} onChange={(e) => setSelectedPaper({ ...selectedPaper, reviewer: e.target.value })} readOnly={!isEditing} />
              <div className="modal-actions">
                {isEditing ? <button onClick={handleSave}>Save</button> : <button onClick={() => setIsEditing(true)}>Edit</button>}
                <button onClick={() => setShowForm(false)}>Close</button>
              </div>
              {saveMessage && <p className="save-message">{saveMessage}</p>} {/* Display save message */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
