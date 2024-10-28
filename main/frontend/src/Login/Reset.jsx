import React, { useContext, useState } from "react";
import { RecoveryContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Reset() {
  const { recoveryData } = useContext(RecoveryContext);
  const { email } = recoveryData;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function changePassword(event) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    axios.post('http://localhost:8080/reset_password', { email, password: newPassword })
      .then(res => {
        if (res.data === "Password reset successfully") {
          setMessage("Password updated successfully");
          navigate("/recovered");
        } else if (res.data === "Your new password cannot be the same as the old password") {
          setMessage("Your new password cannot be the same as old password");
        } else {
          setMessage(res.data);
        }
      })
      .catch(err => {
        console.error("Error occurred during password reset:", err);
        setMessage('An error occurred');
      });
  }

  return (
    <div>
      <section className="w-screen h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-2xl p-12 bg-white rounded-lg shadow dark:border dark:border-gray-200">
          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl dark:text-gray-900">
            Change Password
          </h2>
          <form className="space-y-8" onSubmit={changePassword}>
            <div>
              <label
                htmlFor="password"
                className="block mb-4 text-xl font-medium text-gray-900 dark:text-gray-900"
              >
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-4 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-4 text-xl font-medium text-gray-900 dark:text-gray-900"
              >
                Confirm password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-4 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3 text-center"
            >
              Reset Password
            </button>
            {message && <div className="text-red-600 text-center text-xl">{message}</div>}
          </form>
        </div>
      </section>
    </div>
  );
}
