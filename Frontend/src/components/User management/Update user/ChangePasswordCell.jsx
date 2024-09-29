import React, { useRef, useEffect, useState } from 'react';

const ChangePasswordCell = ({ id, currentPassword, onPasswordChange, onChangePassword, isFocused, setFocus }) => {
  // State for managing the password
  const [password, setPassword] = useState(currentPassword);
  const inputRef = useRef(null);

  // Effect to handle focus when isFocused changes
  useEffect(() => {
    console.log(`isFocused: ${isFocused}, inputRef: ${inputRef.current}`);
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  // Handle password input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    onPasswordChange(id, value);
  };

  // Handle submitting the password change
  const handleSubmit = () => {
    onChangePassword(id);
  };

  return (
    <div className="change-password-cell">
      <input
        ref={inputRef} // Reference for focus
        type="password"
        placeholder="New Password"
        value={password || ''} // Controlled input state
        onChange={handleInputChange}
        onFocus={() => setFocus(id)} // Sets focus to the current input
        className="password-input"
      />
      <button onClick={handleSubmit} className="change-password-btn">
        Change Password
      </button>
    </div>
  );
};

export default ChangePasswordCell;
