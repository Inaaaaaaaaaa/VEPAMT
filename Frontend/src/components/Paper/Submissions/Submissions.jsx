import React, { useState, useEffect } from 'react';
import './Submissions.css';
import axios from 'axios';
import _ from 'lodash';
import PieChart from './PieChart';
import SubmittedChart from './SubmittedChart';

const statusOptions = ['Submitted', 'Unsubmitted', 'Pending', 'Rejected'];

const Submissions = () => {
  const [data, setData] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For edit modal
  const [newSubmission, setNewSubmission] = useState({
    firstName: '',
    lastName: '',
    paperName: '',
    status: 'Unsubmitted'
  });
  const [editSubmissionData, setEditSubmissionData] = useState(null); // State for the submission being edited

  // Function to update status counts
  const updateStatusCounts = (papers) => {
    const counts = _.countBy(papers, 'submissionsStatus');
    setStatusCounts(counts);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('submissionData');
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
      setFilteredPapers(parsedData);
      updateStatusCounts(parsedData);
    } else {
      axios
        .get('http://localhost:8080/users_name')
        .then((response) => {
          const papersData = response.data.map((paper) => ({
            ...paper,
            title: paper.title || '',
            firstName: paper.firstName || '',
            lastName: paper.lastName || '',
            submissionsStatus: paper.submissionsStatus || 'Unsubmitted',
            paperId: paper.paperId || '',
          }));
          setData(papersData);
          setFilteredPapers(papersData);
          updateStatusCounts(papersData);

          localStorage.setItem('submissionData', JSON.stringify(papersData));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  // Add new submission
  const saveSubmission = () => {
    const newPaper = {
      id: data.length + 1,
      paperId: newSubmission.paperName,
      firstName: newSubmission.firstName,
      lastName: newSubmission.lastName,
      submissionsStatus: newSubmission.status,
    };

    const updatedData = [...data, newPaper];
    setData(updatedData);
    setFilteredPapers(updatedData);
    updateStatusCounts(updatedData);

    localStorage.setItem('submissionData', JSON.stringify(updatedData));
    setIsModalOpen(false);
  };

  // Delete a submission
  const deleteSubmission = (id) => {
    const updatedData = data.filter((paper) => paper.id !== id);
    setData(updatedData);
    setFilteredPapers(updatedData);
    updateStatusCounts(updatedData);

    localStorage.setItem('submissionData', JSON.stringify(updatedData));
  };

  // Open edit modal with pre-filled data
  const openEditModal = (paper) => {
    setEditSubmissionData(paper); // Set the data of the paper to be edited
    setIsEditModalOpen(true);
  };

  // Save edited submission
  const saveEditedSubmission = () => {
    const updatedData = data.map((paper) =>
      paper.id === editSubmissionData.id ? { ...editSubmissionData } : paper
    );
    setData(updatedData);
    setFilteredPapers(updatedData);
    updateStatusCounts(updatedData);

    localStorage.setItem('submissionData', JSON.stringify(updatedData));
    setIsEditModalOpen(false); // Close edit modal after saving
  };

  return (
    <div className="submission-container">
      <h1>Paper Submissions</h1>

      <div id="chart-container">
        <div className="chart-item">
          <PieChart statusCounts={statusCounts} />
        </div>
        <div className="chart-item">
          <SubmittedChart statusCounts={statusCounts} />
        </div>
      </div>

      <button onClick={() => setIsModalOpen(true)} className="add-submission-btn">Add Submission</button>

      {/* Modal for Adding a Submission */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Submission</h2>
            <div className="modal-form">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={newSubmission.firstName}
                onChange={(e) => setNewSubmission({ ...newSubmission, firstName: e.target.value })}
                placeholder="Enter first name"
              />
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={newSubmission.lastName}
                onChange={(e) => setNewSubmission({ ...newSubmission, lastName: e.target.value })}
                placeholder="Enter last name"
              />
              <label>Paper Name</label>
              <input
                type="text"
                name="paperName"
                value={newSubmission.paperName}
                onChange={(e) => setNewSubmission({ ...newSubmission, paperName: e.target.value })}
                placeholder="Enter paper name"
              />
              <label>Status</label>
              <select
                name="status"
                value={newSubmission.status}
                onChange={(e) => setNewSubmission({ ...newSubmission, status: e.target.value })}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button onClick={saveSubmission}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing a Submission */}
      {isEditModalOpen && editSubmissionData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Submission</h2>
            <div className="modal-form">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={editSubmissionData.firstName}
                onChange={(e) =>
                  setEditSubmissionData({ ...editSubmissionData, firstName: e.target.value })
                }
              />
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={editSubmissionData.lastName}
                onChange={(e) =>
                  setEditSubmissionData({ ...editSubmissionData, lastName: e.target.value })
                }
              />
              <label>Paper Name</label>
              <input
                type="text"
                name="paperName"
                value={editSubmissionData.paperId}
                onChange={(e) =>
                  setEditSubmissionData({ ...editSubmissionData, paperId: e.target.value })
                }
              />
              <label>Status</label>
              <select
                name="status"
                value={editSubmissionData.submissionsStatus}
                onChange={(e) =>
                  setEditSubmissionData({ ...editSubmissionData, submissionsStatus: e.target.value })
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button onClick={saveEditedSubmission}>Save Changes</button>
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div id="papers-container">
        {filteredPapers.map((paper) => (
          <div key={paper.id} className="paper-card">
            <div className="paper-title">{paper.paperId || 'No Paper ID'}</div>
            <div className="paper-author">{paper.firstName} {paper.lastName}</div>
            <div className="paper-status">Status: {paper.submissionsStatus}</div>
            <div className="paper-actions">
              <button onClick={() => openEditModal(paper)}>Edit</button>
              <button onClick={() => deleteSubmission(paper.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions;
