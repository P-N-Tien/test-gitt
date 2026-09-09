import React, { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Restore session from localStorage on page reload
    const token = localStorage.getItem("jwt_token");
    const username = localStorage.getItem("jwt_username");
    const role = localStorage.getItem("jwt_role");
    if (token && username && role) return { token, username, role };
    return null;
  });

  const login = useCallback(async (username, password) => {
    const { data } = await authApi.login(username, password);
    localStorage.setItem("jwt_token", data.token);
    localStorage.setItem("jwt_username", data.username);
    localStorage.setItem("jwt_role", data.role);
    setUser({ token: data.token, username: data.username, role: data.role });

    // Auto-logout when token expires
    setTimeout(() => {
      logout();
    }, data.expiresIn * 1000);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("jwt_username");
    localStorage.removeItem("jwt_role");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER" || isAdmin;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
