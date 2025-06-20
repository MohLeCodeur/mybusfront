// src/components/PreloadManager.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Importez les fonctions "lazy" directement depuis App.jsx ou recréez-les ici
// Pour la simplicité, on peut les recréer ici.
const lazyRoutes = [
  () => import('../pages/public/SearchPage.jsx'),
  () => import('../pages/public/ContactPage.jsx'),
  () => import('../pages/public/PublicColisTrackingPage.jsx'),
  () => import('../pages/auth/LoginPage.jsx'),
  () => import('../pages/auth/RegisterPage.jsx'),
  // Ajoutez d'autres routes importantes que vous voulez pré-charger
  () => import('../pages/public/ClientDashboardPage.jsx'),
  () => import('../pages/admin/DashboardPage.jsx'),
];

const PreloadManager = () => {
  const location = useLocation();

  useEffect(() => {
    // On attend un peu que la page principale soit stable
    const timer = setTimeout(() => {
      console.log("🚀 [PreloadManager] Début du pré-chargement des routes en arrière-plan...");
      // On boucle sur nos fonctions "lazy" et on les appelle, ce qui déclenche le téléchargement.
      lazyRoutes.forEach(preloadFunc => {
        preloadFunc();
      });
    }, 2500); // On attend 2.5 secondes avant de commencer le pré-chargement

    return () => clearTimeout(timer); // Nettoyage au cas où le composant est démonté
  }, [location.pathname]); // On pourrait relancer si la route change, mais une seule fois suffit souvent.

  return null; // Ce composant n'affiche rien
};

export default PreloadManager;