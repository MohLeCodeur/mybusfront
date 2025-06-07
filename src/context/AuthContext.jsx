// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import api from '../api'; // Important : on importe notre instance configurée

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ... (le reste du code pour fetchUserProfile et logout reste le même)
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
    // Cet appel va maintenant construire l'URL : 'http://localhost:5000/api' + '/auth/login'
    const { data } = await api.post("/auth/login", { email, mot_de_passe: password });
    localStorage.setItem("token", data.token);
    setUser(data);
    return data;
  };
  
  const register = async (userData) => {
      // Cet appel va maintenant construire l'URL : 'http://localhost:5000/api' + '/auth/register'
      const { data } = await api.post("/auth/register", userData);
      localStorage.setItem("token", data.token);
      setUser(data);
      return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  // ...

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;