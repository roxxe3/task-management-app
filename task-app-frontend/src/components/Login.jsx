import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import TLogo from "../assets/T-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading, error, setError } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    name: "",
  });
  
  // Add debounce for form submission
  const lastSubmitTime = useRef(0);
  const SUBMIT_DELAY = 2000; // 2 seconds between attempts

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Check if enough time has passed since last attempt
    const now = Date.now();
    if (now - lastSubmitTime.current < SUBMIT_DELAY) {
      setError("Please wait a moment before trying again");
      return;
    }
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      lastSubmitTime.current = now;
      let success;
      
      if (isLoginMode) {
        success = await login(formData.email, formData.password);
        if (success) {
          navigate("/");
        }
      } else {
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }
        
        success = await signup(formData.email, formData.password, formData.name);
        if (success) {
          // Stay on the login page after successful signup
          setIsLoginMode(true);
          setFormData({ email: formData.email, password: "", name: "" });
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
    setFormData({ email: "", password: "", name: "" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="bg-[#2d2d2d] p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={TLogo} alt="Task Manager Logo" className="h-16 w-16 mb-4" />
          <h2 className="text-2xl font-bold text-white text-center">
            {isLoginMode ? "Login to Your Account" : "Create an Account"}
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name (Optional)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Enter your name"
                disabled={isLoading}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              placeholder={isLoginMode ? "Enter your password" : "Choose a password (min. 6 characters)"}
              required
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg font-medium !rounded-button whitespace-nowrap transition-all duration-200 cursor-pointer"
            style={{ 
              backgroundColor: "#caff17", 
              color: "#0d0d0d"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(202, 255, 23, 0.4), 0 2px 4px -1px rgba(202, 255, 23, 0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#caff17";
              e.currentTarget.style.boxShadow = "none";
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                {isLoginMode ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              isLoginMode ? 'Login' : 'Sign Up'
            )}
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer hover:underline"
              disabled={isLoading}
            >
              {isLoginMode 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;