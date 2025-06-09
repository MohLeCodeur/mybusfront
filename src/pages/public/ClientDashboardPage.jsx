// src/pages/public/ClientDashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { FiClock, FiMapPin, FiBox, FiLoader } from 'react-icons/fi';

// Composant interne pour le compte à rebours
const Countdown = ({ targetDate, departureTime }) => {
    // Crée une date/heure de départ précise en combinant la date et l'heure
    const targetDateTime = new Date(`${new Date(targetDate).toISOString().split('T')[0]}T${departureTime}:00`);

    const calculateTimeLeft = () => {
        const difference = targetDateTime.getTime() - new Date().getTime();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                Jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
                Heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
                Minutes: Math.floor((difference / 1000 / 60) % 60),
                Secondes: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        // Met à jour le compte à rebours chaque seconde
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        // Nettoie le timer quand le composant est démonté
        return () => clearTimeout(timer);
    });

    // Formate l'affichage pour n'afficher que les unités de temps pertinentes
    const timerComponents = Object.entries(timeLeft)
        .filter(([interval, value], index) => {
            // Logique pour n'afficher que les unités de temps non nulles
            const nonZeroEntries = Object.values(timeLeft).slice(0, index);
            return value > 0 || nonZeroEntries.some(v => v > 0);
        })
        .map(([interval, value]) => (
            <div key={interval} className="text-center">
                <span className="text-2xl lg:text-4xl font-bold text-gray-800">{String(value).padStart(2, '0')}</span>
                <span className="block text-xs uppercase text-gray-500">{interval}</span>
            </div>
        ));

    return (
        <div>
            {timerComponents.length > 0 ? (
                <div className="flex justify-center gap-4 sm:gap-8">{timerComponents}</div>
            ) : (
                <span className="text-lg font-bold text-green-600">Départ imminent !</span>
            )}
        </div>
    );
};


// Composant principal de la page
const ClientDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [nextTrip, setNextTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupère le prochain voyage du client au chargement de la page
    api.get('/tracking/my-next-trip')
        .then(res => setNextTrip(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  // Affiche un état de chargement
  if (loading) return (
    <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-500"/>
    </div>
  );

  // Fonction de rendu pour la section "Mon Prochain Voyage"
  const renderNextTrip = () => {
    // Si pas de voyage trouvé, affiche le message du backend
    if (!nextTrip || !nextTrip.reservation) {
        return <p className="text-gray-500 text-center py-4">{nextTrip?.message || "Vous n'avez aucune réservation de voyage à venir."}</p>;
    }

    const { trajet } = nextTrip.reservation;
    
    // Construit la date/heure de départ complète pour une comparaison précise
    const departureDateTime = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00`);
    const now = new Date();

    // Condition principale : le départ est-il dans le futur ?
    const isFutureTrip = departureDateTime > now;
    
    return (
        <div>
            {/* Affichage des détails du trajet */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-center border-b pb-6">
                <div><strong className="block text-gray-500">Trajet</strong>{trajet.villeDepart} → {trajet.villeArrivee}</div>
                <div><strong className="block text-gray-500">Date</strong>{new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}</div>
                <div><strong className="block text-gray-500">Heure</strong>{trajet.heureDepart}</div>
            </div>
            
            {isFutureTrip ? (
                // CAS 1: Le départ est dans le futur -> Affiche le compte à rebours
                <div className="p-8 bg-blue-50 rounded-lg">
                    <h3 className="text-center text-lg font-medium mb-4 text-blue-800">Le départ est prévu dans :</h3>
                    <Countdown 
                        targetDate={trajet.dateDepart} 
                        departureTime={trajet.heureDepart} 
                    />
                </div>
            ) : (
                // CAS 2: L'heure de départ est passée
                <div className="text-center">
                    {nextTrip.liveTrip?.status === 'En cours' ? (
                        // CAS 2a: Le voyage a été démarré par un admin -> Affiche le lien de suivi
                        <Link to={`/tracking/map/${nextTrip.liveTrip._id}`} className="inline-block px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg hover:shadow-green-500/50">
                            <FiMapPin className="inline mr-2"/> Suivre mon bus en temps réel
                        </Link>
                    ) : (
                        // CAS 2b: Le voyage n'a pas encore démarré ou est terminé -> Affiche un message
                        <p className="p-4 bg-gray-100 rounded-lg text-gray-700">Votre voyage est sur le point de commencer ou est déjà terminé.</p>
                    )}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      <h1 className="text-4xl font-bold text-gray-800">Bonjour, {user?.prenom} !</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiClock/> Mon Prochain Voyage</h2>
        {renderNextTrip()}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiBox/> Suivre un Colis</h2>
        {/* Vous pouvez intégrer ici le composant de suivi de colis de PublicColisTrackingPage */}
        <p className="text-gray-500">La fonctionnalité de suivi de colis sera ajoutée ici.</p>
      </div>
    </div>
  );
};

export default ClientDashboardPage;