// src/pages/admin/ColisDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiLoader } from 'react-icons/fi';

const ColisDashboardPage = () => {
  const [colisList, setColisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/colis')
      .then(res => {
        if (Array.isArray(res.data)) {
          setColisList(res.data);
        } else {
          setColisList([]);
        }
      })
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
        case 'enregistré': return 'bg-blue-100 text-blue-800';
        case 'encours': return 'bg-yellow-100 text-yellow-800';
        case 'arrivé': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Colis</CardTitle>
        <Button onClick={() => navigate('/admin/colis/new')}>
          <FiPlus className="mr-2" /> Enregistrer un colis
        </Button>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-center p-4"><FiLoader className="animate-spin mx-auto text-2xl" /></div>}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Code Suivi</th>
                  <th className="px-6 py-3 text-left">Expéditeur → Destinataire</th>
                  <th className="px-6 py-3 text-left">Prix</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Statut</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colisList.length > 0 ? colisList.map(c => (
                  <tr key={c._id}>
                    <td className="px-6 py-4 font-mono text-sm">{c.code_suivi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{c.expediteur_nom} → {c.destinataire_nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-sm">
                      {c.prix ? c.prix.toLocaleString('fr-FR') + ' FCFA' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(c.date_enregistrement).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(c.statut)}`}>
                        {c.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/colis/${c._id}/edit`)}>
                        <FiEdit className="mr-1" /> Gérer
                      </Button>
                    </td>
                  </tr>
                )) : (
                    <tr><td colSpan="6" className="text-center py-10 text-gray-500">Aucun colis enregistré.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default ColisDashboardPage;