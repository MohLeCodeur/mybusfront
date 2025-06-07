// src/pages/admin/ColisDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiPlus, FiEdit, FiLoader } from 'react-icons/fi';

const ColisDashboardPage = () => {
  const [colisList, setColisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/colis') // URL CORRIGÉE
      .then(res => setColisList(res.data))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Colis</CardTitle>
        <Button onClick={() => navigate('/admin/colis/new')}>
          <FiPlus className="mr-2" /> Ajouter un colis
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
                  <th className="px-6 py-3 text-left">Expéditeur</th>
                  <th className="px-6 py-3 text-left">Destinataire</th>
                  <th className="px-6 py-3 text-left">Statut</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colisList.map(c => (
                  <tr key={c._id}>
                    <td className="px-6 py-4 font-mono">{c.code_suivi}</td>
                    <td className="px-6 py-4">{c.expediteur_nom}</td>
                    <td className="px-6 py-4">{c.destinataire_nom}</td>
                    <td className="px-6 py-4 capitalize">{c.statut}</td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/colis/${c._id}/edit`)}>
                        <FiEdit className="mr-1" /> Gérer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default ColisDashboardPage;