import React, { createContext, useState, useContext, useEffect } from "react";
import { API_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      
      if (token) {
        try {
          // Validate token with backend
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
            // Token is invalid or expired
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
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setIsAuthenticated(true);
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
    setIsAuthenticated(false);
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
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);