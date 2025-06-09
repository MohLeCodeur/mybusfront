// src/pages/public/ClientDashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { FiClock, FiMapPin, FiBox, FiLoader } from 'react-icons/fi';

// Le composant Countdown n'a pas besoin de changer, mais on peut simplifier son onComplete
const Countdown = ({ targetDate, departureTime }) => {
    const targetDateTime = new Date(`${new Date(targetDate).toISOString().split('T')[0]}T${departureTime}:00`);
    const [timeLeft, setTimeLeft] = useState(targetDateTime.getTime() - new Date().getTime());

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    if (timeLeft <= 0) {
        return <span className="text-lg font-bold text-green-600">Départ imminent !</span>;
    }

    const formatTime = (value, label) => (
        <div className="text-center">
            <span className="text-2xl lg:text-4xl font-bold text-gray-800">{String(value).padStart(2, '0')}</span>
            <span className="block text-xs uppercase text-gray-500">{label}</span>
        </div>
    );

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <div className="flex justify-center gap-4 sm:gap-8">
            {days > 0 && formatTime(days, 'Jours')}
            { (days > 0 || hours > 0) && formatTime(hours, 'Heures')}
            { (days > 0 || hours > 0 || minutes > 0) && formatTime(minutes, 'Minutes')}
            {formatTime(seconds, 'Secondes')}
        </div>
    );
};

// Composant principal de la page
const ClientDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [nextTrip, setNextTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextTrip = () => {
      api.get('/tracking/my-next-trip')
          .then(res => setNextTrip(res.data))
          .catch(console.error)
          .finally(() => {
              if (loading) setLoading(false);
          });
    };

    fetchNextTrip();
    const intervalId = setInterval(fetchNextTrip, 15000); // Rafraîchit toutes les 15s
    return () => clearInterval(intervalId);
  }, [loading]); // le 'loading' ici assure que si on change de page, le re-render initial se fait

  const renderNextTrip = () => {
    if (loading) {
        return <div className="flex justify-center items-center h-24"><FiLoader className="animate-spin text-3xl"/></div>;
    }

    if (!nextTrip || !nextTrip.reservation) {
        return <p className="text-gray-500 text-center py-4">{nextTrip?.message || "Aucune réservation à venir."}</p>;
    }

    const { trajet } = nextTrip.reservation;
    const departureDateTime = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00`);
    const isFutureTrip = departureDateTime > new Date();
    
    return (
        <div>
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-center border-b pb-6">
                <div><strong className="block text-gray-500">Trajet</strong>{trajet.villeDepart} → {trajet.villeArrivee}</div>
                <div><strong className="block text-gray-500">Date</strong>{new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}</div>
                <div><strong className="block text-gray-500">Heure</strong>{trajet.heureDepart}</div>
            </div>
            
            {isFutureTrip ? (
                <div className="p-8 bg-blue-50 rounded-lg">
                    <h3 className="text-center text-lg font-medium mb-4 text-blue-800">Le départ est prévu dans :</h3>
                    <Countdown 
                        targetDate={trajet.dateDepart} 
                        departureTime={trajet.heureDepart}
                    />
                </div>
            ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    {nextTrip.liveTrip?.status === 'En cours' ? (
                        <Link to={`/tracking/map/${nextTrip.liveTrip._id}`} className="inline-block px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg hover:shadow-green-500/50">
                            <FiMapPin className="inline mr-2"/> Suivre mon bus en temps réel
                        </Link>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-700">
                            <FiLoader className="animate-spin text-2xl" />
                            <span>En attente du démarrage du voyage...</span>
                        </div>
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
        <p className="text-gray-500">La fonctionnalité de suivi de colis sera ajoutée ici.</p>
      </div>
    </div>
  );
};

export default ClientDashboardPage;