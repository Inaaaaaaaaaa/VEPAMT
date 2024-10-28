import React, { useEffect, useState } from 'react';
import './View.css';
import axios from 'axios';

const View = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Track if a user is being edited
  const [newUserFormData, setNewUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roles: ''
  });
  const usersPerPage = 24;

  // Fetch users from backend
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

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle Edit button click
  const handleEditClick = (user) => {
    setEditingUser(user); // Set the user to be edited

    // Pre-fill the form with the existing user data
    setNewUserFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      password: '' 
    });

    // Open the modal
    setIsAddingUser(true);
  };

  // Handle Delete button click
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/users_name/${userId}`);
        setUsers(users.filter(user => user.id !== userId)); // Remove user from the UI
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Handle opening the Add User Modal
  const handleAddUserClick = () => {
    setEditingUser(null); // Reset editingUser when adding a new user
    setNewUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      roles: ''
    });
    setIsAddingUser(true);
  };

  // Handle form input changes for adding/editing a user
  const handleAddUserInputChange = (e) => {
    setNewUserFormData({ ...newUserFormData, [e.target.name]: e.target.value });
  };

  // Handle form submission to add or edit a user
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        firstName: newUserFormData.firstName,
        lastName: newUserFormData.lastName,
        email: newUserFormData.email,
        roles: newUserFormData.roles,
      };

      // Check if we are editing a user
      if (editingUser) {
        try {
          const response = await axios.put(`http://localhost:8080/users_name/${editingUser.id}`, newUser);
          setUsers(users.map(u => (u.id === editingUser.id ? response.data : u)));
        } catch (error) {
          console.error('Error updating user:', error.response ? error.response.data : error.message);
        }
      }
      else {
        // POST request for adding a new user
        newUser.password = 'defaultPassword123'; // Assign a default password for new users
        newUser.lastRegistered = new Date().toISOString(); // Automatically assign registration date

        const response = await axios.post('http://localhost:8080/users_name', newUser);
        // Add the new user to the UI
        setUsers([...users, response.data]);
      }

      // Reset the form and close the modal
      setIsAddingUser(false);
      setNewUserFormData({
        firstName: '',
        lastName: '',
        email: '',
        roles: ''
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Error adding/editing user:', error.response ? error.response.data : error.message);
    }
  };

  // Cancel adding/editing user
  const handleCancelAddUser = () => {
    setIsAddingUser(false);
    setNewUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      roles: ''
    });
    setEditingUser(null);
  };

  return (
    <div className="view-container">
      <h1>All Users</h1>

      {/* Add User Button */}
      <button className="add-user-button" onClick={handleAddUserClick}>
        Add User +
      </button>

      {/* Add/Edit User Modal */}
      {isAddingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleAddUserSubmit}>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={newUserFormData.firstName}
                onChange={handleAddUserInputChange}
                required
              />
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={newUserFormData.lastName}
                onChange={handleAddUserInputChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newUserFormData.email}
                onChange={handleAddUserInputChange}
                required
              />
              <label>Role:</label>
              <input
                type="text"
                name="roles"
                value={newUserFormData.roles}
                onChange={handleAddUserInputChange}
                required
              />
              <div className="button-group">
                <button type="submit">{editingUser ? 'Save Changes' : 'Add User'}</button>
                <button type="button" onClick={handleCancelAddUser}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="user-list">
        {currentUsers.map((user, index) => (
          <div className="user-card" key={user.id || index}>
            <img
              src={`https://i.pravatar.cc/150?img=${index + 1}`}
              alt={`${user.firstName} ${user.lastName}'s avatar`}
              className="user-avatar"
            />
            <div className="user-name">{user.firstName} {user.lastName}</div>
            <div className="user-email">{user.email}</div>

            {/* Edit and Delete buttons */}
            <div className="user-actions">
              <button className="edit-button" onClick={() => handleEditClick(user)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
