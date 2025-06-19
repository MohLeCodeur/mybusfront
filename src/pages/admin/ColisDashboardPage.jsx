// src/pages/admin/ColisDashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import StatusStepper from '../../components/admin/StatusStepper.jsx';

// Composant pour une seule carte de colis
const ColisCard = ({ colis, onDelete, onEdit }) => {
    return (
        <div className="bg-white p-4 rounded-lg border hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-gray-500">Code Suivi</p>
                        <p className="font-bold font-mono text-blue-600">{colis.code_suivi}</p>
                    </div>
                    <p className="font-bold text-pink-600">{colis.prix?.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">{colis.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                    De: {colis.expediteur_nom} → Pour: {colis.destinataire_nom}
                </p>
                <div className="my-4">
                    <StatusStepper currentStatus={colis.statut} />
                </div>
            </div>
            <div className="border-t mt-2 pt-3 flex justify-between items-center">
                <p className="text-xs text-gray-400">Enregistré le {new Date(colis.date_enregistrement).toLocaleDateString()}</p>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={onEdit} title="Gérer"><FiEdit/></Button>
                    <Button size="sm" variant="destructive" onClick={onDelete} title="Supprimer"><FiTrash2/></Button>
                </div>
            </div>
        </div>
    );
};

const ColisDashboardPage = () => {
    const [allColis, setAllColis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const fetchColis = useCallback(() => {
        setLoading(true);
        // On pourrait ajouter un filtre par statut à l'API si nécessaire
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
            <Card className="shadow-xl border-t-4 border-orange-400">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Liste des Colis ({filteredColis.length})</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="status-filter" className="text-sm font-medium">Filtrer par statut:</label>
                            <select id="status-filter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                                <option value="">Tous</option>
                                <option value="enregistré">Enregistrés</option>
                                <option value="encours">En cours</option>
                                <option value="arrivé">Arrivés</option>
                                <option value="annulé">Annulés</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? <div className="text-center p-8"><FiLoader className="animate-spin"/></div> :
                     error ? <p className="text-red-500">{error}</p> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentColis.length > 0 ? currentColis.map(c => (
                            <ColisCard 
                                key={c._id}
                                colis={c}
                                onEdit={() => navigate(`/admin/colis/${c._id}/edit`)}
                                onDelete={() => handleDelete(c._id, c.code_suivi)}
                            />
                        )) : <p className="col-span-full text-center py-16 text-gray-500">Aucun colis ne correspond à vos filtres.</p>}
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