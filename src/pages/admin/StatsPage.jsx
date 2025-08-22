// src/pages/admin/StatsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FiLoader, FiDollarSign, FiPackage, FiUsers, FiBarChart2, FiTrendingUp, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';

// --- COMPOSANT STAT CARD CORRIGÉ ---
const StatCard = ({ title, value, icon, loading, colorClass, description }) => (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
            <div className={`text-2xl ${colorClass}`}>{icon}</div>
        </CardHeader>
        <CardContent className="flex-grow">
            {loading ? 
                <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse"></div> :
                <div className="text-3xl font-bold text-gray-800">{value}</div>
            }
            {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </CardContent>
    </Card>
);

// --- COMPOSANT TABLEAU DE PERFORMANCE (INCHANGÉ, il est réutilisable) ---
const PerformanceTable = ({ title, data, dataKey, valueKey, countKey, loading, icon, unitLabel = 'transactions' }) => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">{icon} {title}</CardTitle>
        </CardHeader>
        <CardContent>
            {loading ? <div className="flex justify-center items-center h-48"><FiLoader className="animate-spin text-2xl"/></div> :
             data && data.length > 0 ? (
                <ul className="space-y-3">
                    {data.map((item, index) => (
                        <li key={index} className="flex items-center justify-between text-sm border-b pb-2">
                            <div className="font-semibold text-gray-700">{item[dataKey]}</div>
                            <div className="text-right">
                                <div className="font-bold text-blue-600">{item[valueKey].toLocaleString('fr-FR')} FCFA</div>
                                <div className="text-xs text-gray-500">{item[countKey]} {unitLabel}</div>
                            </div>
                        </li>
                    ))}
                </ul>
             ) : <p className="text-center text-gray-500 py-10">Aucune donnée pour cette période.</p>}
        </CardContent>
    </Card>
);

// --- COMPOSANT PRINCIPAL DE LA PAGE (MODIFIÉ) ---
const StatsPage = () => {
    const [period, setPeriod] = useState('weekly');
    const [chartType, setChartType] = useState('bar');
    
    const [summary, setSummary] = useState({});
    const [chartData, setChartData] = useState([]);
    
    const [performance, setPerformance] = useState({ topRoutes: [], topParcelDestinations: [] });
    
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [loadingPerformance, setLoadingPerformance] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(() => {
        setLoadingSummary(true);
        setLoadingPerformance(true);
        setError('');

        const summaryPromise = api.get(`/admin/stats/revenus?periode=${period}`);
        const performancePromise = api.get(`/admin/stats/performance?periode=${period}`);

        Promise.all([summaryPromise, performancePromise])
            .then(([summaryRes, performanceRes]) => {
                setSummary(summaryRes.data.summary);
                setChartData(summaryRes.data.chartData);
                setPerformance(performanceRes.data);
            })
            .catch(err => setError(err.response?.data?.message || 'Erreur de chargement des données.'))
            .finally(() => {
                setLoadingSummary(false);
                setLoadingPerformance(false);
            });
    }, [period]);
    useEffect(fetchData, [fetchData]);

    const formatCurrency = (value) => `${(value || 0).toLocaleString('fr-FR')} FCFA`;
    const periodButtons = [
        { label: 'Aujourd\'hui', value: 'daily' },
        { label: '7 Jours', value: 'weekly' },
        { label: '30 Jours', value: 'monthly' },
        { label: 'Cette Année', value: 'yearly' },
    ];
    const ChartComponent = chartType === 'bar' ? BarChart : LineChart;
    const ChartElement = chartType === 'bar' ? Bar : Line;
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Analyse et Performance</h1>
                    <p className="text-gray-500 mt-1">Suivez les indicateurs clés de votre activité.</p>
                </div>
                 <div className="flex-shrink-0">
                    <img src="/assets/mybus.webp" alt="MyBus Logo" className="h-16 w-auto opacity-80"/>
                </div>
            </div>
            
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2"><FiAlertCircle/> {error}</div>}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Revenu Total" 
                    value={formatCurrency(summary.totalRevenue)} 
                    icon={<FiDollarSign />} 
                    loading={loadingSummary} 
                    colorClass="text-green-500" 
                    description={`Période: ${periodButtons.find(b=>b.value===period).label}`}
                />
                <StatCard 
                    title="Revenus des Billets" 
                    value={formatCurrency(summary.totalRevenueBillets)} 
                    icon={<FiCheckSquare />} 
                    loading={loadingSummary} 
                    colorClass="text-blue-500" 
                    description={`${summary.totalReservations?.toLocaleString() || '0'} réservations`}
                />
                <StatCard 
                    title="Revenus des Colis" 
                    value={formatCurrency(summary.totalRevenueColis)} 
                    icon={<FiPackage />} 
                    loading={loadingSummary} 
                    colorClass="text-pink-500" 
                    description={`${summary.totalColis?.toLocaleString() || '0'} colis expédiés`}
                />
                <StatCard 
                    title="Nouveaux Clients" 
                    value={summary.newUsersCount?.toLocaleString() || '0'} 
                    icon={<FiUsers />} 
                    loading={loadingSummary} 
                    colorClass="text-orange-500" 
                    description="Clients enregistrés sur la période"
                />
            </div>
            
            <Card className="shadow-xl border-t-4 border-gray-200">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"><FiBarChart2/> Évolution des Revenus</CardTitle>
                            <CardDescription>Vue d'ensemble des revenus générés par source.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="p-1 bg-gray-100 rounded-lg flex gap-1">
                                {periodButtons.map(btn => (
                                    <Button key={btn.value} size="sm" variant={period === btn.value ? 'default' : 'ghost'} onClick={() => setPeriod(btn.value)}>{btn.label}</Button>
                                ))}
                            </div>
                             <div className="p-1 bg-gray-100 rounded-lg flex gap-1">
                                <Button size="sm" variant={chartType === 'bar' ? 'default' : 'ghost'} onClick={() => setChartType('bar')}>Barres</Button>
                                <Button size="sm" variant={chartType === 'line' ? 'default' : 'ghost'} onClick={() => setChartType('line')}>Ligne</Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-96">
                        {loadingSummary ? <div className="flex items-center justify-center h-full"><FiLoader className="animate-spin text-3xl text-blue-500" /></div> :
                        <ResponsiveContainer width="100%" height="100%">
                            <ChartComponent data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value/1000)}k`}/>
                                <Tooltip contentStyle={{background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}} formatter={(value) => formatCurrency(value)} cursor={{fill: 'rgba(238, 242, 255, 0.6)'}}/>
                                <Legend />
                                <ChartElement type="monotone" dataKey="billets" stackId="a" name="Billets" fill="#3b82f6" stroke="#3b82f6" radius={chartType === 'bar' ? [4, 4, 0, 0] : undefined}/>
                                <ChartElement type="monotone" dataKey="colis" stackId="a" name="Colis" fill="#db2777" stroke="#db2777" radius={chartType === 'bar' ? [4, 4, 0, 0] : undefined}/>
                            </ChartComponent>
                        </ResponsiveContainer>
                        }
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PerformanceTable
                    icon={<FiTrendingUp/>}
                    title="Trajets les plus rentables"
                    data={performance.topRoutes}
                    dataKey="route"
                    valueKey="totalRevenue"
                    countKey="reservationCount"
                    unitLabel="réservations"
                    loading={loadingPerformance}
                />
                <PerformanceTable
                    icon={<FiPackage/>}
                    title="Colis les plus rentables"
                    data={performance.topParcelDestinations}
                    dataKey="destination"
                    valueKey="totalRevenue"
                    countKey="colisCount"
                    unitLabel="colis"
                    loading={loadingPerformance}
                />
            </div>
        </div>
    );
};
export default StatsPage;