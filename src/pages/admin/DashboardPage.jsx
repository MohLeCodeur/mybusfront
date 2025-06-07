// src/pages/admin/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { FaBus } from 'react-icons/fa';
import { FiUsers, FiBox, FiTrendingUp } from 'react-icons/fi';
import api from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><div className={`text-2xl ${color}`}>{icon}</div></CardHeader>
    <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
  </Card>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({ busCount: 0, chauffeurCount: 0, colisCount: 0, reservationCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [busRes, chauffeurRes, colisRes, reservationRes] = await Promise.all([
          api.get('/admin/bus'), // URL CORRIGÉE
          api.get('/admin/chauffeurs'), // URL CORRIGÉE
          api.get('/admin/colis'), // URL CORRIGÉE
          api.get('/admin/reservations/all') // URL CORRIGÉE
        ]);
        setStats({
          busCount: busRes.data.length,
          chauffeurCount: chauffeurRes.data.length,
          colisCount: colisRes.data.length,
          reservationCount: reservationRes.data.length
        });
      } catch (error) {
        console.error("Erreur stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de Bord</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Bus en service" value={stats.busCount} icon={<FaBus />} color="text-blue-500" />
        <StatCard title="Chauffeurs" value={stats.chauffeurCount} icon={<FiUsers />} color="text-green-500" />
        <StatCard title="Colis" value={stats.colisCount} icon={<FiBox />} color="text-orange-500" />
        <StatCard title="Réservations" value={stats.reservationCount} icon={<FiTrendingUp />} color="text-purple-500" />
      </div>
    </div>
  );
};
export default DashboardPage;