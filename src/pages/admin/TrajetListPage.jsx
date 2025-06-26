import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiPlayCircle, FiCheckCircle, FiAlertTriangle, FiChevronLeft, FiChevronRight, FiCalendar, FiTag } from 'react-icons/fi';
import { FaRoute } from 'react-icons/fa';

const TrajetListPage = () => {
  const [allTrajets, setAllTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('avenir');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const fetchTrajets = useCallback(() => {
    setLoading(true);
    api.get(`/admin/trajets?status=${statusFilter}`)
      .then(res => setAllTrajets(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    fetchTrajets();
  }, [fetchTrajets]);

  const handleDelete = async (id, nomTrajet) => {
    if (window.confirm(`Supprimer le trajet ${nomTrajet} ?`)) {
        try {
            await api.delete(`/admin/trajets/${id}`);
            fetchTrajets();
        } catch (err) {
            alert("Erreur: " + (err.response?.data?.message || "Impossible de supprimer le trajet."));
        }
    }
  };

  // ==========================================================
  // === NOUVELLES FONCTIONS DE GESTION MANUELLE MOHXL
  // ==========================================================
  const handleAction = async (action, trajetId, successMessage) => {
    try {
        const response = await api.post(`/admin/trajets/${trajetId}/${action}`);
        alert(successMessage || response.data.message);
        fetchTrajets();
    } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "L'opération a échoué."));
    }
  };
  
  // ==========================================================

  const sortedTrajets = useMemo(() => {
    return [...allTrajets].sort((a, b) => {
      if (sortBy === 'price') return a.prix - b.prix;
      const dateA = new Date(a.dateDepart);
      const dateB = new Date(b.dateDepart);
      return statusFilter === 'passes' ? dateB - dateA : dateA - dateB;
    });
  }, [allTrajets, sortBy, statusFilter]);

  const currentTrajets = sortedTrajets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedTrajets.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Planification des Trajets</h1>
            <p className="text-gray-500 mt-1">Gérez les itinéraires et le cycle de vie des voyages.</p>
        </div>
        <Button onClick={() => navigate('/admin/trajets/new')} className="bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg">
          <FiPlus className="mr-2" /> Créer un Trajet
        </Button>
      </div>

      <Card className="shadow-xl border-t-4 border-gray-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Liste des Trajets ({sortedTrajets.length})</CardTitle>
              <CardDescription>Filtrez et triez pour organiser vos voyages.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                    <option value="avenir">À venir</option>
                    <option value="passes">Terminés</option>
                    <option value="tous">Tous</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                    <option value="date">Trier par Date</option>
                    <option value="price">Trier par Prix</option>
                </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <div className="text-center p-8"><FiLoader className="animate-spin mx-auto text-3xl"/></div> :
           error ? <p className="text-red-500">{error}</p> :
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTrajets.length > 0 ? currentTrajets.map(t => {
                
                // ====================================================================
                // === NOUVELLE LOGIQUE POUR L'AFFICHAGE DES BOUTONS D'ACTION
                // ====================================================================
                const getActionButtons = () => {
                    const now = new Date();
                    const departureDateTime = new Date(`${new Date(t.dateDepart).toISOString().split('T')[0]}T${t.heureDepart}`);
                    const oneHourBefore = new Date(departureDateTime.getTime() - 60 * 60 * 1000);
                    const oneHourAfter = new Date(departureDateTime.getTime() + 60 * 60 * 1000);

                    switch (t.etatVoyage) {
                        case 'Non commencé':
                            const canStart = now >= oneHourBefore && now <= oneHourAfter;
                            const isDelayed = now > departureDateTime;
                            
                            return (
                                <>
                                    {canStart && (
                                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleAction('demarrer', t._id, 'Voyage démarré !')} title="Activer le suivi en direct">
                                            <FiPlayCircle className="mr-1"/> Démarrer
                                        </Button>
                                    )}
                                    {isDelayed && (
                                         <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-500 hover:bg-yellow-50" onClick={() => handleAction('notifier-retard', t._id)} title="Notifier les passagers du retard">
                                            <FiAlertTriangle className="mr-1"/> Notifier Retard
                                        </Button>
                                    )}
                                </>
                            );
                        
                        case 'En cours':
                            return (
                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleAction('terminer', t._id, 'Voyage terminé !')} title="Marquer le voyage comme terminé">
                                    <FiCheckCircle className="mr-1"/> Terminer
                                </Button>
                            );

                        case 'Terminé':
                            return (
                                <Button size="sm" className="bg-gray-100 text-gray-600 cursor-default" disabled>
                                    <FiCheckCircle className="mr-1"/> Terminé
                                </Button>
                            );

                        default:
                            return null;
                    }
                };
                // ====================================================================
                // === FIN DE LA LOGIQUE
                // ====================================================================

                const getStatusBadge = () => {
                    switch (t.etatVoyage) {
                        case 'Non commencé': return 'bg-yellow-100 text-yellow-800';
                        case 'En cours': return 'bg-blue-100 text-blue-800 animate-pulse';
                        case 'Terminé': return 'bg-green-100 text-green-800';
                        default: return 'bg-gray-100 text-gray-800';
                    }
                };


                return (
                    <div key={t._id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-gray-800 flex items-center gap-2"><FaRoute/> {t.villeDepart} → {t.villeArrivee}</div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge()}`}>{t.etatVoyage}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{t.compagnie}</p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 border-y my-3 py-2">
                            <span className="flex items-center gap-1"><FiCalendar size={14}/> {new Date(t.dateDepart).toLocaleDateString('fr-FR')} - {t.heureDepart}</span>
                            <span className="flex items-center gap-1 font-semibold"><FiTag size={14}/> {t.prix.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">Bus: <span className="font-semibold">{t.bus?.numero || 'Non assigné'}</span></p>
                            <div className="flex gap-2">
                                {getActionButtons()}
                                <Button size="sm" variant="outline" onClick={() => navigate(`/admin/trajets/${t._id}/edit`)} title="Modifier"><FiEdit/></Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id, `${t.villeDepart} → ${t.villeArrivee}`)} title="Supprimer"><FiTrash2/></Button>
                            </div>
                        </div>
                    </div>
                )
            }) : <p className="col-span-full text-center py-10 text-gray-500">Aucun trajet ne correspond à vos filtres.</p>}
          </div>}
        </CardContent>
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
      </Card>
    </div>
  );
};

export default TrajetListPage;
