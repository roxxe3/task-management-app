import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import EmailVerification from "./components/EmailVerification";
import EmailConfirmation from "./components/EmailConfirmation";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

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

// Main App component wrapped with AuthProvider
const App = () => (
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
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/verify-email/:token" element={<EmailConfirmation />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
