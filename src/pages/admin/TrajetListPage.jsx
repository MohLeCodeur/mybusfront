import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { 
  FiPlus, FiEdit, FiLoader, FiPlayCircle, FiStopCircle, FiBell, FiChevronDown,
  FiChevronLeft, FiChevronRight, FiCalendar, FiTag, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import { FaRoute } from 'react-icons/fa';

// ====================================================================
// COMPOSANT INTERNE : Le Menu d'Actions (LOGIQUE FINALE)
// ====================================================================
const ActionMenu = ({ trajet, onActionStart, onActionEnd }) => {
  const [processing, setProcessing] = useState(false);

  const fetchTrajets = onActionEnd;

  const handleApiCall = async (apiFunc, successMsg) => {
    setProcessing(true);
    onActionStart();
    try {
      const res = await apiFunc();
      // Si un message de succès est fourni, on l'affiche. Sinon, on se fie au message du backend.
      alert(successMsg || res.data.message);
      fetchTrajets();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.message || "Une erreur est survenue."));
    } finally {
      setProcessing(false);
    }
  };

  const startTrip = () => handleApiCall(
    () => api.post('/tracking/start-trip', { trajetId: trajet._id }),
    "Voyage démarré avec succès !"
  );

  const endTrip = () => {
    if (!window.confirm("Voulez-vous vraiment marquer ce voyage comme 'Terminé' ?")) return;
    handleApiCall(
      () => api.post(`/tracking/end-trip/${trajet.liveTrip._id}`),
      "Voyage terminé."
    );
  };
  
  const notifyDelay = () => {
    if (!window.confirm("Envoyer une notification de retard à tous les passagers ?")) return;
    handleApiCall(
      () => api.post('/tracking/notify-delay', { trajetId: trajet._id }),
      null // Le message de succès vient du backend
    );
  };
  
  const cancelTrajet = () => {
    if (!window.confirm("Voulez-vous vraiment annuler ce trajet ? Il ne sera plus visible et son suivi sera arrêté.")) return;
    handleApiCall(
      () => api.put(`/admin/trajets/${trajet._id}/cancel`),
      "Trajet annulé."
    );
  };

  // Logique d'affichage
  const now = new Date();
  const departureDateTime = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00Z`);
  const oneHourBefore = new Date(departureDateTime.getTime() - 60 * 60 * 1000);
  const isDelayedAndNotStarted = now > departureDateTime && !(trajet.liveTrip && trajet.liveTrip.status === 'En cours');
  
  // --- NOUVELLE CONDITION STRICTE POUR LE DÉMARRAGE ---
  const canStartTrip = now >= oneHourBefore && now <= departureDateTime;

  const renderMenuButton = (text, style) => (
    <Menu.Button as={Button} size="sm" className={`${style} w-32 justify-between`} disabled={processing}>
      {processing ? <FiLoader className="animate-spin" /> : text}
      <FiChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
    </Menu.Button>
  );

  const renderMenuItem = (text, icon, action) => (
    <Menu.Item>
      {({ active }) => (
        <button onClick={action} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
          {icon} {text}
        </button>
      )}
    </Menu.Item>
  );

  // CAS 1: Voyage en cours
  if (trajet.liveTrip && trajet.liveTrip.status === 'En cours') {
    return (
      <Menu as="div" className="relative inline-block text-left">
        {renderMenuButton("En cours", "bg-blue-500 text-white hover:bg-blue-600")}
        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {renderMenuItem("Terminer le voyage", <FiStopCircle className="mr-2 h-5 w-5 text-red-500" />, endTrip)}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }

  // CAS 2: Voyage terminé ou annulé
  if ((trajet.liveTrip && ['Terminé', 'Annulé'].includes(trajet.liveTrip.status)) || !trajet.isActive) {
    const isCancelled = !trajet.isActive || trajet.liveTrip?.status === 'Annulé';
    return <span className={`flex items-center gap-1.5 px-3 py-1 ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'} text-xs font-semibold rounded-full`}>{isCancelled ? <FiXCircle /> : <FiCheckCircle />} {isCancelled ? 'Annulé' : 'Terminé'}</span>;
  }
  
  // CAS 3: Voyage à venir et dans la fenêtre de démarrage
  if (canStartTrip) {
      return (
        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white w-32 justify-center" onClick={startTrip} disabled={processing}>
          {processing ? <FiLoader className="animate-spin"/> : <><FiPlayCircle className="mr-1"/> Démarrer</>}
        </Button>
      );
  }

  // CAS 4: Voyage en retard (heure passée, non démarré, toujours actif)
  if (isDelayedAndNotStarted) {
     return (
      <Menu as="div" className="relative inline-block text-left">
        {renderMenuButton("Action Requise", "bg-yellow-500 text-white hover:bg-yellow-600")}
        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {renderMenuItem("Démarrer (en retard)", <FiPlayCircle className="mr-2 h-5 w-5 text-green-500" />, startTrip)}
              {renderMenuItem("Notifier du retard", <FiBell className="mr-2 h-5 w-5 text-blue-500" />, notifyDelay)}
              {renderMenuItem("Annuler le trajet", <FiXCircle className="mr-2 h-5 w-5 text-red-500" />, cancelTrajet)}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }
  
  // CAS 5: Voyage trop dans le futur
  if (now < oneHourBefore) {
    return <span className="text-xs italic text-gray-400">À venir</span>;
  }
  
  return null;
};


// ====================================================================
// COMPOSANT PRINCIPAL DE LA PAGE
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
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t.isActive ? 'Actif' : 'Inactif'}</span>
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
                            <ActionMenu 
                                trajet={t} 
                                onActionStart={() => setIsActionProcessing(true)} 
                                onActionEnd={fetchTrajets} 
                            />
                            {/* --- Bouton de suppression retiré, mais on garde le bouton "Modifier" --- */}
                            <Button size="sm" variant="outline" onClick={() => navigate(`/admin/trajets/${t._id}/edit`)} title="Modifier" disabled={isActionProcessing}><FiEdit/></Button>
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