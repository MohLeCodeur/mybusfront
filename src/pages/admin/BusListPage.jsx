// src/pages/admin/BusListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { FiPlus, FiEdit, FiLoader } from 'react-icons/fi';

const BusListPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/bus')
      .then(res => {
        // --- LIGNE CORRIGÉE ---
        // On s'assure que res.data.buses est bien un tableau avant de le setter.
        // S'il n'existe pas, on utilise un tableau vide pour éviter les erreurs.
        setBuses(res.data.buses || []);
        // -----------------------
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Erreur serveur');
        setBuses([]); // En cas d'erreur, s'assurer que buses est un tableau vide.
      })
      .finally(() => setLoading(false));
  }, []);

  // Le reste du code JSX reste identique
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Bus</CardTitle>
        <Button onClick={() => navigate('/admin/bus/new')}>
          <FiPlus className="mr-2" /> Ajouter un bus
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">État</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacité</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buses.map(bus => (
                  <tr key={bus._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{bus.numero}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{bus.etat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{bus.capacite}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/bus/${bus._id}/edit`)}>
                        <FiEdit className="mr-1" /> Modifier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {buses.length === 0 && <p className="text-center text-gray-500 py-4">Aucun bus trouvé.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default BusListPage;