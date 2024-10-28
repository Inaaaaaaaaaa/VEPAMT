import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext, RecoveryContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setIsAuthenticated, setUserType } = useContext(AuthContext);
  const { setRecoveryData } = useContext(RecoveryContext);
  const [emailLocal, setEmailLocal] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to get cookie values
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const savedEmail = getCookie('email');
    const savedPassword = getCookie('password');
    const isAuthenticated = getCookie('isAuthenticated') === 'true';
    const userType = getCookie('userType');
    const userID = getCookie('userID');

    // If cookies contain valid data, set the state and navigate accordingly
    if (savedEmail && savedPassword && isAuthenticated && userType && userID) {
      setIsAuthenticated(true);
      setUserType(userType);

      // Navigate based on user type
      if (userType === 'author') {
        navigate(`/user/${userID}`);
      } else if (userType === 'reviewer' || userType === 'organizer') {
        navigate(`/`);  // Navigate to root for reviewers and organizers
      }
    }
  }, [setIsAuthenticated, setUserType, navigate]);

  function handleLogin(event) {
    event.preventDefault();

    axios.post('http://localhost:8080/api/users/login', { email: emailLocal, password })
      .then((res) => {
        if (res.data.message === 'Login Successfully') {
          setIsAuthenticated(true);
          setUserType(res.data.userType);
          setRecoveryData(null);

          // Set cookies
          document.cookie = `userID=${res.data.userId}; path=/`;
          document.cookie = `userType=${res.data.userType}; path=/`;
          document.cookie = `isAuthenticated=true; path=/`;

          if (rememberMe) {
            const expiresDate = new Date();
            expiresDate.setDate(expiresDate.getDate() + 7); // 7 days from now
            document.cookie = `email=${emailLocal}; expires=${expiresDate.toUTCString()}; path=/`;
            document.cookie = `password=${password}; expires=${expiresDate.toUTCString()}; path=/`;
            document.cookie = `userID=${res.data.userId}; expires=${expiresDate.toUTCString()}; path=/`;
            document.cookie = `userType=${res.data.userType}; expires=${expiresDate.toUTCString()}; path=/`;
            document.cookie = `isAuthenticated=true; expires=${expiresDate.toUTCString()}; path=/`;
          }

          // Navigate based on user type
          if (res.data.userType === 'author') {
            navigate(`/user/${res.data.userId}`);
          } else if (res.data.userType === 'reviewer' || res.data.userType === 'organizer') {
            navigate(`/`); // Navigate to root for reviewers and organizers
          }
        }
      })
      .catch((err) => {
        const isUnauthorized = err.response && err.response.status === 401;
        setError(isUnauthorized ? 'Incorrect email or password. Please try again.' : 'An error occurred while trying to log in. Please try again later.');
      });
  }

  function handleForgotPassword(event) {
    event.preventDefault();

    axios.post('http://localhost:8080/forgot_password', { email: emailLocal })
      .then((res) => {
        if (res.data.success) {
          setRecoveryData({ email: emailLocal, otp: res.data.otp });
          navigate('/otp-input');
        } else {
          setError(res.data.message || "An error occurred");
        }
      })
      .catch((err) => {
        setError('An error occurred while trying to verify your email. Please try again later.');
      });
  }

  return (
    <div className="h-screen w-screen flex">
      <div className="flex w-1/2 bg-blue-500 p-8 flex-col justify-center items-start relative">
        <h2 className="text-5xl font-bold text-white absolute top-8 left-8">Kia Ora, Welcome back</h2>
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Logo_of_Auckland_University_of_Technology.svg" className="w-2/3 h-auto mt-16 mx-auto" alt="AUT Logo" />
      </div>
      <div className="flex w-1/2 bg-white p-8 flex-col justify-center">
        <h2 className="text-4xl font-bold mb-8 text-center">Login to AUT ScholasticHub</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-8">
            <label className="block text-2xl text-gray-700">Email Address <span className="text-red-500">*</span></label>
            <input
              ref={emailRef}
              onChange={(e) => setEmailLocal(e.target.value)}
              type="email"
              className="w-full px-4 py-2 text-xl border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="abc1234@autuni.ac.nz"
              value={emailLocal}
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-2xl text-gray-700">Password <span className="text-red-500">*</span></label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 text-xl border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Password"
              value={password}
              required
            />
          </div>
          {error && <div className="text-red-500 text-2xl mb-8">{error}</div>}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <input type="checkbox" className="h-5 w-5 text-blue-600" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <label className="ml-2 text-2xl text-gray-700">Remember me</label>
            </div>
            <button onClick={handleForgotPassword} className="text-2xl text-blue-600">Forgot password?</button>
          </div>
          <div className="mb-8">
            <button type="submit" className="w-full py-3 px-4 text-2xl bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200">Login</button>
          </div>
          <div className="text-center">
            <p className="text-2xl text-gray-700">Don't have an account? <a href="#!" onClick={() => navigate('/register')} className="text-2xl text-blue-600 hover:underline">Sign up here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
