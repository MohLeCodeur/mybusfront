// src/pages/admin/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FiLoader, FiDollarSign, FiPackage, FiClipboard } from 'react-icons/fi';

// Composant pour les cartes de statistiques (KPIs)
const StatCard = ({ title, value, icon, loading }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {loading ? 
                <FiLoader className="animate-spin text-2xl text-gray-400" /> :
                <div className="text-2xl font-bold">{value}</div>
            }
        </CardContent>
    </Card>
);

const StatsPage = () => {
  const [period, setPeriod] = useState('weekly');
  
  const [summary, setSummary] = useState({ 
      totalRevenue: 0, 
      totalRevenueBillets: 0, 
      totalRevenueColis: 0 
  });
  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    
    api.get(`/admin/stats/revenus?periode=${period}`)
      .then(res => {
        if (res.data && res.data.summary && res.data.chartData) {
            setSummary(res.data.summary);
            setChartData(res.data.chartData);
        } else {
            setSummary({ totalRevenue: 0, totalRevenueBillets: 0, totalRevenueColis: 0 });
            setChartData([]);
        }
      })
      .catch(err => setError(err.response?.data?.message || 'Erreur de chargement.'))
      .finally(() => setLoading(false));
  }, [period]);

  const formatCurrency = (value) => `${(value || 0).toLocaleString('fr-FR')} FCFA`;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Statistiques Financières</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
            title={`Revenu Total (${period === 'weekly' ? '7j' : '12m'})`} 
            value={formatCurrency(summary.totalRevenue)} 
            icon={<FiDollarSign className="text-green-500"/>} 
            loading={loading}
        />
        <StatCard 
            title={`Revenu Billets (${period === 'weekly' ? '7j' : '12m'})`} 
            value={formatCurrency(summary.totalRevenueBillets)} 
            icon={<FiClipboard className="text-blue-500"/>}
            loading={loading}
        />
        <StatCard 
            title={`Revenu Colis (${period === 'weekly' ? '7j' : '12m'})`} 
            value={formatCurrency(summary.totalRevenueColis)} 
            icon={<FiPackage className="text-orange-500"/>}
            loading={loading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détail des Revenus par Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button variant={period === 'weekly' ? 'default' : 'outline'} onClick={() => setPeriod('weekly')}>7 derniers jours</Button>
            <Button variant={period === 'monthly' ? 'default' : 'outline'} onClick={() => setPeriod('monthly')}>12 derniers mois</Button>
          </div>
          <div className="w-full h-80">
            {loading ? <div className="flex items-center justify-center h-full"><FiLoader className="animate-spin text-3xl" /></div> :
             error ? <p className="text-red-500 text-center">{error}</p> :
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={formatCurrency} />
                  <Legend />
                  <Bar dataKey="billets" stackId="a" name="Revenus Billets" fill="#3b82f6" />
                  <Bar dataKey="colis" stackId="a" name="Revenus Colis" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default StatsPage;