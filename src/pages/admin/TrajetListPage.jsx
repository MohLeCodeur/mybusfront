// src/pages/admin/TrajetListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FiPlus, FiEdit, FiLoader } from 'react-icons/fi';

const TrajetListPage = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/trajets') // URL CORRIGÉE
      .then(res => setTrajets(res.data))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Trajets</CardTitle>
        <Button onClick={() => navigate('/admin/trajets/new')}>
          <FiPlus className="mr-2" /> Ajouter un trajet
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
                  <th className="px-6 py-3 text-left">Itinéraire</th>
                  <th className="px-6 py-3 text-left">Compagnie</th>
                  <th className="px-6 py-3 text-left">Date & Heure</th>
                  <th className="px-6 py-3 text-left">Prix</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trajets.map(t => (
                  <tr key={t._id}>
                    <td className="px-6 py-4 font-medium">{t.villeDepart} → {t.villeArrivee}</td>
                    <td className="px-6 py-4">{t.compagnie}</td>
                    <td className="px-6 py-4">{new Date(t.dateDepart).toLocaleDateString()} - {t.heureDepart}</td>
                    <td className="px-6 py-4">{t.prix.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/trajets/${t._id}/edit`)}>
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
export default TrajetListPage;