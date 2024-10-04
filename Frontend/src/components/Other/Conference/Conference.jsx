import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Conference.css';

const ConferenceHistory = () => {
  const conferenceDataInitial = [
    {
      id: 1,
      name: "COMP702 Paper Review Conference",
      date: "2024-08-21", // Use 'yyyy-mm-dd' for input compatibility
      location: "WZ1101",
      attendees: 10,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg",
      attendeesList: [],
    },
    {
      id: 2,
      name: "COMP500 Paper Submission Conference",
      date: "2024-10-05",
      location: "WZ901",
      attendees: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg",
      attendeesList: [],
    },
    {
      id: 3,
      name: "Review management conference",
      date: "2024-11-08",
      location: "WZ1103",
      attendees: 3,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg",
      attendeesList: [],
    },
    {
      id: 4,
      name: "Meeting for RND",
      date: "2024-11-10",
      location: "WZ1100",
      attendees: 3,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg",
      attendeesList: [],
    },
  ];

  const [conferenceData, setConferenceData] = useState(conferenceDataInitial);
  const [usersData, setUsersData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConference, setSelectedConference] = useState(null);
  const [editingConference, setEditingConference] = useState(null);
  const [editingAttendees, setEditingAttendees] = useState([]);
  const [conferenceStatuses, setConferenceStatuses] = useState(conferenceDataInitial.map(() => 'confirmed'));
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConference, setNewConference] = useState({
    name: '',
    date: '',
    location: '',
    attendees: 0
  });
  const [selectedAttendees, setSelectedAttendees] = useState([]);

  const itemsPerPage = 3;

  useEffect(() => {
    // Fetch the users data for attendees
    axios.get('http://localhost:8080/users_name')
      .then(response => {
        setUsersData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      
    // Load saved conference data from localStorage
    const savedConferenceData = localStorage.getItem('conferenceData');
    if (savedConferenceData) {
      setConferenceData(JSON.parse(savedConferenceData));
    }
  }, []);

  // Save conference data to localStorage
  const saveConferenceData = (data) => {
    try {
      localStorage.setItem('conferenceData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleStatusChange = (index) => {
    const newStatuses = [...conferenceStatuses];
    if (newStatuses[index] === 'confirmed') {
      newStatuses[index] = 'waiting';
    } else if (newStatuses[index] === 'waiting') {
      newStatuses[index] = 'cancelled';
    } else {
      newStatuses[index] = 'confirmed';
    }
    setConferenceStatuses(newStatuses);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filterConferences = () => {
    return conferenceData.filter(conference => 
      conference.name.toLowerCase().includes(searchInput) ||
      conference.location.toLowerCase().includes(searchInput)
    );
  };

  const updatePagination = () => {
    const filteredConferences = filterConferences();
    const totalPages = Math.ceil(filteredConferences.length / itemsPerPage);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      filteredConferences: filteredConferences.slice(start, end),
      totalPages
    };
  };

  const { filteredConferences, totalPages } = updatePagination();

  const handleViewDetails = (conference) => {
    setSelectedConference(conference);
  };

  const handleBack = () => {
    setSelectedConference(null);
    setEditingConference(null);
    setEditingAttendees([]);
  };

  const handleAddConference = () => {
    setShowAddForm(!showAddForm);
  };

  const handleNewConferenceChange = (e) => {
    const { name, value } = e.target;
    setNewConference(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle attendee selection
  const handleAttendeeSelect = (index, e) => {
    const updatedAttendees = [...selectedAttendees];
    updatedAttendees[index] = e.target.value;
    setSelectedAttendees(updatedAttendees);
  };

  // Handle attendee selection in edit form
  const handleEditAttendeeSelect = (index, e) => {
    const updatedAttendees = [...editingAttendees];
    updatedAttendees[index] = e.target.value;
    setEditingAttendees(updatedAttendees);
  };

  // Handle new conference submission
  const handleNewConferenceSubmit = (e) => {
    e.preventDefault();
    const newId = conferenceData.length + 1;

    const newConf = {
      ...newConference,
      id: newId,
      date: formatDate(newConference.date),
      attendeesList: selectedAttendees,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg"
    };

    const updatedData = [...conferenceData, newConf];
    setConferenceData(updatedData);
    setConferenceStatuses(prev => [...prev, 'confirmed']);
    setNewConference({ name: '', date: '', location: '', attendees: 0 });
    setSelectedAttendees([]);
    setShowAddForm(false);

    saveConferenceData(updatedData);
  };

  // Handle editing a conference
  const handleEditConference = (conference) => {
    setEditingConference(conference); 
    setEditingAttendees(conference.attendeesList || []);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingConference(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedData = conferenceData.map(conf => 
      conf.id === editingConference.id 
        ? { ...editingConference, date: formatDate(editingConference.date), attendeesList: editingAttendees }
        : conf
    );
    setConferenceData(updatedData);
    setEditingConference(null);
    setEditingAttendees([]);

    saveConferenceData(updatedData);
  };

  // Handle deleting a conference
  const handleDeleteConference = (conferenceId) => {
    const updatedData = conferenceData.filter(conf => conf.id !== conferenceId);
    setConferenceData(updatedData);
    setEditingConference(null);
    setEditingAttendees([]);

    saveConferenceData(updatedData);
  };

  // Generate status button for each conference
  const renderStatusButton = (status, index) => {
    let backgroundColor = '';
    let label = '';

    if (status === 'confirmed') {
      backgroundColor = 'green';
      label = 'Confirmed';
    } else if (status === 'waiting') {
      backgroundColor = '#b8860b';
      label = 'Pending';
    } else {
      backgroundColor = 'red';
      label = 'Cancelled';
    }

    return (
      <button
        onClick={() => handleStatusChange(index)}
        className="status-btn"
        style={{ backgroundColor }}
      >
        {label}
      </button>
    );
  };

  // Generate page number buttons
  const renderPageNumbers = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return pageNumbers.map((number) => (
      <button
        key={number}
        className={`btn ${currentPage === number ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="conference-container">
      <button className="add-conference-btn" onClick={handleAddConference}>
        + Add new conference
      </button>

      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Conference</h2>
            <form onSubmit={handleNewConferenceSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Conference Name"
                value={newConference.name}
                onChange={handleNewConferenceChange}
                required
              />
              <input
                type="date"
                name="date"
                value={newConference.date}
                onChange={handleNewConferenceChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Conference Location"
                value={newConference.location}
                onChange={handleNewConferenceChange}
                required
              />
              <input
                type="number"
                name="attendees"
                placeholder="Number of Attendees"
                value={newConference.attendees}
                onChange={handleNewConferenceChange}
                required
              />
              
              <div className="attendee-select-container">
                {Array.from({ length: newConference.attendees }).map((_, index) => (
                  <select
                    key={index}
                    value={selectedAttendees[index] || ''}
                    onChange={(e) => handleAttendeeSelect(index, e)}
                    required
                  >
                    <option value="">Select Attendee</option>
                    {usersData.map((user) => (
                      <option key={user.id} value={`${user.firstName} ${user.lastName}`}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
              
              <div className="button-group">
                <button type="submit" className="btn btn-primary">Add Conference</button>
                <button type="button" className="btn btn-secondary" onClick={handleAddConference}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedConference ? (
        <div className="view-details-container">
          <h2>{selectedConference.name}</h2>
          <div className="view-details-content">
            <div className="view-details-section">
              <p><strong>Date:</strong> {formatDate(selectedConference.date)}</p>
              <p><strong>Location:</strong> {selectedConference.location}</p>
              <p><strong>Number of Attendees:</strong> {selectedConference.attendees}</p>
              <div className="view-details-attendees">
                <h3>Attendee Names</h3>
                <ul>
                  {selectedConference.attendeesList && selectedConference.attendeesList.map((attendee, index) => (
                    <li key={index}>{attendee}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={handleBack}>Back</button>
        </div>
      ) : 
      editingConference ? (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Conference</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="name"
                value={editingConference.name}
                onChange={handleEditChange}
                required
              />
              <input
                type="date"
                name="date"
                value={editingConference.date.split('/').reverse().join('-')}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="location"
                value={editingConference.location}
                onChange={handleEditChange}
                required
              />
              <input
                type="number"
                name="attendees"
                value={editingConference.attendees}
                onChange={handleEditChange}
                required
              />

              <div className="attendee-select-container">
                {Array.from({ length: editingConference.attendees }).map((_, index) => (
                  <select
                    key={index}
                    value={editingAttendees[index] || ''}
                    onChange={(e) => handleEditAttendeeSelect(index, e)}
                    required
                  >
                    <option value="">Select Attendee</option>
                    {usersData.map((user) => (
                      <option key={user.id} value={`${user.firstName} ${user.lastName}`}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                ))}
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-danger" onClick={() => handleDeleteConference(editingConference.id)}>
                  Delete Conference
                </button>
              </div>
              <button type="button" className="btn btn-secondary" onClick={handleBack}>Cancel</button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="conference-list">
            {filteredConferences.map((conference, index) => (
              <div key={conference.id} className="conference-card">
                <img src={conference.image} alt={conference.name} />
                <div className="conference-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '10px' }}>{conference.name}</h2>
                    {renderStatusButton(conferenceStatuses[index], index)}
                  </div>
                  <p><strong>Date:</strong> {formatDate(conference.date)}</p>
                  <p><strong>Location:</strong> {conference.location}</p>
                  <p><strong>Attendees:</strong> {conference.attendees}</p>

                  <div className="conference-actions">
                    <button className="btn btn-primary" onClick={() => handleViewDetails(conference)}>
                      View Details
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleEditConference(conference)}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination-conference">
            <button 
              className="btn btn-secondary" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>Previous
            </button>
            {renderPageNumbers()}
            <button className="btn btn-primary" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}>Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceHistory;
