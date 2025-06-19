// src/pages/admin/ColisDashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ColisDashboardPage = () => {
    const [allColis, setAllColis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchColis = useCallback(() => {
        setLoading(true);
        api.get('/admin/colis')
          .then(res => setAllColis(Array.isArray(res.data) ? res.data : []))
          .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
          .finally(() => setLoading(false));
    }, []);

    useEffect(fetchColis, [fetchColis]);
    
    const handleDelete = async (id, codeSuivi) => {
        if(window.confirm(`Supprimer le colis ${codeSuivi} ?`)){
            try {
                await api.delete(`/admin/colis/${id}`);
                fetchColis();
            } catch(err) {
                alert("Erreur: " + err.response?.data?.message);
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

    const filteredColis = allColis.filter(colis => statusFilter ? colis.statut === statusFilter : true);
    
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentColis = filteredColis.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredColis.length / ITEMS_PER_PAGE);

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
            
            <Card className="shadow-xl border-t-4 border-gray-200">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Liste des Colis ({filteredColis.length})</CardTitle>
                            <CardDescription>Filtrez par statut pour affiner votre recherche.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="status-filter" className="text-sm font-medium">Filtrer :</label>
                            <select id="status-filter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                                <option value="">Tous les statuts</option>
                                <option value="enregistré">Enregistrés</option>
                                <option value="encours">En cours</option>
                                <option value="arrivé">Arrivés</option>
                                <option value="annulé">Annulés</option>
                            </select>
                        </div>
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
                                {currentColis.length > 0 ? currentColis.map(c => (
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
                                    <tr><td colSpan="6" className="text-center py-10">Aucun colis ne correspond à vos filtres.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>}
                </CardContent>
                {totalPages > 1 && (
                    <CardFooter className="flex justify-between items-center border-t">
                        <span className="text-sm text-gray-500">Page {currentPage} sur {totalPages}</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><FiChevronLeft/> Précédent</Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Suivant <FiChevronRight/></Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};
export default ColisDashboardPage;