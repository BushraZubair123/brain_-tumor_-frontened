import { createContext, useContext, useState } from "react";
import {
  clearSession,
  getStoredUser,
  getToken,
  loginUser,
  registerUser,
  saveSession,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    saveSession(data.access_token, data.user);
    setUser(data.user);
  };

  const register = async (details) => {
    const data = await registerUser(details);
    saveSession(data.access_token, data.user);
    setUser(data.user);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
