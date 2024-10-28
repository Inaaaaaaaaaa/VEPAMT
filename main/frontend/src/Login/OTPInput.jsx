import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { RecoveryContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function OTPInput() {
  const { recoveryData, setRecoveryData } = useContext(RecoveryContext);
  const { email, otp } = recoveryData;
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Recovery Context on render:", recoveryData); // Debugging
  }, [recoveryData]);

  function resendOTP() {
    if (disable) return; // If the button is disabled, do nothing

    // Retrieve email from local storage or cookie
    const storedEmail = localStorage.getItem('email') || getCookie('email');

    axios
      .post("http://localhost:8080/forgot_password", { email: storedEmail }) // Use retrieved email
      .then((response) => {
        console.log("Response from server:", response.data); // Debugging
        if (response.data.success) {
          setRecoveryData((prevData) => ({ ...prevData, otp: response.data.otp }));
          setDisable(true); // Disable the button
          setTimer(60); // Reset the timer
        } else {
          console.log("Invalid response:", response.data); // Debugging
        }
      })
      .catch((error) => {
        console.log("Error in resendOTP:", error); // Debugging
      });
  }

  function verifyOTP() {
    const enteredOTP = parseInt(OTPinput.join(""), 10);
    console.log("Entered OTP:", enteredOTP); // Debugging
    console.log("Stored OTP:", otp); // Debugging

    if (enteredOTP === otp) {
      console.log("OTP matched, navigating to reset password page."); // Debugging
      setRecoveryData((prevData) => ({ ...prevData, email })); // Ensure email is set in recoveryData
      navigate("/reset");
    } else {
      alert("The code you have entered is not correct, try again or re-send the link");
    }
  }

  useEffect(() => {
    let interval;
    if (disable) {
      interval = setInterval(() => {
        setTimer((lastTimerCount) => {
          if (lastTimerCount <= 1) {
            clearInterval(interval);
            setDisable(false); // Re-enable the button
          }
          return lastTimerCount > 0 ? lastTimerCount - 1 : lastTimerCount;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [disable]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      let newOTPinput = [...OTPinput];
      newOTPinput[index] = value;
      setOTPinput(newOTPinput);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
      <div className="bg-white px-10 pt-12 pb-12 shadow-xl mx-auto w-full max-w-xl rounded-2xl">
        <div className="mx-auto flex w-full max-w-lg flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="font-semibold text-2xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-lg font-medium text-gray-400">
              <p>We have sent a code to your email {email}</p>
            </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-sm">
                  {OTPinput.map((value, index) => (
                    <div key={index} className="w-20 h-20">
                      <input
                        maxLength="1"
                        className="w-full h-full flex flex-col items-center justify-center text-center px-6 outline-none rounded-xl border border-gray-200 text-2xl bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-6">
                  <div>
                    <button
                      type="button"
                      onClick={verifyOTP}
                      className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-6 bg-blue-700 border-none text-white text-2xl shadow-sm"
                    >
                      Verify Account
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-lg font-medium space-x-2 text-gray-500">
                    <p>Didn't receive code?</p>
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={disable}
                      className={`flex flex-row items-center ${disable ? "text-gray-500" : "text-blue-500"}`}
                      style={{
                        cursor: disable ? "not-allowed" : "pointer",
                        textDecoration: disable ? "none" : "underline",
                      }}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
