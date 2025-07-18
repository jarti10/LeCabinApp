// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    if (!token) return;

    api
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        setRole(user.role);
        setUserEmail(user.email);
        const nombre = user.info?.nombre || user.email;
        setUserName(nombre);

        localStorage.setItem("role", user.role);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", nombre);
      })
      .catch(() => {
        logout();
      });
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      username: email, // ✅ aquí es donde debe ir "username"
      password,
    });

    setToken(res.data.access_token);
    localStorage.setItem("token", res.data.access_token);
    // el useEffect se encargará de cargar el resto
  };

  const logout = () => {
    setToken("");
    setRole("");
    setUserEmail("");
    setUserName("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider
      value={{ token, role, userEmail, userName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
