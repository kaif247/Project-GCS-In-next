import React, { createContext, useState } from 'react';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: 1, name: 'Kaif Islam', avatar: '/assets/images/user1.jpg', isLoggedIn: true });
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
