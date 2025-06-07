// src/pages/admin/ChauffeurListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiPlus, FiEdit, FiLoader } from 'react-icons/fi';

const ChauffeurListPage = () => {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/chauffeurs') // URL CORRIGÉE
      .then(res => setChauffeurs(res.data))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Chauffeurs</CardTitle>
        <Button onClick={() => navigate('/admin/chauffeurs/new')}>
          <FiPlus className="mr-2" /> Ajouter un chauffeur
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
                  <th className="px-6 py-3 text-left">Nom Complet</th>
                  <th className="px-6 py-3 text-left">Téléphone</th>
                  <th className="px-6 py-3 text-left">Bus Affecté</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chauffeurs.map(ch => (
                  <tr key={ch._id}>
                    <td className="px-6 py-4">{ch.prenom} {ch.nom}</td>
                    <td className="px-6 py-4">{ch.telephone}</td>
                    <td className="px-6 py-4">{ch.bus ? ch.bus.numero : 'Non affecté'}</td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/chauffeurs/${ch._id}/edit`)}>
                        <FiEdit className="mr-1" /> Modifier
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
export default ChauffeurListPage;