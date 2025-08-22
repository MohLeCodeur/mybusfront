// src/pages/admin/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBus } from 'react-icons/fa';
import { FiUsers, FiBox, FiTrendingUp, FiLoader, FiArrowRight } from 'react-icons/fi';
import api from '../../api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx';

// --- LE COMPOSANT STATCARD CORRIGÉ ---
const StatCard = ({ title, value, icon, link, loading }) => (
    <Link to={link} className="block group">
        <Card className="h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent className="flex-grow">
                {loading ? (
                    <FiLoader className="animate-spin text-2xl text-gray-300" />
                ) : (
                    <div className="text-3xl font-bold text-gray-800">{value}</div>
                )}
                <p className="text-xs text-gray-400 mt-1 group-hover:text-blue-500 transition-colors">
                    Voir les détails <FiArrowRight className="inline transition-transform group-hover:translate-x-1"/>
                </p>
            </CardContent>
        </Card>
    </Link>
);


const DashboardPage = () => {
  const [stats, setStats] = useState({ busCount: 0, chauffeurCount: 0, colisCount: 0, reservationCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats/overview');
        setStats(data);
      } catch (err) {
        setError("Impossible de charger les données du tableau de bord.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de l'activité de MyBus.</p>
      </div>
      
      {error && <p className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Bus au Total" 
          value={stats.busCount} 
          icon={<FaBus className="text-2xl text-blue-400"/>} 
          link="/admin/bus"
          loading={loading}
        />
        <StatCard 
          title="Chauffeurs" 
          value={stats.chauffeurCount} 
          icon={<FiUsers className="text-2xl text-green-400"/>}
          link="/admin/chauffeurs"
          loading={loading}
        />
        <StatCard 
          title="Colis Enregistrés" 
          value={stats.colisCount} 
          icon={<FiBox className="text-2xl text-orange-400"/>}
          link="/admin/colis"
          loading={loading}
        />
        <StatCard 
          title="Total Réservations" 
          value={stats.reservationCount} 
          icon={<FiTrendingUp className="text-2xl text-pink-400"/>}
          link="/admin/reservations"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
             <h2 className="font-bold text-lg text-gray-700 mb-4">Prochaines Étapes</h2>
             <p className="text-sm text-gray-600">
                Bienvenue sur votre centre de contrôle. Utilisez le menu de gauche pour gérer chaque aspect de votre flotte et de vos opérations. Vous pouvez commencer par ajouter un nouveau trajet ou vérifier les dernières réservations.
             </p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-blue-500 p-6 rounded-2xl shadow-lg text-white">
            <h2 className="font-bold text-lg mb-2">Statistiques Complètes</h2>
            <p className="text-sm opacity-80 mb-4">Analysez vos revenus et vos performances en détail.</p>
            <Link to="/admin/stats" className="inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition">
                Voir les stats <FiArrowRight className="inline"/>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;