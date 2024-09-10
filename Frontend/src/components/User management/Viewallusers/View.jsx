import React, { useEffect, useState } from 'react';
import './View.css';
import axios from 'axios';

const View = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Number of users to display per page max
  const usersPerPage = 24; 

  // Fetch user data from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users_name'); 
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
  }, []);

  // Calculate the index of the first and last user on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate the total number of pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  //previous, next button
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  //main
  return (
    <div className="view-container">
      <h1>All users</h1>
      <div className="user-list">
        {currentUsers.map((user, index) => (
            //generate random profile pics
          <div className="user-card" key={user.id || index}>
            <img
              src={`https://i.pravatar.cc/150?img=${index + 1}`} 
              alt={`${user.firstName} ${user.lastName}'s avatar`}
              className="user-avatar"
            />
            {/*From database*/}
            <div className="user-name">{user.firstName} {user.lastName}</div>
            <div className="user-email">{user.email}</div>
          </div>
        ))}
      </div>

      {/*Buttons to go to the next page*/}
      <div className="pagination-buttons">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default View;
