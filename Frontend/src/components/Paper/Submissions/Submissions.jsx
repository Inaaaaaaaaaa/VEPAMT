import React, { useState, useEffect, useCallback } from 'react';
import './Submissions.css';
import axios from 'axios';
import _ from 'lodash';
import PieChart from './PieChart';

const Submissions = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:8080/users_name')
      .then((response) => {
        console.log('Fetched data:', response.data);
        setData(response.data);
        setFilteredPapers(response.data);

        const uniqueCategories = _.uniq(
          response.data.map((paper) => paper.category)
        ).filter(Boolean);
        setCategories(uniqueCategories);

        const counts = _.countBy(response.data, 'submissions_status');
        setStatusCounts(counts);
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

  // Updated handleStatusChange function
  const handleStatusChange = useCallback(
    async (id, newStatus) => {
      if (!newStatus) return; 

      console.log(`Attempting to update status for ID: ${id} to: ${newStatus}`);
      
      try {
        const response = await axios.put(`http://localhost:8080/users_name/${id}/status`, { submissions_status: newStatus });

        // Check for successful response codes
        if (response.status === 200 || response.status === 204) { 
          console.log('Status updated successfully:', response.data);

          setData((prevData) => {
            const updatedData = prevData.map((item) =>
              item.id === id ? { ...item, submissions_status: newStatus } : item
            );

            // Sync filtered data
            setFilteredPapers(updatedData); 

            // Recalculate the status counts after updating
            const updatedCounts = _.countBy(updatedData, 'submissions_status');
            setStatusCounts(updatedCounts);

            return updatedData; // Return the new state for data
          });

          setEditId(null);
          setEditStatus('');
        } else {
          console.error('Unexpected response status:', response.status);
          alert('Failed to update the status. Please try again.');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update the status. Please try again.');
      }
    },
    [data] // Ensure `data` is in the dependency array
  );

  const handleEditStatus = (id, currentStatus) => {
    if (editId !== null) {
      handleStatusChange(id, editStatus); 
    } else {
      setEditId(id);
      setEditStatus(currentStatus);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPapers.slice(indexOfFirstItem, indexOfLastItem);

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

      {/*Import chart into the web page*/}
      <PieChart statusCounts={statusCounts} />

      <div id="papers-container">
        {currentItems.map((paper) => (
          <div key={paper.id} className="paper-card">
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
