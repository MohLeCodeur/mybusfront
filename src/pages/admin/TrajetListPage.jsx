// src/pages/admin/TrajetListPage.jsx

import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { 
  FiPlus, FiEdit, FiTrash2, FiLoader, FiPlayCircle, FiStopCircle, FiBell, FiChevronDown,
  FiChevronLeft, FiChevronRight, FiCalendar, FiTag, FiCheckCircle, FiAlertTriangle 
} from 'react-icons/fi';
import { FaRoute } from 'react-icons/fa';

// ====================================================================
// NOUVEAU COMPOSANT INTERNE : Le Menu d'Actions
// C'est ici que toute la nouvelle logique se trouve.
// ====================================================================
const ActionMenu = ({ trajet, onActionStart, onActionEnd }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const fetchTrajets = onActionEnd; // Renommer pour la clarté

  // Fonctions pour appeler l'API, maintenant internes au menu
  const handleStartTrip = async (trajetId) => {
    setProcessing(true); onActionStart();
    try {
      await api.post('/tracking/start-trip', { trajetId });
      alert("Voyage démarré avec succès !");
      fetchTrajets();
    } catch (err) { alert("Erreur: " + (err.response?.data?.message || "Impossible de démarrer.")); } 
    finally { setProcessing(false); }
  };

  const handleEndTrip = async (liveTripId) => {
    if (!window.confirm("Voulez-vous vraiment marquer ce voyage comme 'Terminé' ?")) return;
    setProcessing(true); onActionStart();
    try {
      await api.post(`/tracking/end-trip/${liveTripId}`);
      alert("Voyage terminé.");
      fetchTrajets();
    } catch (err) { alert("Erreur: " + (err.response?.data?.message || "Impossible de terminer.")); }
    finally { setProcessing(false); }
  };
  
  const handleNotifyDelay = async (trajetId) => {
      if(!window.confirm("Envoyer une notification de retard à tous les passagers ?")) return;
      setProcessing(true); onActionStart();
      try {
          const res = await api.post('/tracking/notify-delay', { trajetId });
          alert(res.data.message);
      } catch(err) { alert("Erreur: " + (err.response?.data?.message || "Notification échouée.")); }
      finally { setProcessing(false); }
  };

  // Logique d'affichage
  const now = new Date();
  const departureDateTime = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00`);
  const oneHourBefore = new Date(departureDateTime.getTime() - 60 * 60 * 1000);
  const oneHourAfter = new Date(departureDateTime.getTime() + 60 * 60 * 1000);

  const isWithinStartWindow = now >= oneHourBefore && now <= oneHourAfter;
  const isDelayedAndNotStarted = now > departureDateTime && !(trajet.liveTrip && trajet.liveTrip.status);
  
  // CAS 1: Voyage en cours
  if (trajet.liveTrip && trajet.liveTrip.status === 'En cours') {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as={Button} size="sm" className="bg-blue-500 text-white hover:bg-blue-600 w-32 justify-between">
          En cours
          <FiChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => handleEndTrip(trajet.liveTrip._id)} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <FiStopCircle className="mr-2 h-5 w-5 text-red-500" aria-hidden="true" />
                    Terminer le voyage
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }

  // CAS 2: Voyage terminé
  if (trajet.liveTrip && trajet.liveTrip.status === 'Terminé') {
    return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full"><FiCheckCircle /> Terminé</span>;
  }

  // CAS 3: Voyage en retard (heure de départ passée, mais pas démarré)
  if (isDelayedAndNotStarted) {
     return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as={Button} size="sm" className="bg-yellow-500 text-white hover:bg-yellow-600 w-32 justify-between">
          Action Requise
          <FiChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {now <= oneHourAfter && ( // On peut encore démarrer jusqu'à 1h après
                 <Menu.Item>
                  {({ active }) => (
                    <button onClick={() => handleStartTrip(trajet._id)} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      <FiPlayCircle className="mr-2 h-5 w-5 text-green-500" aria-hidden="true" /> Démarrer (en retard)
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => handleNotifyDelay(trajet._id)} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <FiBell className="mr-2 h-5 w-5 text-blue-500" aria-hidden="true" /> Notifier du retard
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                 {({ active }) => (
                  <button onClick={() => handleEndTrip(trajet.liveTrip?._id)} disabled={!trajet.liveTrip} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-50`}>
                     <FiTrash2 className="mr-2 h-5 w-5 text-red-500" aria-hidden="true" /> Annuler/Terminer
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }

  // CAS 4: Prêt à partir (dans la fenêtre de temps)
  if (isWithinStartWindow) {
    return (
      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white w-32 justify-center" onClick={() => handleStartTrip(trajet._id)} disabled={processing}>
        {processing ? <FiLoader className="animate-spin"/> : <><FiPlayCircle className="mr-1"/> Démarrer</>}
      </Button>
    );
  }

  // CAS 5: Par défaut (trajet trop dans le futur ou passé sans suivi)
  return <span className="text-xs italic text-gray-400">À venir</span>;
};


// ====================================================================
// COMPOSANT PRINCIPAL DE LA PAGE (légèrement modifié)
// ====================================================================
const TrajetListPage = () => {
  const [allTrajets, setAllTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('avenir');
  const [currentPage, setCurrentPage] = useState(1);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const ITEMS_PER_PAGE = 8;

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
        setIsActionProcessing(true);
        try {
            await api.delete(`/admin/trajets/${id}`);
            fetchTrajets();
        } catch(err) { alert("Erreur: " + err.response?.data?.message) }
        finally { setIsActionProcessing(false) }
    }
  };

  const sortedTrajets = useMemo(() => {
    return [...allTrajets].sort((a, b) => {
      const dateA = new Date(a.dateDepart);
      const dateB = new Date(b.dateDepart);
      return statusFilter === 'passes' ? dateB - dateA : dateA - dateB;
    });
  }, [allTrajets, statusFilter]);
  
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
              <CardDescription>Filtrez pour organiser vos voyages.</CardDescription>
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border-gray-300 rounded-md text-sm p-2 bg-white">
                <option value="avenir">À venir</option>
                <option value="passes">Passés</option>
                <option value="tous">Tous</option>
            </select>
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
                        <span className="flex items-center gap-1 font-semibold"><FiTag size={14}/> {t.prix.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Bus: <span className="font-semibold">{t.bus?.numero || 'Non assigné'}</span></p>
                        <div className="flex gap-2 items-center">
                            {/* Utilisation du nouveau menu d'actions */}
                            <ActionMenu 
                                trajet={t} 
                                onActionStart={() => setIsActionProcessing(true)} 
                                onActionEnd={fetchTrajets} 
                            />
                            <Button size="sm" variant="outline" onClick={() => navigate(`/admin/trajets/${t._id}/edit`)} title="Modifier" disabled={isActionProcessing}><FiEdit/></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id, `${t.villeDepart} → ${t.villeArrivee}`)} title="Supprimer" disabled={isActionProcessing}><FiTrash2/></Button>
                        </div>
                    </div>
                </div>
            )) : <p className="col-span-full text-center py-10 text-gray-500">Aucun trajet ne correspond à vos filtres.</p>}
          </div>}
         </CardContent>
        {totalPages > 1 && (
            <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Page {currentPage} sur {totalPages}</span>
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