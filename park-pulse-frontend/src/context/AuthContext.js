import React, { createContext, useState } from 'react';

// 1. Create the Global Brain
export const AuthContext = createContext();

// 2. The Provider wraps your app to share the data
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the profile data
  const [token, setToken] = useState(null); // Holds the security key

  // The function we will call when login succeeds
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};