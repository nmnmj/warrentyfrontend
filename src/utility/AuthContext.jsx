import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { showToast } from "./Toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Fetch user data from backend
  const fetchUser = async () => {
    try {
      // Assuming you have a backend endpoint that returns the current user info
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
        withCredentials: true,
      });
      console.log("user")
      console.log(res.data.user)

      setUser(res.data.user);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login: Redirect to the Google login route on your backend
  const login = () => {
    // window.location.href = `${import.meta.env.VITE_API_URL}/google/login`; // Adjust URL if needed
    const googleSignInWindow = window.open(
      `${import.meta.env.VITE_API_URL}/google/login`,
      'googleSignInWindow',
      'width=500,height=600'
    ) ?? window;

    window.addEventListener('message', async (event) => {
      console.log(event.data)
      console.log(event.data.displayName)
      
        if (event.data.id != null) {
          setUser(event.data)
          showToast('success', 'Successfully Logged In');
        }
    }
    )
  };

  // Logout: Calls backend logout route and clears user state
  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/google/logout`, {
        withCredentials: true,
      });
      setUser(null);
      showToast('success', 'Successfully Logged Out');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
