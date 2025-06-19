// src/pages/admin/TrajetListPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiPlayCircle, FiChevronLeft, FiChevronRight, FiCalendar, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
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
      await api.delete(`/admin/trajets/${id}`);
      fetchTrajets();
    }
  };

  const handleStartTrip = async (trajetId) => {
    try {
        await api.post('/tracking/start-trip', { trajetId });
        alert("Voyage démarré avec succès ! Le suivi est maintenant actif.");
        fetchTrajets(); // Rafraîchir pour mettre à jour le statut du bouton
    } catch (err) {
        alert("Erreur: " + (err.response?.data?.message || "Impossible de démarrer le voyage."));
    }
  };

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
            <p className="text-gray-500 mt-1">Gérez les itinéraires et lancez les voyages.</p>
        </div>
        <Button onClick={() => navigate('/admin/trajets/new')} className="bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg">
          <FiPlus className="mr-2" /> Créer un Trajet
        </Button>
      </div>

      {/* --- CARTE AVEC BORDURE GRISE --- */}
      <Card className="shadow-xl border-t-4 border-gray-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Liste des Trajets ({sortedTrajets.length})</CardTitle>
              <CardDescription>Filtrez et triez pour organiser vos voyages.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                    <option value="avenir">À venir</option><option value="passes">Passés</option><option value="tous">Tous</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                    <option value="date">Trier par Date</option><option value="price">Trier par Prix</option>
                </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <div className="text-center p-8"><FiLoader className="animate-spin mx-auto text-3xl"/></div> :
           error ? <p className="text-red-500">{error}</p> :
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTrajets.length > 0 ? currentTrajets.map(t => (
              <div key={t._id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                      <div className="flex justify-between items-start">
                          <div className="font-bold text-gray-800 flex items-center gap-2"><FaRoute/> {t.villeDepart} → {t.villeArrivee}</div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{t.isActive ? 'Actif' : 'Inactif'}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{t.compagnie}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 border-y my-3 py-2">
                      <span className="flex items-center gap-1"><FiCalendar size={14}/> {new Date(t.dateDepart).toLocaleDateString('fr-FR')} - {t.heureDepart}</span>
                      <span className="flex items-center gap-1 font-semibold"><FiDollarSign size={14}/> {t.prix.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Bus: <span className="font-semibold">{t.bus?.numero || 'Non assigné'}</span></p>
                      <div className="flex gap-2">
                          
                          {/* --- LOGIQUE DU BOUTON "DÉMARRER" AMÉLIORÉE --- */}
                          {t.isActive && (
                            t.liveStatus === 'En cours' ? (
                                <Button size="sm" className="bg-blue-100 text-blue-700 cursor-default" disabled><FiCheckCircle className="mr-1"/> En cours</Button>
                            ) : t.liveStatus === 'Terminé' ? (
                                <Button size="sm" className="bg-gray-100 text-gray-600 cursor-default" disabled><FiCheckCircle className="mr-1"/> Terminé</Button>
                            ) : (
                                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleStartTrip(t._id)} title="Activer le suivi en direct"><FiPlayCircle/></Button>
                            )
                          )}
                          <Button size="sm" variant="outline" onClick={() => navigate(`/admin/trajets/${t._id}/edit`)} title="Modifier"><FiEdit/></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id, `${t.villeDepart} → ${t.villeArrivee}`)} title="Supprimer"><FiTrash2/></Button>
                      </div>
                  </div>
              </div>
            )) : <p className="col-span-full text-center py-10 text-gray-500">Aucun trajet ne correspond à vos filtres.</p>}
          </div>}
        </CardContent>
        {totalPages > 1 && ( <CardFooter> {/* ... pagination ... */} </CardFooter> )}
      </Card>
    </div>
  );
};
export default TrajetListPage;