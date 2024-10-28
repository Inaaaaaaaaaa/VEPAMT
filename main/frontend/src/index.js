import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress defaultProps deprecation warnings temporarily
console.error = (() => {
  const original = console.error;
  return (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('defaultProps will be removed')) {
      return;
    }
    original(...args);
  };
})();


// Get the container element from the DOM
const container = document.getElementById('root');

// Create a root and render the app using the new method
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
