// src/pages/public/ClientDashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { FiClock, FiMapPin, FiBox, FiLoader } from 'react-icons/fi';

// === COMPOSANT COUNTDOWN CORRIGÉ ===
const Countdown = ({ targetDate, departureTime }) => {
    
    // Combine la date du trajet et l'heure de départ pour créer un objet Date complet
    const targetDateTime = new Date(`${targetDate.split('T')[0]}T${departureTime}:00`);

    const calculateTimeLeft = () => {
        // Obtenir le timestamp actuel en UTC
        const now_utc = new Date().getTime();
        // Obtenir le timestamp de la date cible en UTC
        const target_utc = targetDateTime.getTime();

        const difference_utc = target_utc - now_utc;

        let timeLeft = {};
        if (difference_utc > 0) {
            timeLeft = {
                Jours: Math.floor(difference_utc / (1000 * 60 * 60 * 24)),
                Heures: Math.floor((difference_utc / (1000 * 60 * 60)) % 24),
                Minutes: Math.floor((difference_utc / 1000 / 60) % 60),
                Secondes: Math.floor((difference_utc / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
        if (!value && interval !== 'Jours' && timeLeft.Jours === 0) {
            if (!value && interval !== 'Heures' && timeLeft.Heures === 0) {
                if (!value && interval !== 'Minutes' && timeLeft.Minutes === 0) {
                    return null;
                }
            }
        }
        return (
            <div key={interval} className="text-center">
                <span className="text-2xl lg:text-4xl font-bold">{String(value).padStart(2, '0')}</span>
                <span className="block text-xs uppercase">{interval}</span>
            </div>
        );
    });

    return (
        <div>
            {Object.keys(timeLeft).length > 0 ? (
                <div className="flex justify-center gap-4 sm:gap-8">{timerComponents}</div>
            ) : (
                <span className="text-lg font-bold text-green-500">Heure de départ atteinte !</span>
            )}
        </div>
    );
};
// =====================================

const ClientDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [nextTrip, setNextTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tracking/my-next-trip')
        .then(res => setNextTrip(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      <h1 className="text-4xl font-bold text-gray-800">Bonjour, {user?.prenom} !</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiClock/> Mon Prochain Voyage</h2>
        {nextTrip && nextTrip.reservation ? (
            <div>
                <div className="grid md:grid-cols-3 gap-4 mb-8 text-center border-b pb-6">
                    <div><strong className="block text-gray-500">Trajet</strong>{nextTrip.reservation.trajet.villeDepart} → {nextTrip.reservation.trajet.villeArrivee}</div>
                    <div><strong className="block text-gray-500">Date</strong>{new Date(nextTrip.reservation.trajet.dateDepart).toLocaleDateString('fr-FR')}</div>
                    <div><strong className="block text-gray-500">Heure</strong>{nextTrip.reservation.trajet.heureDepart}</div>
                </div>
                
                {new Date(nextTrip.reservation.trajet.dateDepart) > new Date() ? (
                    <div className="p-8 bg-blue-50 rounded-lg">
                        <h3 className="text-center text-lg font-medium mb-4 text-blue-800">Le départ est prévu dans :</h3>
                        {/* On passe la date et l'heure séparément */}
                        <Countdown 
                            targetDate={nextTrip.reservation.trajet.dateDepart} 
                            departureTime={nextTrip.reservation.trajet.heureDepart} 
                        />
                    </div>
                ) : (
                    <div className="text-center">
                        {nextTrip.liveTrip?.status === 'En cours' ? (
                            <Link to={`/tracking/map/${nextTrip.liveTrip._id}`} className="inline-block px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition">
                                <FiMapPin className="inline mr-2"/> Suivre mon bus en temps réel
                            </Link>
                        ) : (
                            <p className="p-4 bg-gray-100 rounded-lg">Votre voyage est sur le point de commencer ou est déjà terminé.</p>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <p className="text-gray-500">{nextTrip?.message || "Vous n'avez aucune réservation de voyage à venir."}</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiBox/> Suivre un Colis</h2>
        {/* Intégrer ici le formulaire de suivi de colis (PublicColisTrackingPage en tant que composant) */}
      </div>
    </div>
  );
};

export default ClientDashboardPage;