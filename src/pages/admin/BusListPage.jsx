// src/pages/admin/BusListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';

// Composant pour la barre de progression (déjà créé)
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

  // Fonction pour récupérer les données, réutilisable pour rafraîchir la liste
  const fetchBuses = () => {
    setLoading(true);
    api.get('/admin/bus')
      .then(res => {
        if (Array.isArray(res.data)) {
          setBuses(res.data);
        } else {
          setBuses([]);
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Erreur lors du chargement des bus.');
        setBuses([]);
      })
      .finally(() => setLoading(false));
  };
  
  // Appel initial au chargement du composant
  useEffect(() => {
    fetchBuses();
  }, []);

  // Fonction pour gérer la suppression d'un bus
  const handleDelete = async (id, numero) => {
    // Affiche une boîte de dialogue de confirmation
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le bus n° ${numero} ?\nCette action est irréversible.`)) {
      try {
        await api.delete(`/admin/bus/${id}`);
        // Si la suppression réussit, on rafraîchit la liste des bus
        fetchBuses();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le bus."));
        console.error(err);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Flotte de Bus ({buses.length})</CardTitle>
        <Button onClick={() => navigate('/admin/bus/new')}>
          <FiPlus className="mr-2" /> Ajouter un bus
        </Button>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-center p-4"><FiLoader className="animate-spin mx-auto text-2xl text-blue-500" /></div>}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Numéro</th>
                  <th className="px-6 py-3 text-left">État</th>
                  <th className="px-6 py-3 text-left w-1/4">Occupation (Futur)</th>
                  <th className="px-6 py-3 text-left">Prochain Trajet</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buses.length > 0 ? buses.map(bus => (
                  <tr key={bus._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{bus.numero}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{bus.etat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <OccupancyBar reserved={bus.placesReservees} capacity={bus.capacite} />
                        <span className="font-mono text-gray-600">{bus.placesReservees || 0}/{bus.capacite}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.prochainTrajet ? (
                          <div>
                              <div>{bus.prochainTrajet.destination}</div>
                              <div className="text-xs">{new Date(bus.prochainTrajet.date).toLocaleDateString()}</div>
                          </div>
                      ) : ( 'Aucun' )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/bus/${bus._id}/edit`)}>
                          <FiEdit className="mr-1 h-3 w-3" /> Modifier
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(bus._id, bus.numero)}>
                          <FiTrash2 className="mr-1 h-3 w-3" /> Supprimer
                        </Button>
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
  );
};
export default BusListPage;