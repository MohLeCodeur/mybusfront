// src/pages/admin/ChauffeurListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiUser, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';

const ChauffeurListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ docs: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
      search: '',
      sortBy: 'name_asc',
      page: 1,
  });
  const [debouncedSearch] = useDebounce(filters.search, 500);

  const fetchChauffeurs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
        search: debouncedSearch,
        sortBy: filters.sortBy,
        page: filters.page,
        limit: 7,
    });
    api.get(`/admin/chauffeurs?${params.toString()}`)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.sortBy, filters.page]);

  useEffect(fetchChauffeurs, [fetchChauffeurs]);

  const handleDelete = async (id, nomComplet) => {
    if (window.confirm(`Supprimer le chauffeur ${nomComplet} ?`)) {
      try {
        await api.delete(`/admin/chauffeurs/${id}`);
        fetchChauffeurs();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le chauffeur."));
      }
    }
  };
  
  const handlePageChange = (newPage) => {
      setFilters(prev => ({...prev, page: newPage}));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Chauffeurs</h1>
            <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez les informations de vos chauffeurs.</p>
        </div>
        <Button onClick={() => navigate('/admin/chauffeurs/new')} className="bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg">
          <FiPlus className="mr-2" /> Ajouter un Chauffeur
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Liste des Chauffeurs ({loading ? '...' : data.total})</CardTitle>
           <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom, tél..."
                        value={filters.search}
                        onChange={e => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>
                <select 
                    value={filters.sortBy} 
                    onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 1 }))}
                    className="border-gray-300 rounded-md text-sm p-2 bg-white"
                >
                    <option value="name_asc">Trier par Nom (A-Z)</option>
                    <option value="name_desc">Trier par Nom (Z-A)</option>
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
                    <th className="px-6 py-3 text-left">Nom Complet</th>
                    <th className="px-6 py-3 text-left">Téléphone</th>
                    <th className="px-6 py-3 text-left">Bus Affecté</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.docs.length > 0 ? data.docs.map(ch => (
                    <tr key={ch._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full"><FiUser className="text-gray-500"/></div>
                          <div><div className="font-semibold text-gray-800">{ch.prenom} {ch.nom}</div></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">{ch.telephone}</td>
                      <td className="px-6 py-4">
                        {ch.bus ? <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">{ch.bus.numero}</span> : <span className="text-gray-400 italic">Aucun</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/admin/chauffeurs/${ch._id}/edit`)}><FiEdit/></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(ch._id, `${ch.prenom} ${ch.nom}`)}><FiTrash2/></Button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center py-10 text-gray-500">Aucun chauffeur trouvé.</td></tr>
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
export default ChauffeurListPage;