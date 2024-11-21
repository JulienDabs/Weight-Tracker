import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  // Add other fields as necessary
}

// Define the context value type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the AuthContext and provide default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  checkAuthStatus: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  //const navigate = useNavigate(); 

  // Function to check if the user is authenticated
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/verify-session",
        { withCredentials: true }
      );
      if (response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUser(null);
      //navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, checkAuthStatus, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
