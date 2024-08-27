/*Fixes the input box so user does not need to keep clicking on the box to input*/
import React, { useRef, useEffect } from 'react';

const ChangePasswordCell = ({ id, currentPassword, onPasswordChange, onChangePassword, isFocused, setFocus }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div>
      <input
        ref={inputRef}
        type="password"
        placeholder="New Password"
        value={currentPassword}
        onChange={(e) => onPasswordChange(id, e.target.value)}
        // Set focus to the current input field
        onFocus={() => setFocus(id)}  
      />
      <button onClick={() => onChangePassword(id)}>Change Password</button>
    </div>
  );
};

export default ChangePasswordCell;
