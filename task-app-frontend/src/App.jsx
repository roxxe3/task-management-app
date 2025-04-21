import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import EmailVerification from "./components/EmailVerification";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
// Import our API services
import { fetchTasks, createTask, updateTask, deleteTask } from "./services/taskService";
import { fetchAllCategories } from "./services/categoryService";
// Import config constants
import { DEFAULT_CATEGORIES, PRIORITY_COLORS, CATEGORY_ICONS } from "./config";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Email confirmation component
const EmailConfirmation = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Implement email verification logic here
        navigate("/");
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Verifying your email...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

// Main App component wrapped with AuthProvider
const AppWithAuth = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email/:token" element={<EmailConfirmation />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default AppWithAuth;
