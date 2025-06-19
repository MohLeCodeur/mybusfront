// src/pages/admin/BusListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';

// Composant pour la barre de progression (déjà créé)
const OccupancyBar = ({ reserved, capacity }) => {
  const percentage = capacity > 0 ? (reserved / capacity) * 100 : 0;
  let bgColor = 'bg-green-400';
  if (percentage > 75) bgColor = 'bg-red-400';
  else if (percentage > 50) bgColor = 'bg-yellow-400';
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div className={`${bgColor} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'en service': return 'bg-green-100 text-green-800';
        case 'maintenance': return 'bg-yellow-100 text-yellow-800';
        case 'hors service': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const BusListPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBuses = () => {
    api.get('/admin/bus')
      .then(res => setBuses(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  };
  
  useEffect(fetchBuses, []);

  const handleDelete = async (id, numero) => {
    if (window.confirm(`Supprimer le bus n° ${numero} ?\nCette action est irréversible.`)) {
      try {
        await api.delete(`/admin/bus/${id}`);
        fetchBuses();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le bus."));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion de la Flotte</h1>
            <p className="text-gray-500 mt-1">Supervisez et gérez tous les bus de votre compagnie.</p>
        </div>
        <Button onClick={() => navigate('/admin/bus/new')} className="bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg hover:shadow-blue-500/50">
          <FiPlus className="mr-2" /> Ajouter un Nouveau Bus
        </Button>
      </div>

      <Card className="shadow-xl border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle>Liste des Bus ({buses.length})</CardTitle>
          <CardDescription>Cliquez sur un bus pour le modifier ou le supprimer.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center p-8"><FiLoader className="animate-spin mx-auto text-3xl text-blue-500" /></div>}
          {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupation (Futur)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prochain Trajet</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {buses.length > 0 ? buses.map(bus => (
                    <tr key={bus._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <FaBus className="text-blue-500 text-xl"/>
                            <span className="font-semibold text-gray-800">{bus.numero}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(bus.etat)}`}>
                            {bus.etat}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm w-48">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-gray-600 w-16 text-right">{bus.placesReservees || 0}/{bus.capacite}</span>
                            <OccupancyBar reserved={bus.placesReservees} capacity={bus.capacite} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bus.prochainTrajet ? (
                            <div>
                                <div>{bus.prochainTrajet.destination}</div>
                                <div className="text-xs">{new Date(bus.prochainTrajet.date).toLocaleDateString()}</div>
                            </div>
                        ) : (<span className="italic">Aucun</span>)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/admin/bus/${bus._id}/edit`)}><FiEdit/></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(bus._id, bus.numero)}><FiTrash2/></Button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Aucun bus trouvé.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default BusListPage;