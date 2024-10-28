import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function UserRegistration() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    // Send registration data to the server
    axios.post('http://localhost:8080/api/users/register', {
      firstName: firstName, // Make sure to use the correct field names matching your backend
      lastName: lastName,
      email,
      username,
      password,
    })
      .then((response) => {
        setMessage(response.data);
        // Navigate to login page after successful registration
        if (response.data === 'User registered successfully!') {
          setIsAuthenticated(false); // Ensure the user is not authenticated
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      })
      .catch((error) => {
        setMessage('An error occurred during registration.');
        console.error('Registration error:', error);
      });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">Sign up</h2>
        <p className="text-center text-lg mb-6">Don't have an account? Sign up using your email.</p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-6">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="first_name" className="block text-lg font-medium text-gray-700">First Name:</label>
                <input type="text" id="first_name" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="w-1/2">
                <label htmlFor="last_name" className="block text-lg font-medium text-gray-700">Last Name:</label>
                <input type="text" id="last_name" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="w-1/2">
                <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="w-1/2">
                <label htmlFor="confirm_password" className="block text-lg font-medium text-gray-700">Confirm Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="flex-1 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Register</button>
              <button type="button" onClick={handleLoginClick} className="flex-1 py-3 text-lg font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500">Have an account? Login</button>
            </div>
            {message && <div className="text-center text-green-600 text-lg mt-4">{message}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserRegistration;
