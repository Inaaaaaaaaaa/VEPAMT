import React, { useRef, useEffect } from 'react';

const ChangePasswordCell = ({ id, currentPassword, onPasswordChange, onChangePassword, isFocused, setFocus }) => {
  const inputRef = useRef(null);

  // Log when the component receives focus
  useEffect(() => {
    console.log(`isFocused: ${isFocused}, inputRef: ${inputRef.current}`);
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
        value={currentPassword || ''}
        onChange={(e) => {
          console.log(`Password changed for ID ${id}:`, e.target.value);
          onPasswordChange(id, e.target.value);
        }}
        onFocus={() => {
          console.log(`Input focused for ID ${id}`);
          setFocus(id);
        }}
      />
      <button onClick={() => onChangePassword(id)}>Change Password</button>
    </div>
  );
};

export default ChangePasswordCell;
