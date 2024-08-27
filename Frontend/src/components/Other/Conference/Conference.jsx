import React, { useState } from 'react';
import './Conference.css';

const ConferenceHistory = () => {
  const conferenceData = [
    {
      id: 1,
      name: "COMP702 Paper Review Conference",
      date: "21/08/2024",
      location: "WZ1101",
      attendees: 10,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg"
    },
    {
      id: 2,
      name: "COMP500 Paper Submission Conference",
      date: "05/10/2024",
      location: "WZ901",
      attendees: 4,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg"
    },
    {
      id: 3,
      name: "Review managment conference",
      date: "08/11/2024",
      location: "WZ1103",
      attendees: 3,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/AUT_Logo_New.jpg"
    },

  ];

  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  return (
    <div className="conference-container">
      <div className="conference-list">
        {filteredConferences.map(conference => (
          <div key={conference.id} className="conference-card">
            <img src={conference.image} alt={conference.name} />
            <div className="conference-info">
              <h2>{conference.name}</h2>
              <p><strong>Date:</strong> {conference.date}</p>
              <p><strong>Location:</strong> {conference.location}</p>
              <p><strong>Attendees:</strong> {conference.attendees}</p>
              <div className="conference-actions">
                <button className="btn btn-primary" onClick={() => console.log(`Viewing details for conference ${conference.id}`)}>
                View Details
                </button>
                <button className="btn btn-secondary" onClick={() => console.log(`Editing conference ${conference.id}`)}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button 
          className="btn btn-secondary" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>Previous
        </button>
        <button className="btn btn-primary" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}> Next
        </button>
      </div>
    </div>
  );
};

export default ConferenceHistory;
