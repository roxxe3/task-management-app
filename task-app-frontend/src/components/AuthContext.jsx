import React, { createContext, useState, useContext, useEffect } from "react";
import { API_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

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
        } else {
          console.log("Token validation failed, clearing local storage");
          localStorage.removeItem("authToken");
          setUser(null);
        }
      } catch (error) {
        console.error("Error validating authentication:", error);
        localStorage.removeItem("authToken");
        setUser(null);
      }
    }
    
    setIsLoading(false);
  };

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
        if (data.emailVerified === false) {
          setNeedsEmailVerification(true);
          setVerificationEmail(email);
          setError("Please verify your email before logging in.");
          return false;
        }
        
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
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
        setNeedsEmailVerification(true);
        setVerificationEmail(email);
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

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setError(null);
  };

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
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
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
        setError("Verification email sent! Please check your inbox.");
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        setError,
        needsEmailVerification,
        verificationEmail,
        login,
        signup,
        logout,
        confirmEmailVerification,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};