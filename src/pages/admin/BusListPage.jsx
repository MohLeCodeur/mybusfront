// src/pages/admin/BusListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiLoader, FiTrendingUp } from 'react-icons/fi';

// Nouveau composant pour la barre de progression
const OccupancyBar = ({ reserved, capacity }) => {
  const percentage = capacity > 0 ? (reserved / capacity) * 100 : 0;
  let bgColor = 'bg-green-500';
  if (percentage > 75) bgColor = 'bg-red-500';
  else if (percentage > 50) bgColor = 'bg-yellow-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const BusListPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // La route backend a changé, on s'attend maintenant à un tableau directement
    api.get('/admin/bus')
      .then(res => {
        if (Array.isArray(res.data)) {
          setBuses(res.data);
        } else {
          setBuses([]); // Sécurité si la réponse n'est pas un tableau
        }
      })
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Flotte de Bus ({buses.length})</CardTitle>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/4">Taux d'Occupation (futur)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prochain Trajet</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buses.map(bus => (
                  <tr key={bus._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{bus.numero}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{bus.etat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <OccupancyBar reserved={bus.placesReservees} capacity={bus.capacite} />
                        <span className="font-mono text-gray-600">{bus.placesReservees}/{bus.capacite}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bus.prochainTrajet ? (
                            <div>
                                <div>{bus.prochainTrajet.destination}</div>
                                <div className="text-xs">{new Date(bus.prochainTrajet.date).toLocaleDateString()}</div>
                            </div>
                        ) : (
                            'Aucun trajet assigné'
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/bus/${bus._id}/edit`)}>
                        <FiEdit className="mr-1" /> Gérer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {buses.length === 0 && <p className="text-center text-gray-500 py-4">Aucun bus trouvé. Commencez par en ajouter un.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default BusListPage;