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
  const ITEMS_PER_PAGE = 6; // Grille de 3x2, plus élégant

  const fetchTrajets = useCallback(() => {
    setLoading(true);
    api.get(`/admin/trajets?status=${statusFilter}`)
      .then(res => setAllTrajets(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err.response?.data?.message || 'Erreur serveur'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(fetchTrajets, [fetchTrajets]);

  const handleDelete = async (id, nomTrajet) => {
    if (window.confirm(`Supprimer le trajet ${nomTrajet} ?`)) {
      try {
        await api.delete(`/admin/trajets/${id}`);
        fetchTrajets();
      } catch (err) { alert("Erreur: " + err.response?.data?.message); }
    }
  };

  const handleStartTrip = async (trajetId) => {
    if (window.confirm("Démarrer ce voyage ? Le suivi sera activé.")) {
      try {
        await api.post('/tracking/start-trip', { trajetId });
        alert("Voyage démarré avec succès !");
        fetchTrajets();
      } catch (err) { alert("Erreur: " + err.response?.data?.message); }
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
                    <option value="passes">Passés</option>
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
          {loading ? <div className="text-center p-8"><FiLoader className="animate-spin mx-auto text-3xl text-blue-500"/></div> :
           error ? <p className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</p> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTrajets.length > 0 ? currentTrajets.map(t => (
              <div key={t._id} className={`bg-white p-4 rounded-lg border-l-4 ${t.isActive ? 'border-blue-500' : 'border-gray-300'} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all`}>
                  <div className="flex justify-between items-start">
                      <div className="font-bold text-gray-800 text-lg">{t.villeDepart} → {t.villeArrivee}</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t.compagnie}</p>
                  <div className="flex justify-between text-sm text-gray-700 border-y my-3 py-2">
                      <span className="flex items-center gap-1.5"><FiCalendar size={14}/> {new Date(t.dateDepart).toLocaleDateString('fr-FR')} - {t.heureDepart}</span>
                      <span className="flex items-center gap-1.5 font-semibold text-pink-600"><FiDollarSign size={14}/> {t.prix.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Bus: <span className="font-semibold">{t.bus?.numero || 'Non assigné'}</span></p>
                      <div className="flex gap-2">
                          {t.isActive && (t.liveStatus === 'En cours' ? (
                              <Button size="sm" className="bg-blue-100 text-blue-700 cursor-default" disabled><FiCheckCircle className="mr-1"/> En cours</Button>
                          ) : (
                              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleStartTrip(t._id)} title="Démarrer le suivi"><FiPlayCircle/></Button>
                          ))}
                          <Button size="sm" variant="outline" onClick={() => navigate(`/admin/trajets/${t._id}/edit`)} title="Modifier"><FiEdit/></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id, `${t.villeDepart} → ${t.villeArrivee}`)} title="Supprimer"><FiTrash2/></Button>
                      </div>
                  </div>
              </div>
            )) : <p className="col-span-full text-center py-16 text-gray-500">Aucun trajet ne correspond à vos filtres.</p>}
          </div>}
        </CardContent>
        {totalPages > 1 && (
            <CardFooter className="flex justify-between items-center border-t pt-4">
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
export default TrajetListPage;