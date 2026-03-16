import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

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

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.username.trim()) {
      tempErrors.username = "Username is required";
    } else if (formData.username.toLowerCase() === "admin") {
      tempErrors.username = "Username 'Admin' is reserved";
    }

    if (!formData.email) tempErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) tempErrors.email = "Enter a valid email address";

    if (!formData.password) tempErrors.password = "Password is required";
    else if (!passwordRegex.test(formData.password))
      tempErrors.password = "Must contain 8+ chars, 1 Uppercase, 1 Number, 1 Special char";

    if (formData.confirmPassword !== formData.password)
      tempErrors.confirmPassword = "Passwords do not match";

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
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setIsLoading(true);
      const { confirmPassword, ...submitData } = formData;

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, submitData, {
        headers: { "Content-Type": "application/json" }
      });

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");
        navigate('/verify');
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        toast.error("Server is not responding. Please try again later.");
      } else {
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
            <h1 className="auth-heading">Join the <br /> Adventure</h1>

            {/* <button className="google-wide-btn" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self")}>
            <GoogleLogo />
            <span>Sign up with Google</span>
          </button>

          <div className="divider">
            <span>or</span>
          </div> */}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Full Name"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? "input-error" : ""}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

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

              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "input-error" : ""}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/signin" className="link-bold">Log in</Link>
            </div>
          </div>
        </div>

        {/* Right Panel */}
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

export default Signup;