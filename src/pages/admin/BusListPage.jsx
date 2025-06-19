// src/pages/admin/BusListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';

// --- Composants Internes (déjà existants) ---
const OccupancyBar = ({ reserved, capacity }) => {
  const percentage = capacity > 0 ? (reserved / capacity) * 100 : 0;
  let bgColor = 'bg-green-400';
  if (percentage > 75) bgColor = 'bg-red-400';
  else if (percentage > 50) bgColor = 'bg-yellow-400';
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`${bgColor} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div></div>
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

// --- Composant Principal ---
const BusListPage = () => {
  const [allBuses, setAllBuses] = useState([]); // Stocke TOUS les bus
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- NOUVEAUX ÉTATS POUR LA PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const BUSES_PER_PAGE = 7; // Nombre de bus à afficher par page
  // ------------------------------------

  const fetchBuses = () => {
    setLoading(true);
    api.get('/admin/bus')
      .then(res => setAllBuses(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  };
  
  useEffect(fetchBuses, []);

  const handleDelete = async (id, numero) => {
    if (window.confirm(`Supprimer le bus n° ${numero} ?`)) {
      try {
        await api.delete(`/admin/bus/${id}`);
        fetchBuses(); // Rafraîchir la liste complète
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le bus."));
      }
    }
  };

  // --- LOGIQUE DE PAGINATION ---
  const indexOfLastBus = currentPage * BUSES_PER_PAGE;
  const indexOfFirstBus = indexOfLastBus - BUSES_PER_PAGE;
  const currentBuses = allBuses.slice(indexOfFirstBus, indexOfLastBus); // La "tranche" de bus à afficher
  const totalPages = Math.ceil(allBuses.length / BUSES_PER_PAGE);
  // -------------------------

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
          <CardTitle>Liste des Bus ({allBuses.length})</CardTitle>
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
                    <th className="px-6 py-3 text-left">Bus</th>
                    <th className="px-6 py-3 text-left">Statut</th>
                    <th className="px-6 py-3 text-left w-1/4">Occupation (Futur)</th>
                    <th className="px-6 py-3 text-left">Prochain Trajet</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBuses.length > 0 ? currentBuses.map(bus => (
                    <tr key={bus._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><FaBus className="text-blue-500 text-xl"/><span className="font-semibold text-gray-800">{bus.numero}</span></div></td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(bus.etat)}`}>{bus.etat}</span></td>
                      <td className="px-6 py-4 w-48"><div className="flex items-center gap-2"><span className="font-mono text-gray-600 w-16 text-right">{bus.placesReservees || 0}/{bus.capacite}</span><OccupancyBar reserved={bus.placesReservees} capacity={bus.capacite} /></div></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{bus.prochainTrajet ? (<div><div>{bus.prochainTrajet.destination}</div><div className="text-xs">{new Date(bus.prochainTrajet.date).toLocaleDateString()}</div></div>) : (<span className="italic">Aucun</span>)}</td>
                      <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => navigate(`/admin/bus/${bus._id}/edit`)}><FiEdit/></Button><Button size="sm" variant="destructive" onClick={() => handleDelete(bus._id, bus.numero)}><FiTrash2/></Button></div></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Aucun bus trouvé.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {/* --- NOUVELLE SECTION DE PAGINATION --- */}
        {totalPages > 1 && (
            <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Page {currentPage} sur {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                        <FiChevronLeft className="h-4 w-4"/> Précédent
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                        Suivant <FiChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            </CardFooter>
        )}
        {/* ------------------------------------- */}
      </Card>
    </div>
  );
};
export default BusListPage;