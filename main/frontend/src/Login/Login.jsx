// import axios from "axios";
// import React, { useContext, useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext, RecoveryContext } from "../App";

// export default function Login() {
//   const { setIsAuthenticated } = useContext(AuthContext);
//   const { setRecoveryData } = useContext(RecoveryContext);
//   const [emailLocal, setEmailLocal] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState('');
//   const emailRef = useRef(null); // Add a ref for the email input
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     if (savedToken) {
//       const tokenExpiry = localStorage.getItem('tokenExpiry');
//       if (new Date().getTime() < tokenExpiry) {
//         setIsAuthenticated(true);
//         navigate('/dashboard');
//       } else {
//         localStorage.removeItem('token');
//         localStorage.removeItem('tokenExpiry');
//         setIsAuthenticated(false);
//       }
//     }
//   }, [navigate, setIsAuthenticated]);

//   function handleLogin(event) {
//     event.preventDefault();

//     axios
//       .post('http://localhost:8080/login', { email: emailLocal, password }) 
//       .then(res => {
//         if (res.data === "Login Successfully") {
//           setIsAuthenticated(true);
//           if (rememberMe) {
//             const token = Math.random().toString(36).substr(2);
//             const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
//             localStorage.setItem('token', token);
//             localStorage.setItem('tokenExpiry', expiryTime);
//           }
//           navigate('/dashboard');
//         } else if (res.data === "Incorrect password") {
//           setError("Your password is incorrect. Please try again.");
//         } else if (res.data === "Email not registered") {
//           setError("This email is not registered. Please check your email or sign up.");
//         } else {
//           setError("An error occurred while trying to login. Please try again later.");
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         setError("An error occurred while trying to login. Please try again later.");
//       });
//   }

//   function handleForgotPassword(event) {
//     event.preventDefault();

//     // Check if the email input is valid
//     if (!emailRef.current.checkValidity()) {
//       emailRef.current.reportValidity(); // This will show the built-in validation message
//       return;
//     }

//     axios
//       .post('http://localhost:8080/forgot_password', { email: emailLocal })
//       .then(res => {
//         if (!isNaN(res.data)) {
//           setRecoveryData({ email: emailLocal, otp: parseInt(res.data, 10) });
//           navigate('/otp');
//         } else {
//           setError("This email is not registered. Please check your email or sign up.");
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         setError("An error occurred while trying to verify your email. Please try again later.");
//       });
//   }

//   return (
//     <div className="h-screen w-screen flex">
//       <div className="flex w-1/2 bg-blue-500 p-8 flex-col justify-center items-start relative">
//         <h2 className="text-5xl font-bold text-white absolute top-8 left-8">Kia Ora, Welcome back</h2>
//         <img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Logo_of_Auckland_University_of_Technology.svg" className="w-2/3 h-auto mt-16 mx-auto" alt="AUT Logo" />
//       </div>
//       <div className="flex w-1/2 bg-white p-8 flex-col justify-center">
//         <h2 className="text-4xl font-bold mb-8 text-center">Login to AUT ScholasticHub</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-8">
//             <label className="block text-2xl text-gray-700">Email Address <span className="text-red-500">*</span></label>
//             <input
//               ref={emailRef} // Attach the ref to the input
//               onChange={(e) => setEmailLocal(e.target.value)}
//               type="email"
//               className="w-full px-4 py-2 text-xl border rounded-lg focus:outline-none focus:border-blue-500"
//               placeholder="abc1234@autuni.ac.nz"
//               value={emailLocal}
//               required
//             />
//           </div>
//           <div className="mb-8">
//             <label className="block text-2xl text-gray-700">Password <span className="text-red-500">*</span></label>
//             <input
//               onChange={(e) => setPassword(e.target.value)}
//               type="password"
//               className="w-full px-4 py-2 text-xl border rounded-lg focus:outline-none focus:border-blue-500"
//               placeholder="Password"
//               value={password}
//               required
//             />
//           </div>
//           {error && <div className="text-red-500 text-2xl mb-8">{error}</div>}
//           <div className="flex justify-between items-center mb-8">
//             <div className="flex items-center">
//               <input type="checkbox" className="h-5 w-5 text-blue-600" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
//               <label className="ml-2 text-2xl text-gray-700">Remember me</label>
//             </div>
//             <button
//               onClick={handleForgotPassword}
//               className="text-2xl text-blue-600"
//             >
//               Forgot password?
//             </button>
//           </div>
//           <div className="mb-8">
//             <button type="submit" className="w-full py-3 px-4 text-2xl bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200">Login</button>
//           </div>
//           <div className="text-center">
//             <p className="text-2xl text-gray-700">Don't have an account? <a href="#!" onClick={() => navigate('/register')} className="text-2xl text-blue-600 hover:underline">Sign up here</a></p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
