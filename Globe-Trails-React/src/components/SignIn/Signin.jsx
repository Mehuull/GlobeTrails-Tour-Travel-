// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   User,
//   CheckCircle,
//   XCircle,
//   ArrowLeft,
//   Plane,
// } from "lucide-react";
// import topical from "../../assets/topical.jpg";
// import Lottie1 from "../../assets/lottie1.json";
// import Lottie from "lottie-react";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../../redux/authSlice";

// const Signin = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); // 'success' or 'error'
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [signInData, setSignInData] = useState({
//     emailOrUsername: "",
//     password: "",
//   });

//   // Validation functions
//   const validateEmail = (emailOrUsername) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(emailOrUsername);
//   };

//   // Handle sign in
//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     if (!signInData.emailOrUsername || !signInData.password) {
//       setMessage("Email and password are required");
//       setMessageType("error");
//       setLoading(false);
//       return;
//     }

//     if (!validateEmail(signInData.emailOrUsername)) {
//       setMessage("Please enter a valid email address");
//       setMessageType("error");
//       setLoading(false);
//       return;
//     }

//     try {
//       // API call to backend
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signin`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           emailOrUsername: signInData.emailOrUsername,
//           password: signInData.password,
//         }),
//       });

//       const data = await response.json();

//       console.log("Request body:", {
//         emailOrUsername: signInData.emailOrUsername,
//         password: signInData.password,
//       });
//       console.log("Response from server:", data);

//       if (response.ok) {
//         setMessage("Successfully signed in!");
//         setMessageType("success");
//         setSignInData({ emailOrUsername: "", password: "" });
//         //when login is successful
//         dispatch(
//           loginSuccess({
//             user: data.user,
//             token: data.token,
//           })
//         );
//       } else {
//         console.log("enter else block");
//         setMessage(data.message || "Invalid credentials");
//         setMessageType("error");
//       }
//     } catch (error) {
//       console.error("Login Error:", error);
//       }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//       <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//         {/* Lottie Left Side (Hidden on small devices) */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-blue-500 to-indigo-500 relative items-center justify-center p-8">
//           <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-0" />
//           <Lottie
//             animationData={Lottie1}
//             loop={true}
//             className="w-full max-w-md z-10"
//           />
//           <div className="absolute bottom-8 left-8 z-10 text-white">
//             <h1 className="text-4xl font-bold leading-tight mb-2">
//               We explore the new
//               <br />
//               life much better
//             </h1>
//             <p className="text-lg opacity-90">Come to Malang with us!</p>
//           </div>
//         </div>

//         {/* Right Side Form */}
//         <div className="w-full lg:w-1/2 p-6 sm:p-8">
//           {/* Message Display */}
//           {message && (
//             <div
//               className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
//                 messageType === "success"
//                   ? "bg-green-50 text-green-700 border border-green-200"
//                   : "bg-red-50 text-red-700 border border-red-200"
//               }`}
//             >
//               {messageType === "success" ? (
//                 <CheckCircle size={16} />
//               ) : (
//                 <XCircle size={16} />
//               )}
//               <span className="text-sm">{message}</span>
//             </div>
//           )}

//           <div className="space-y-6">
//             console.log("Rendering email input");
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type="email"
//                   value={signInData.emailOrUsername}
//                   name="emailOrUsername"
//                   onChange={(e) =>
//                     setSignInData((prev) => ({
//                       ...prev,
//                       emailOrUsername: e.target.value,
//                     }))
//                   }
//                   className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>
//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={signInData.password}
//                   onChange={(e) =>
//                     setSignInData({ ...signInData, password: e.target.value })
//                   }
//                   className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>
//             {/* Forgot Password */}
//             <div className="text-right">
//               <button className="text-sm text-blue-600 hover:text-blue-800">
//                 Forgot Password?
//               </button>
//             </div>
//             {/* Sign In Button */}
//             <button
//               onClick={handleSignIn}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Signing In...
//                 </div>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//             {/* Demo Credentials */}
//             <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//               <p className="font-medium mb-1">Demo Credentials:</p>
//               <p>Email: demo@example.com</p>
//               <p>Password: Demo123!</p>
//             </div>
//             {/* Sign Up Link */}
//             <div className="text-center">
//               <p className="text-sm text-gray-600">
//                 Don't have an account?{" "}
//                 <button
//                   onClick={() => {
//                     navigate("/signup");
//                     setMessage("");
//                   }}
//                   className="text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Sign up here
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getData } from '../../context/userContext';
import './Signin.css';

// Standard Google G Logo SVG
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.769 -21.864 51.959 -21.864 51.129 C -21.864 50.299 -21.734 49.489 -21.484 48.729 L -21.484 45.639 L -25.464 45.639 C -26.284 47.269 -26.754 49.129 -26.754 51.129 C -26.754 53.129 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.769 C -12.984 43.769 -11.404 44.369 -10.154 45.579 L -6.904 42.329 C -8.964 40.419 -11.664 39.019 -14.754 39.019 C -19.444 39.019 -23.494 41.719 -25.464 45.639 L -21.484 48.729 C -20.534 45.879 -17.884 43.769 -14.754 43.769 Z" />
    </g>
  </svg>
);

const Signin = () => {
  const { setUser } = getData();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) tempErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) tempErrors.email = "Please enter a valid email";

    if (!formData.password) tempErrors.password = "Password is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, formData, {
        headers: { "Content-Type": "application/json" }
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("accessToken", res.data.accessToken);

        if (res.data.user.role === "Admin") {
          navigate('/adminpanel');
        } else {
          navigate('/');
        }

        toast.success("Successfully logged in!");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // Server responded with a status code outside of the 2xx range
        toast.error(error.response.data.message || "Invalid credentials");
      } else if (error.request) {
        // Request was made but no response was received (e.g., server down)
        toast.error("Server is not responding. Please try again later.");
      } else {
        // Something else happened in setting up the request
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-content">
            <div className="logo">GlobeTrails</div>
            <h1 className="auth-heading">Start your <br /> perfect trip</h1>

            {/* New Standard Google Button */}
            <button className="google-wide-btn" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self")}>
              <GoogleLogo />
              <span>Continue with Google</span>
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Password Group with fixed Eye Alignment */}
              <div className="form-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="forgot-pass">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Start"}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account? <Link to="/signup" className="link-bold">Sign up</Link>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="image-overlay">
            <div className="location-card card-1">
              <div className="icon-circle">🏠</div>
              <div className="card-text">
                <span className="card-title">Garsia Village</span>
                <span className="card-subtitle">Villa Mexico</span>
              </div>
            </div>

            <div className="location-card card-2">
              <div className="card-text">
                <span className="card-subtitle">1,2 km</span>
                <span className="card-desc">left to your accommodation</span>
              </div>
            </div>

            <div className="location-card card-3">
              <span className="card-title">Gringo Trail</span>
            </div>

            <svg className="path-line" viewBox="0 0 500 800">
              <path d="M100,100 Q200,300 150,600" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;