// src/pages/admin/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { FaBus } from 'react-icons/fa';
import { FiUsers, FiBox, FiTrendingUp, FiLoader } from 'react-icons/fi';
import api from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx';

// Le composant StatCard est utilisé pour afficher chaque statistique.
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
  // Initialisation des statistiques à 0
  const [stats, setStats] = useState({
    busCount: 0,
    chauffeurCount: 0,
    colisCount: 0,
    reservationCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Lancement de tous les appels en parallèle pour plus d'efficacité
        const [busRes, chauffeurRes, colisRes, reservationRes] = await Promise.all([
          api.get('/admin/bus'),
          api.get('/admin/chauffeurs'),
          api.get('/admin/colis'),
          api.get('/admin/reservations/all')
        ]);

        // Mise à jour de l'état avec des vérifications de sécurité
        setStats({
          // La route des bus renvoie un objet { buses: [...] }, on vérifie donc la longueur du tableau à l'intérieur
          busCount: busRes.data?.buses?.length || 0,
          
          // Les autres routes renvoient directement un tableau, on vérifie si c'est bien le cas
          chauffeurCount: Array.isArray(chauffeurRes.data) ? chauffeurRes.data.length : 0,
          colisCount: Array.isArray(colisRes.data) ? colisRes.data.length : 0,
          reservationCount: Array.isArray(reservationRes.data) ? reservationRes.data.length : 0
        });
        
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques du dashboard:", err);
        setError("Impossible de charger les statistiques. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []); // Ce useEffect ne se lance qu'une seule fois au chargement du composant

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Bus en service" 
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
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Accès Rapides</h2>
        <p className="text-gray-600">
          Bienvenue sur votre tableau de bord. Utilisez le menu de gauche pour naviguer entre les différentes sections de gestion.
        </p>
        {/* Ici, vous pourriez ajouter plus de composants, comme une liste des dernières réservations ou un graphique */}
      </div>
    </div>
  );
};

export default DashboardPage;