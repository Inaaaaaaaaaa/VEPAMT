import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './logo.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Check hardcoded credentials
    if (username === 'Ina' && password === 'helloworld1234') {
      // Call the onLogin function to update authentication state
      onLogin();

      // Store the auth token in localStorage
      localStorage.setItem('authToken', 'dummyToken'); 

      // Navigate to the dashboard
      navigate('/dashboard/submissions'); 
    } else {
      // Alert invalid credentials if they don't match
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        {/* Background set via CSS */}
      </div>
      <div className="login-right">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Welcome Back!</h2>
        <p className="login-details2">Login using your admin account</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
