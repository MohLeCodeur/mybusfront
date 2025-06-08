// src/pages/admin/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FiLoader, FiDownload, FiDollarSign, FiHash, FiList } from 'react-icons/fi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  
  // États pour les données
  const [summary, setSummary] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const [chartData, setChartData] = useState([]);
  const [paiements, setPaiements] = useState([]); // Pour la liste détaillée

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour charger toutes les données
  const fetchData = (currentPeriod) => {
    setLoading(true);
    setError('');

    // Appel pour les graphiques et les KPIs
    const statsPromise = api.get(`/admin/stats/revenus?periode=${currentPeriod}`);
    // Appel pour la liste détaillée de tous les paiements
    const paiementsPromise = api.get('/admin/paiements');

    Promise.all([statsPromise, paiementsPromise])
      .then(([statsRes, paiementsRes]) => {
        // Traitement des données des statistiques
        if (statsRes.data && statsRes.data.summary && statsRes.data.chartData) {
            setSummary(statsRes.data.summary);
            setChartData(statsRes.data.chartData);
        } else {
            setSummary({ totalRevenue: 0, totalTransactions: 0 });
            setChartData([]);
        }
        // Traitement de la liste des paiements
        if (paiementsRes.data && Array.isArray(paiementsRes.data.paiements)) {
            setPaiements(paiementsRes.data.paiements);
        } else {
            setPaiements([]);
        }
      })
      .catch(err => setError(err.response?.data?.message || 'Erreur de chargement des données.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  // Fonction pour générer le PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Rapport des Paiements Confirmés", 14, 16);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 22);

    const tableColumn = ["Date", "Client", "Email", "Trajet", "Montant (FCFA)"];
    const tableRows = [];

    paiements.forEach(p => {
        const paiementData = [
            new Date(p.dateReservation).toLocaleDateString('fr-FR'),
            `${p.client?.prenom || ''} ${p.client?.nom || ''}`,
            p.client?.email || 'N/A',
            `${p.trajet?.villeDepart || '?'} → ${p.trajet?.villeArrivee || '?'}`,
            (p.trajet?.prix * p.placesReservees).toLocaleString('fr-FR'),
        ];
        tableRows.push(paiementData);
    });

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 30 });
    doc.save(`rapport_paiements_${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Statistiques & Paiements</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
            title={`Revenu Total (${period === 'weekly' ? '7 jours' : '12 mois'})`} 
            value={`${summary.totalRevenue.toLocaleString('fr-FR')} FCFA`} 
            icon={<FiDollarSign className="text-green-500"/>} 
            loading={loading}
        />
        <StatCard 
            title={`Transactions (${period === 'weekly' ? '7 jours' : '12 mois'})`} 
            value={summary.totalTransactions} 
            icon={<FiHash className="text-blue-500"/>}
            loading={loading}
        />
      </div>

      <Card>
        <CardHeader><CardTitle>Évolution des Revenus</CardTitle></CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button variant={period === 'weekly' ? 'default' : 'outline'} onClick={() => setPeriod('weekly')}>7 derniers jours</Button>
            <Button variant={period === 'monthly' ? 'default' : 'outline'} onClick={() => setPeriod('monthly')}>12 derniers mois</Button>
          </div>
          <div className="w-full h-80">
            {loading ? <div className="flex items-center justify-center h-full"><FiLoader className="animate-spin text-3xl" /></div> :
             error ? <p className="text-red-500 text-center">{error}</p> :
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} FCFA`} /><Legend /><Bar dataKey="total" name="Revenus (FCFA)" fill="#3b82f6" /></BarChart>
              </ResponsiveContainer>
            }
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><FiList /> Historique des Paiements</CardTitle>
            <Button onClick={exportPDF} disabled={loading || paiements.length === 0}>
                <FiDownload className="mr-2"/> Télécharger en PDF
            </Button>
        </CardHeader>
        <CardContent>
            {loading ? <div className="text-center p-4"><FiLoader className="animate-spin mx-auto text-2xl" /></div> :
             error ? <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p> :
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Client</th>
                            <th className="px-6 py-3 text-left">Trajet</th>
                            <th className="px-6 py-3 text-right">Montant</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paiements.map(p => (
                            <tr key={p._id}>
                                <td className="px-6 py-4">{new Date(p.dateReservation).toLocaleString('fr-FR')}</td>
                                <td className="px-6 py-4">{p.client?.prenom} {p.client?.nom}</td>
                                <td className="px-6 py-4">{p.trajet?.villeDepart} → {p.trajet?.villeArrivee}</td>
                                <td className="px-6 py-4 text-right font-medium">{(p.trajet?.prix * p.placesReservees).toLocaleString('fr-FR')} FCFA</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paiements.length === 0 && <p className="text-center text-gray-500 py-6">Aucun paiement confirmé à afficher.</p>}
            </div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;