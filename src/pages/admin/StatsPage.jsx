// src/pages/admin/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FiLoader } from 'react-icons/fi';

const StatsPage = () => {
  const [period, setPeriod] = useState('weekly');
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/admin/stats/revenus?periode=${period}`) // URL CORRIGÉE
      .then(res => {
        const formattedData = res.data.map(item => ({
            ...item,
            total: Number(item.total)
        }));
        setRevenueData(formattedData);
      })
      .catch(err => setError(err.response?.data?.message || 'Erreur de chargement.'))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Statistiques</h1>
      <Card>
        <CardHeader>
          <CardTitle>Revenus des Réservations</CardTitle>
          <p className="text-sm text-gray-500">
            Revenus générés par période.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button variant={period === 'weekly' ? 'default' : 'outline'} onClick={() => setPeriod('weekly')}>7 derniers jours</Button>
            <Button variant={period === 'monthly' ? 'default' : 'outline'} onClick={() => setPeriod('monthly')}>12 derniers mois</Button>
          </div>
          <div className="w-full h-80">
            {loading && <div className="flex items-center justify-center h-full"><FiLoader className="animate-spin text-3xl text-blue-500" /></div>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} FCFA`} />
                  <Legend />
                  <Bar dataKey="total" name="Revenus (FCFA)" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default StatsPage;