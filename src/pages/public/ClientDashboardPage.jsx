// src/pages/public/ClientDashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { FiClock, FiMapPin, FiBox, FiLoader, FiCheckCircle, FiArchive, FiPlusCircle, FiArrowRight } from 'react-icons/fi';
import { Button } from '../../components/ui/Button.jsx';

// --- WIDGET 1 : Compte à rebours ---
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
            {(days > 0 || hours > 0) && formatTime(hours, 'Heures')}
            {(days > 0 || hours > 0 || minutes > 0) && formatTime(minutes, 'Minutes')}
            {formatTime(seconds, 'Secondes')}
        </div>
    );
};

// --- WIDGET 2 : Prochain Voyage (LOGIQUE CORRIGÉE) ---
const NextTripWidget = ({ tripData }) => {
    if (!tripData || !tripData.reservation) {
        return <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">{tripData?.message || "Aucune réservation de voyage à venir."}</div>;
    }
    const { trajet } = tripData.reservation;
    const departureDateTime = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00`);
    const isFuture = departureDateTime > new Date();
    
    // La condition clé : y a-t-il un suivi activé pour ce voyage ?
    const canTrack = !!tripData.liveTrip;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
                <div><strong className="block text-gray-500">Trajet</strong>{trajet.villeDepart} → {trajet.villeArrivee}</div>
                <div><strong className="block text-gray-500">Date</strong>{new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}</div>
                <div><strong className="block text-gray-500">Heure</strong>{trajet.heureDepart}</div>
            </div>
            
            {/* Si un suivi existe, on affiche TOUJOURS le bouton pour le voir */}
            {canTrack ? (
                 <div className="text-center mt-4">
                    <Link to={`/tracking/map/${tripData.liveTrip._id}`} className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg hover:shadow-green-500/50">
                        <FiMapPin className="inline mr-2"/> Voir le Suivi du Voyage
                    </Link>
                </div>
            ) : isFuture ? (
                // Sinon, si le voyage est dans le futur, on affiche le compte à rebours
                <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-center text-lg font-medium mb-4 text-blue-800">Départ dans :</h3>
                    <Countdown targetDate={trajet.dateDepart} departureTime={trajet.heureDepart} />
                </div>
            ) : (
                // Sinon, si le voyage est passé ET sans suivi, on affiche un message
                <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                    Le suivi pour ce voyage n'a pas été activé.
                </div>
            )}
        </div>
    );
};

// --- WIDGET 3 : Historique des Voyages ---
const PastTripsWidget = ({ trips }) => {
    if (!trips || trips.length === 0) {
        return <p className="text-center text-gray-400 py-4">Aucun voyage passé trouvé.</p>;
    }
    return (
        <ul className="space-y-3">
            {trips.map(trip => (
                <li key={trip._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                        <p className="font-medium">{trip.trajet.villeDepart} → {trip.trajet.villeArrivee}</p>
                        <p className="text-sm text-gray-500">Le {new Date(trip.trajet.dateDepart).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <FiCheckCircle className="text-green-500 text-xl"/>
                </li>
            ))}
        </ul>
    );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const ClientDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/client-data')
            .then(res => setDashboardData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const canBookNewTrip = !dashboardData?.nextTrip?.reservation;

    if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Bienvenue, <span className="text-blue-600">{user?.prenom}</span> !
                </h1>
                
                {canBookNewTrip && (
                    <button 
                        onClick={() => navigate('/search')} 
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/50 w-full md:w-auto"
                    >
                        <FiPlusCircle/> Réserver un Nouveau Voyage
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-700"><FiClock/> Mon Prochain Voyage</h2>
                        <NextTripWidget tripData={dashboardData?.nextTrip} />
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-700"><FiBox/> Suivi de Colis</h2>
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <p className="text-gray-600 mb-4">Avez-vous un code de suivi ? Vérifiez le statut de votre colis ici.</p>
                            <Button onClick={() => navigate('/track-colis')} className="w-full md:w-auto">
                                Suivre un Colis <FiArrowRight className="ml-2"/>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-700"><FiArchive/> Historique des Voyages</h2>
                        <PastTripsWidget trips={dashboardData?.pastTrips} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboardPage;