import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Conference.css';

const ConferenceHistory = () => {
  const conferenceDataInitial = [
    {
      id: 1,
      name: "COMP702 Paper Review Conference",
      date: "21/08/2024",
      location: "WZ1101",
      attendees: 10,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg",
    },
    {
      id: 2,
      name: "COMP500 Paper Submission Conference",
      date: "05/10/2024",
      location: "WZ901",
      attendees: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg",
    },
    {
      id: 3,
      name: "Review management conference",
      date: "08/11/2024",
      location: "WZ1103",
      attendees: 3,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg",
    },
    {
      id: 4,
      name: "Meeting for RND",
      date: "10/11/2024",
      location: "WZ1100",
      attendees: 3,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg",
    },
  ];

  const [conferenceData, setConferenceData] = useState(conferenceDataInitial);
  const [usersData, setUsersData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConference, setSelectedConference] = useState(null);
  const [editingConference, setEditingConference] = useState(null); // State for the conference being edited
  const [conferenceAttendees, setConferenceAttendees] = useState({});
  const [conferenceStatuses, setConferenceStatuses] = useState(conferenceDataInitial.map(conference => conference.status));
  const [showAddForm, setShowAddForm] = useState(false); // State to toggle the form
  const [newConference, setNewConference] = useState({
    name: '',
    date: '',
    location: '',
    attendees: 0
  });

  const itemsPerPage = 3;

  useEffect(() => {
    axios.get('http://localhost:8080/users_name')
      .then(response => {
        setUsersData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getRandomAttendees = (attendeeCount, conferenceId) => {
    if (!usersData || usersData.length === 0) return [];
    if (conferenceAttendees[conferenceId]) {
      return conferenceAttendees[conferenceId];
    }

    const shuffledUsers = [...usersData].sort(() => 0.5 - Math.random());
    const selectedAttendees = shuffledUsers.slice(0, attendeeCount);

    setConferenceAttendees(prevState => ({
      ...prevState,
      [conferenceId]: selectedAttendees
    }));

    return selectedAttendees;
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
    setEditingConference(null); // Reset editing state
  };

  const handleAddConference = () => {
    setShowAddForm(!showAddForm); // Toggle form visibility
  };

  const handleNewConferenceChange = (e) => {
    const { name, value } = e.target;
    setNewConference(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewConferenceSubmit = (e) => {
    e.preventDefault();
    const newId = conferenceData.length + 1;
    const newConf = {
      ...newConference,
      id: newId,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg"
    };
    setConferenceData(prev => [...prev, newConf]);
    setConferenceStatuses(prev => [...prev, 'confirmed']); // Set default status as 'confirmed'
    setNewConference({ name: '', date: '', location: '', attendees: 0 });
    setShowAddForm(false); // Hide form after adding
  };

  //edit conference
  const handleEditConference = (conference) => {
    setEditingConference(conference); 
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
    setConferenceData(prev => prev.map(conf => conf.id === editingConference.id ? editingConference : conf));
    setEditingConference(null); // Close the edit form after submitting
  };

  const handleDeleteConference = (conferenceId) => {
    setConferenceData(prev => prev.filter(conf => conf.id !== conferenceId)); // Remove conference
    setEditingConference(null); // Close the form if it was being edited
  };

  const handleModalClose = (e) => {
    if (e.target.className === 'modal') {
      setEditingConference(null); // Close the modal if clicked outside the form
    }
  };

  const renderStatusButton = (status, index) => {
    let backgroundColor = '';
    let label = '';

    if (status === 'confirmed') {
      backgroundColor = 'green';
      label = 'Confirmed';
    } else if (status === 'waiting') {
      backgroundColor = 'yellow';
      label = 'Pending';
    } else {
      backgroundColor = 'red';
      label = 'Cancelled';
    }

    return (
      <button
        onClick={() => handleStatusChange(index)}
        style={{
          backgroundColor,
          border: 'none',
          color: 'black',
          padding: '5px 15px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="conference-container">
      <button className="add-conference-btn" onClick={handleAddConference}>
        + Add new conference
      </button>

      {showAddForm && (
        <form className="add-conference-form" onSubmit={handleNewConferenceSubmit}>
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
            placeholder="Conference Date"
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
          <button type="submit" className="btn btn-primary">Add Conference</button>
        </form>
      )}

      {selectedConference ? (
        <div className="conference-details-form">
          <h2>{selectedConference.name}</h2>
          <div className="conference-details-left">
            <p><strong>Date:</strong> {selectedConference.date}</p>
            <p><strong>Location:</strong> {selectedConference.location}</p>
            <p><strong>Attendees:</strong> {selectedConference.attendees}</p>
          </div>
          <h3>Attendee List:</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {getRandomAttendees(selectedConference.attendees, selectedConference.id).map((attendee, index) => (
                <tr key={index}>
                  <td>{attendee.id}</td>
                  <td>{attendee.firstName}</td>
                  <td>{attendee.lastName}</td>
                  <td>{attendee.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-secondary" onClick={handleBack}>Back</button>
        </div>
      ) : 
      editingConference ? (
        <div className="modal" onClick={handleModalClose}>
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
                value={editingConference.date}
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
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-danger" onClick={() => handleDeleteConference(editingConference.id)}>
                Delete Conference
              </button>
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
                  <p><strong>Date:</strong> {conference.date}</p>
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
