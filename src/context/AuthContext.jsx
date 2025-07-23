// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data);
    } catch (error) {
      console.error("Échec de la récupération du profil, token invalide ?", error);
      logout();
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, mot_de_passe: password });
    localStorage.setItem("token", data.token);
    setUser(data);
    return data;
  };
  
  const register = async (userData) => {
      // On fait l'appel API. La réponse ne contiendra plus de token.
      const { data } = await api.post("/auth/register", userData);
      // On ne met plus à jour le token ou l'utilisateur ici.
      // On renvoie simplement la réponse, qui contient le message de succès.
      return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;