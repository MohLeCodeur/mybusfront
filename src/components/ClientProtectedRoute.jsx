// src/components/ClientProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ClientProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // Affiche un état de chargement pendant que le contexte vérifie l'utilisateur
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!user) {
    // Si l'utilisateur n'est pas connecté, le redirige vers la page de connexion.
    // 'state={{ from: location }}' permet de le renvoyer à cette page après connexion.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur est connecté (client ou admin), on affiche la page demandée.
  return children;
};

export default ClientProtectedRoute;