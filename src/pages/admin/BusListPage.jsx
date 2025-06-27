// src/pages/admin/BusListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
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
  const navigate = useNavigate();
  const [data, setData] = useState({ docs: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    etat: '',
    sortBy: 'numero_asc',
    page: 1,
  });
  const [debouncedSearch] = useDebounce(filters.search, 500);

  const fetchBuses = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
        search: debouncedSearch,
        etat: filters.etat,
        sortBy: filters.sortBy,
        page: filters.page,
        limit: 7, // Nombre de bus par page
    });
    api.get(`/admin/bus?${params.toString()}`)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.etat, filters.sortBy, filters.page]);

  useEffect(fetchBuses, [fetchBuses]);
  
  const handlePageChange = (newPage) => {
    setFilters(prev => ({...prev, page: newPage}));
  }
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({...prev, [key]: value, page: 1}));
  }

  const handleDelete = async (id, numero) => {
    if (window.confirm(`Supprimer le bus n° ${numero} ?`)) {
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
        <Button onClick={() => navigate('/admin/bus/new')} className="bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg">
          <FiPlus className="mr-2" /> Ajouter un Nouveau Bus
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Liste des Bus ({loading ? '...' : data.total})</CardTitle>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro..."
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select value={filters.etat} onChange={e => handleFilterChange('etat', e.target.value)} className="border-gray-300 rounded-md text-sm p-2 bg-white">
              <option value="">Tous les états</option>
              <option value="en service">En service</option>
              <option value="maintenance">Maintenance</option>
              <option value="hors service">Hors service</option>
            </select>
            <select value={filters.sortBy} onChange={e => handleFilterChange('sortBy', e.target.value)} className="border-gray-300 rounded-md text-sm p-2 bg-white">
              <option value="numero_asc">Trier par N° (A-Z)</option>
              <option value="numero_desc">Trier par N° (Z-A)</option>
              <option value="capacite_asc">Trier par Capacité (basse)</option>
              <option value="capacite_desc">Trier par Capacité (haute)</option>
            </select>
          </div>
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
                  {data.docs.length > 0 ? data.docs.map(bus => (
                    <tr key={bus._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><FaBus className="text-blue-500 text-xl"/><span className="font-semibold text-gray-800">{bus.numero}</span></div></td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(bus.etat)}`}>{bus.etat}</span></td>
                      <td className="px-6 py-4 w-48"><div className="flex items-center gap-2"><span className="font-mono text-gray-600 w-16 text-right">{bus.placesReservees || 0}/{bus.capacite}</span><OccupancyBar reserved={bus.placesReservees} capacity={bus.capacite} /></div></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{bus.prochainTrajet ? (<div><div>{bus.prochainTrajet.destination}</div><div className="text-xs">{new Date(bus.prochainTrajet.date).toLocaleDateString()}</div></div>) : (<span className="italic">Aucun</span>)}</td>
                      <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => navigate(`/admin/bus/${bus._id}/edit`)}><FiEdit/></Button><Button size="sm" variant="destructive" onClick={() => handleDelete(bus._id, bus.numero)}><FiTrash2/></Button></div></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Aucun bus ne correspond à vos filtres.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {data.pages > 1 && (
          <CardFooter className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Page {filters.page} sur {data.pages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page === 1}><FiChevronLeft/> Précédent</Button>
              <Button variant="outline" size="sm" onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page >= data.pages}>Suivant <FiChevronRight/></Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
export default BusListPage;