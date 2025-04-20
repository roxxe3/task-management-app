import React, { createContext, useState, useContext, useEffect } from "react";
import { API_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/validate-token`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            console.log("Token validation failed, clearing local storage");
            localStorage.removeItem("authToken");
          }
        } catch (error) {
          console.error("Error validating authentication:", error);
          localStorage.removeItem("authToken");
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Check for email verification status in response
        if (data.emailVerified === false) {
          setNeedsEmailVerification(true);
          setVerificationEmail(email);
          setError("Please verify your email before logging in.");
          return false;
        }
        
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError(data.error || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect to the server. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (email, password, name) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // IMPORTANT: Always set email verification needed after signup
        // Don't store token or set authenticated until verification is complete
        setNeedsEmailVerification(true);
        setVerificationEmail(email);
        
        // Show success message
        setError("Account created! Please check your email to verify your account.");
        return true;
      } else {
        setError(data.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to connect to the server. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle successful email verification
  const confirmEmailVerification = async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/auth/confirm-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Email verified successfully
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setNeedsEmailVerification(false);
        setVerificationEmail("");
        return true;
      } else {
        setError(data.error || 'Email verification failed');
        return false;
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setError("Failed to verify email. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!verificationEmail) {
      setError("No email address available to send verification");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationEmail }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return true;
      } else {
        setError(data.error || 'Failed to resend verification email');
        return false;
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      setError("Failed to connect to the server. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearVerificationState = () => {
    setNeedsEmailVerification(false);
    setVerificationEmail("");
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    clearVerificationState();
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      signup,
      logout, 
      isLoading,
      error,
      setError,
      needsEmailVerification,
      verificationEmail,
      resendVerificationEmail,
      clearVerificationState,
      confirmEmailVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);