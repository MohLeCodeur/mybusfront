// src/pages/admin/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FiLoader, FiDollarSign, FiPackage, FiClipboard, FiBarChart2 } from 'react-icons/fi';

const StatCard = ({ title, value, icon, loading, colorClass }) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
            <div className={`text-2xl ${colorClass}`}>{icon}</div>
        </CardHeader>
        <CardContent>
            {loading ? 
                <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse"></div> :
                <div className="text-3xl font-bold text-gray-800">{value}</div>
            }
        </CardContent>
    </Card>
);

const StatsPage = () => {
  const [period, setPeriod] = useState('weekly');
  const [summary, setSummary] = useState({ totalRevenue: 0, totalRevenueBillets: 0, totalRevenueColis: 0 });
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
        } else { /* ... (gestion du cas vide) ... */ }
      })
      .catch(err => setError(err.response?.data?.message || 'Erreur de chargement.'))
      .finally(() => setLoading(false));
  }, [period]);

  const formatCurrency = (value) => `${(value || 0).toLocaleString('fr-FR')} FCFA`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Analyse Financière</h1>
        <p className="text-gray-500 mt-1">Suivez les performances de vos revenus par source et par période.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
            title="Revenu Total" 
            value={formatCurrency(summary.totalRevenue)} 
            icon={<FiDollarSign />} 
            loading={loading}
            colorClass="text-green-500"
        />
        <StatCard 
            title="Revenus des Billets" 
            value={formatCurrency(summary.totalRevenueBillets)} 
            icon={<FiClipboard />}
            loading={loading}
            colorClass="text-blue-500"
        />
        <StatCard 
            title="Revenus des Colis" 
            value={formatCurrency(summary.totalRevenueColis)} 
            icon={<FiPackage />}
            loading={loading}
            colorClass="text-pink-500"
        />
      </div>

      <Card className="shadow-xl border-t-4 border-gray-200">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="flex items-center gap-2"><FiBarChart2/> Évolution des Revenus</CardTitle>
                    <CardDescription>Vue {period === 'weekly' ? 'hebdomadaire' : 'mensuelle'} des revenus empilés par source.</CardDescription>
                </div>
                <div className="flex space-x-2">
                    <Button size="sm" variant={period === 'weekly' ? 'default' : 'outline'} onClick={() => setPeriod('weekly')}>7 Jours</Button>
                    <Button size="sm" variant={period === 'monthly' ? 'default' : 'outline'} onClick={() => setPeriod('monthly')}>12 Mois</Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            {loading ? <div className="flex items-center justify-center h-full"><FiLoader className="animate-spin text-3xl text-blue-500" /></div> :
             error ? <p className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</p> :
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value/1000)}k`}/>
                  <Tooltip formatter={(value) => formatCurrency(value)} cursor={{fill: 'rgba(238, 242, 255, 0.5)'}}/>
                  <Legend />
                  <Bar dataKey="billets" stackId="a" name="Billets" fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                  <Bar dataKey="colis" stackId="a" name="Colis" fill="#db2777" radius={[4, 4, 0, 0]}/>
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