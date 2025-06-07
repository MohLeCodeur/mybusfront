// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Chargement...</div>; // Ou un spinner de chargement
  }

  if (!user) {
    // Redirige vers la page de connexion, en gardant en mémoire la page demandée
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user.role !== 'admin') {
      // Si l'utilisateur n'est pas un admin, on le renvoie à la page d'accueil
      return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;