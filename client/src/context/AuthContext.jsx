import { createContext, useContext, useState } from "react";
import config from "../lib/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem(config.USER_KEY) || "null"),
  );
  const [token, setToken] = useState(
    () => localStorage.getItem(config.TOKEN_KEY) || null,
  );

  const login = async (email, password) => {
    const res = await fetch(`${config.BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem(config.TOKEN_KEY, data.token);
    localStorage.setItem(config.USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (form) => {
    const res = await fetch(`${config.BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  };

  const logout = () => {
    localStorage.removeItem(config.TOKEN_KEY);
    localStorage.removeItem(config.USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoggedIn: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
