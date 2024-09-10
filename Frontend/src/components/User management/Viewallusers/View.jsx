import React, { useEffect, useState } from 'react';
import './View.css';
import axios from 'axios';

const View = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false); // For tracking if we're adding a new user
  const [newUserFormData, setNewUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roles: ''
  });
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
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

  // Handle opening the edit form
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  };

  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/users_name/${editingUser.id}`, editFormData);
      setEditingUser(null); // Exit edit mode after saving
      const response = await axios.get('http://localhost:8080/users_name');
      setUsers(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Handle adding a new user
  const handleAddUserClick = () => {
    setIsAddingUser(true);
  };

  const handleAddUserInputChange = (e) => {
    setNewUserFormData({ ...newUserFormData, [e.target.name]: e.target.value });
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users_name', {
        firstName: newUserFormData.firstName,
        lastName: newUserFormData.lastName,
        email: newUserFormData.email,
        roles: newUserFormData.roles
      });

      // Refresh users list after adding a new user
      // Add new user to the current list
      setUsers([...users, response.data]); 
      setIsAddingUser(false); // Close the form
      setNewUserFormData({
        firstName: '',
        lastName: '',
        email: '',
        roles: ''
      }); 
      // Reset form fields
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleCancelAddUser = () => {
    setIsAddingUser(false);
    setNewUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      roles: ''
    });
  };

  return (
    <div className="view-container">
      <h1>All Users</h1>

      {/* Add User Button */}
      <button className="add-user-button" onClick={handleAddUserClick}>
        Add users +
      </button>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New User</h2>
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
              <button type="submit">Add User</button>
              <button type="button" onClick={handleCancelAddUser}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

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
              <button
                className="edit-button"
                onClick={() => handleEditClick(user)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingUser && (
        <div className="edit-form-container">
          <h2>Edit User</h2>
          <form onSubmit={handleFormSubmit}>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={editFormData.firstName}
              onChange={handleInputChange}
              required
            />
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={editFormData.lastName}
              onChange={handleInputChange}
              required
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </form>
        </div>
      )}

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
