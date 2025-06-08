// src/pages/public/ClientDashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { FiClock, FiMapPin, FiBox, FiLoader } from 'react-icons/fi';

// Composant pour le compte à rebours
const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
                heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                secondes: Math.floor((difference / 1000) % 60)
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

    const timerComponents = Object.keys(timeLeft).map(interval => {
        if (!timeLeft[interval] && interval !== 'jours' && timeLeft.jours === 0) {
            return null;
        }
        return (
            <div key={interval} className="text-center">
                <span className="text-2xl lg:text-4xl font-bold">{timeLeft[interval]}</span>
                <span className="block text-xs uppercase">{interval}</span>
            </div>
        );
    });

    return (
        <div>
            {Object.keys(timeLeft).length ? (
                <div className="flex justify-center gap-4">{timerComponents}</div>
            ) : (
                <span className="text-lg text-green-500">Heure de départ atteinte !</span>
            )}
        </div>
    );
};

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
      
      {/* Widget du prochain voyage */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiClock/> Mon Prochain Voyage</h2>
        {nextTrip && nextTrip.reservation ? (
            <div>
                <div className="grid md:grid-cols-3 gap-4 mb-8 text-center">
                    <div><strong className="block text-gray-500">Trajet</strong>{nextTrip.reservation.trajet.villeDepart} → {nextTrip.reservation.trajet.villeArrivee}</div>
                    <div><strong className="block text-gray-500">Date</strong>{new Date(nextTrip.reservation.trajet.dateDepart).toLocaleDateString('fr-FR')}</div>
                    <div><strong className="block text-gray-500">Heure</strong>{nextTrip.reservation.trajet.heureDepart}</div>
                </div>
                
                {new Date(nextTrip.reservation.trajet.dateDepart) > new Date() ? (
                    <div className="p-8 bg-blue-50 rounded-lg">
                        <h3 className="text-center text-lg font-medium mb-4">Départ dans :</h3>
                        <Countdown targetDate={nextTrip.reservation.trajet.dateDepart} />
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
            <p className="text-gray-500">Vous n'avez aucune réservation de voyage à venir.</p>
        )}
      </div>

      {/* Widget de suivi de colis */}
      {/* On peut réutiliser le composant de la page publique ici */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FiBox/> Suivre un Colis</h2>
        {/* Intégrer ici le formulaire de suivi de colis */}
      </div>
    </div>
  );
};

export default ClientDashboardPage;