// src/pages/admin/ColisDashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
// --- 1. Importer l'icône FiRefreshCw ---
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiChevronLeft, FiChevronRight, FiSearch, FiRefreshCw } from 'react-icons/fi';

const ColisDashboardPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ docs: [], total: 0, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filters, setFilters] = useState({
        search: '',
        statut: '',
        sortBy: 'date_desc',
        page: 1,
    });
    const [debouncedSearch] = useDebounce(filters.search, 500);

    const fetchColis = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ 
            ...filters, 
            search: debouncedSearch,
            limit: 10
        });
        api.get(`/admin/colis?${params.toString()}`)
          .then(res => setData(res.data))
          .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
          .finally(() => setLoading(false));
    }, [debouncedSearch, filters]);

    useEffect(fetchColis, [fetchColis]);
    
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({...prev, [key]: value, page: 1}));
    }
    
    const handlePageChange = (newPage) => {
        setFilters(prev => ({...prev, page: newPage}));
    }

    // --- 2. Ajouter la fonction de réinitialisation ---
    const handleReset = () => {
        setFilters({
            search: '',
            statut: '',
            sortBy: 'date_desc',
            page: 1,
        });
    };

    const handleDelete = async (id, codeSuivi) => {
        if(window.confirm(`Supprimer le colis ${codeSuivi} ?`)){
            try {
                await api.delete(`/admin/colis/${id}`);
                fetchColis();
            } catch(err) {
                alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le colis."));
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'enregistré': return 'bg-blue-100 text-blue-800';
            case 'encours': return 'bg-yellow-100 text-yellow-800';
            case 'arrivé': return 'bg-green-100 text-green-800';
            case 'annulé': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Gestion des Colis</h1>
                    <p className="text-gray-500 mt-1">Suivez et gérez tous les colis expédiés.</p>
                </div>
                <Button onClick={() => navigate('/admin/colis/new')} className="bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg">
                    <FiPlus className="mr-2" /> Enregistrer un Colis
                </Button>
            </div>
            
            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Liste des Colis ({loading ? '...' : data.total})</CardTitle>
                    </div>
                    {/* --- 3. Ajouter le bouton dans le JSX --- */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Rechercher (code, nom, trajet...)" 
                                value={filters.search} 
                                onChange={e => handleFilterChange('search', e.target.value)} 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <select value={filters.statut} onChange={e => handleFilterChange('statut', e.target.value)} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                            <option value="">Tous les statuts</option>
                            <option value="enregistré">Enregistrés</option>
                            <option value="encours">En cours</option>
                            <option value="arrivé">Arrivés</option>
                            <option value="annulé">Annulés</option>
                        </select>
                        <select value={filters.sortBy} onChange={e => handleFilterChange('sortBy', e.target.value)} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                            <option value="date_desc">Trier par : Date (récente)</option>
                            <option value="date_asc">Trier par : Date (ancienne)</option>
                            <option value="price_desc">Trier par : Prix (élevé)</option>
                            <option value="price_asc">Trier par : Prix (faible)</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={handleReset} className="flex-shrink-0">
                            <FiRefreshCw className="mr-1"/> Réinitialiser
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? <div className="text-center p-8"><FiLoader className="animate-spin mx-auto text-3xl text-blue-500"/></div> :
                     error ? <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p> :
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">Code Suivi</th>
                                    <th className="px-6 py-3 text-left">Trajet Associé</th>
                                    <th className="px-6 py-3 text-left">Exp. → Dest.</th>
                                    <th className="px-6 py-3 text-right">Prix</th>
                                    <th className="px-6 py-3 text-center">Statut</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.docs.length > 0 ? data.docs.map(c => (
                                    <tr key={c._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-blue-600">{c.code_suivi}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{c.trajet ? `${c.trajet.villeDepart} → ${c.trajet.villeArrivee}` : 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm font-medium">{c.expediteur_nom} → {c.destinataire_nom}</td>
                                        <td className="px-6 py-4 text-right font-semibold">{c.prix?.toLocaleString('fr-FR')} FCFA</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(c.statut)}`}>{c.statut}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => navigate(`/admin/colis/${c._id}/edit`)}><FiEdit/></Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(c._id, c.code_suivi)}><FiTrash2/></Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="text-center py-10 text-gray-500">Aucun colis ne correspond à vos filtres.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>}
                </CardContent>
                {data.pages > 1 && (
                    <CardFooter className="flex justify-between items-center border-t">
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
export default ColisDashboardPage;