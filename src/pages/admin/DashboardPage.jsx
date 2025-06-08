// src/pages/admin/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { FaBus } from 'react-icons/fa';
import { FiUsers, FiBox, FiTrendingUp, FiLoader } from 'react-icons/fi';
import api from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx';

// Composant réutilisable pour afficher une carte de statistique
const StatCard = ({ title, value, icon, color, loading }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      <div className={`text-2xl ${color}`}>{icon}</div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <FiLoader className="animate-spin text-2xl text-gray-400" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  // Initialisation de l'état pour les statistiques
  const [stats, setStats] = useState({
    busCount: 0,
    chauffeurCount: 0,
    colisCount: 0,
    reservationCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour charger toutes les statistiques en parallèle
    const fetchStats = async () => {
      try {
        const [busRes, chauffeurRes, colisRes, reservationRes] = await Promise.all([
          api.get('/admin/bus'),
          api.get('/admin/chauffeurs'),
          api.get('/admin/colis'),
          api.get('/admin/reservations/all')
        ]);

        // Mise à jour de l'état avec les données récupérées
        setStats({
          // CORRECTION : On lit directement la longueur du tableau renvoyé par l'API
          busCount: Array.isArray(busRes.data) ? busRes.data.length : 0,
          
          // Sécurisation pour les autres appels
          chauffeurCount: Array.isArray(chauffeurRes.data) ? chauffeurRes.data.length : 0,
          colisCount: Array.isArray(colisRes.data) ? colisRes.data.length : 0,
          reservationCount: Array.isArray(reservationRes.data) ? reservationRes.data.length : 0
        });
        
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques du dashboard:", err);
        setError("Impossible de charger les statistiques. Veuillez rafraîchir la page.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []); // Le tableau de dépendances vide assure que l'appel ne se fait qu'une fois

  // Affichage d'un message d'erreur si un appel API a échoué
  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
      
      {/* Grille des cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Bus au Total" 
          value={stats.busCount} 
          icon={<FaBus />} 
          color="text-blue-500"
          loading={loading}
        />
        <StatCard 
          title="Chauffeurs" 
          value={stats.chauffeurCount} 
          icon={<FiUsers />} 
          color="text-green-500"
          loading={loading}
        />
        <StatCard 
          title="Colis Enregistrés" 
          value={stats.colisCount} 
          icon={<FiBox />} 
          color="text-orange-500"
          loading={loading}
        />
        <StatCard 
          title="Total Réservations" 
          value={stats.reservationCount} 
          icon={<FiTrendingUp />} 
          color="text-purple-500"
          loading={loading}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Bienvenue</h2>
        <p className="text-gray-600">
          Utilisez le menu de gauche pour gérer toutes les facettes de votre activité de transport.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;