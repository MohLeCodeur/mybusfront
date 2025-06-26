import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import NotificationContext from '../../context/NotificationContext';
import { FiClock, FiMapPin, FiLoader, FiCheckCircle, FiArchive, FiPlusCircle, FiCalendar, FiSend, FiTrendingUp, FiAward, FiStar } from 'react-icons/fi';

// ====================================================================
// WIDGET INTERNE : Compte à rebours
// ====================================================================
const CountdownDisplay = ({ targetDateTime }) => {
    const [timeLeft, setTimeLeft] = useState(targetDateTime.getTime() - new Date().getTime());
    
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setTimeout(() => {
            setTimeLeft(timeLeft - 1000);
        }, 1000);
        return () => clearTimeout(timerId);
    }, [timeLeft]);
    
    if (timeLeft <= 0) {
        return <div className="text-2xl font-bold text-green-500 animate-pulse">Départ imminent !</div>;
    }
    
    const d = Math.floor(timeLeft / (36e5 * 24));
    const h = Math.floor((timeLeft / 36e5) % 24);
    const m = Math.floor((timeLeft / 6e4) % 60);
    const s = Math.floor((timeLeft / 1e3) % 60);
    
    const formatTime = (value, label) => (
        <div className="text-center w-16">
            <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-blue-500">
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-xs uppercase text-gray-400 tracking-wider mt-1">{label}</div>
        </div>
    );
    
    return (
        <div className="flex justify-center gap-2 sm:gap-4">
            {d > 0 && formatTime(d, 'Jours')}
            {(d > 0 || h > 0) && formatTime(h, 'Heures')}
            {(d > 0 || h > 0 || m > 0) && formatTime(m, 'Minutes')}
            {formatTime(s, 'Secondes')}
        </div>
    );
};

// ====================================================================
// WIDGET INTERNE : Carte de Réservation dans l'historique
// ====================================================================
const TripCard = ({ reservation }) => {
    if (!reservation?.trajet) return null;
    const { trajet, liveTrip } = reservation;
    
    let statusInfo = { text: 'Terminé', icon: <FiCheckCircle size={13}/>, style: 'bg-green-100 text-green-700' };
    const departureDateTime = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00Z`);

    if (liveTrip && liveTrip.status === 'En cours') {
        statusInfo = { text: 'En cours', icon: <FiClock size={13}/>, style: 'bg-blue-100 text-blue-700 animate-pulse' };
    } else if (departureDateTime > new Date()) {
        statusInfo = { text: 'À venir', icon: <FiSend size={13}/>, style: 'bg-pink-100 text-pink-700' };
    }
    
    return (
        <li className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 border rounded-xl hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-blue-50/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4 flex-grow">
                <div className={`shrink-0 h-12 w-12 rounded-lg flex flex-col items-center justify-center ${departureDateTime > new Date() ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="text-xs font-bold">{new Date(trajet.dateDepart).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-lg font-bold">{new Date(trajet.dateDepart).getDate()}</span>
                </div>
                <div>
                    <p className="font-bold text-gray-800">{trajet.villeDepart} → {trajet.villeArrivee}</p>
                    <p className="text-sm text-gray-500 mt-1">{trajet.compagnie}</p>
                </div>
            </div>
            <span className={`shrink-0 mt-2 sm:mt-0 flex items-center gap-1.5 px-3 py-1 ${statusInfo.style} text-xs font-semibold rounded-full`}>
                {statusInfo.icon} {statusInfo.text}
            </span>
        </li>
    );
};

// ====================================================================
// WIDGET INTERNE : Voyage à la une (LOGIQUE CORRIGÉE)
// ====================================================================
const FeaturedTripWidget = ({ data }) => {
    if (!data) {
        return (
            <div className="text-center p-8 bg-gradient-to-br from-pink-50 via-blue-50 to-white rounded-2xl flex flex-col items-center justify-center h-full">
                <FiMapPin className="text-5xl text-blue-300 mb-4"/>
                <p className="text-gray-600 mb-4 font-semibold">Vous n'avez aucun voyage programmé.</p>
                <Link to="/search" className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition">
                    Réserver mon premier voyage
                </Link>
            </div>
        );
    }
    
    const { trajet, liveTrip } = data;
    const departureDateTime = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00Z`);
    
    const isFuture = departureDateTime > new Date();
    const isLive = liveTrip && liveTrip.status === 'En cours';
    // --- NOUVELLE CONDITION POUR UN VOYAGE TERMINÉ ---
    const isFinished = liveTrip && liveTrip.status === 'Terminé';

    return (
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col">
            <div className="p-6">
                <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
                    {isLive ? "VOYAGE EN COURS" : isFinished ? "VOYAGE TERMINÉ" : "VOTRE PROCHAIN VOYAGE"}
                </p>
                <h3 className="font-bold text-3xl text-gray-800 mt-1">{trajet.villeDepart} → {trajet.villeArrivee}</h3>
                <p className="text-sm text-gray-500 mt-1">{new Date(trajet.dateDepart).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {trajet.heureDepart}</p>
            </div>
            <div className="flex-grow flex items-center justify-center p-6 bg-gray-50/50">
                {isLive ? (
                    <Link to={`/tracking/map/${liveTrip._id}`} className="inline-block px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg hover:shadow-green-400/50 text-base animate-pulse">
                        <FiMapPin className="inline mr-2"/> Suivre en Temps Réel
                    </Link>
                ) : isFinished ? ( // --- NOUVEAU BLOC D'AFFICHAGE POUR LE STATUT "TERMINÉ" ---
                    <div className="text-center text-green-600">
                        <FiCheckCircle className="mx-auto text-5xl mb-2" />
                        <h4 className="font-bold text-lg">Voyage Terminé</h4>
                        <p className="text-sm text-gray-500">Ce voyage est arrivé à destination.</p>
                    </div>
                ) : isFuture ? (
                    <CountdownDisplay targetDateTime={departureDateTime} />
                ) : (
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                        <h4 className="font-semibold">Veuillez patienter...</h4>
                        <p className="text-sm">Le départ n'a pas encore été lancé par la compagnie.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ====================================================================
// WIDGET INTERNE : Statistiques
// ====================================================================
const StatsWidget = ({ upcomingCount, pastCount }) => {
    const StatItem = ({ value, label, icon, gradient }) => (
        <div className={`relative p-4 rounded-xl overflow-hidden ${gradient}`}>
            <div className="relative z-10">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-white/80">{label}</p>
            </div>
            <div className="absolute -bottom-2 -right-2 text-white/20 text-5xl">{icon}</div>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl shadow-xl border border-white p-6 h-full">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-3"><FiTrendingUp/> En bref</h2>
            <div className="space-y-4">
                <StatItem value={(upcomingCount || 0) + (pastCount || 0)} label="Voyages au total" icon={<FiAward />} gradient="bg-gradient-to-br from-blue-500 to-blue-400"/>
                <StatItem value={upcomingCount} label="Voyages à venir" icon={<FiSend />} gradient="bg-gradient-to-br from-pink-500 to-fuchsia-500" />
                <StatItem value={pastCount} label="Voyages terminés" icon={<FiArchive />} gradient="bg-gradient-to-br from-gray-600 to-gray-500" />
            </div>
        </div>
    );
};

// ====================================================================
// COMPOSANT PRINCIPAL DE LA PAGE
// ====================================================================
const ClientDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const { refetchTrigger } = useContext(NotificationContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    const fetchDashboardData = useCallback(() => {
        if (!dashboardData) setLoading(true); 
        api.get('/dashboard/client-data')
            .then(res => setDashboardData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [dashboardData]);

    useEffect(() => {
        fetchDashboardData();
    }, [refetchTrigger, fetchDashboardData]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;
    }

    const TabButton = ({ tabName, label, icon, count }) => (
        <button 
            onClick={() => setActiveTab(tabName)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tabName ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
        >
            {icon} {label} <span className="bg-white/20 text-xs rounded-full px-2 py-0.5">{count}</span>
        </button>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                  Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">{user?.prenom}</span> !
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch mb-12">
                    <div className="lg:col-span-3">
                        <FeaturedTripWidget data={dashboardData?.tripToDisplay} />
                    </div>
                    <div className="lg:col-span-2">
                        <StatsWidget 
                            upcomingCount={dashboardData?.upcomingTrips?.length || 0} 
                            pastCount={dashboardData?.pastTrips?.length || 0}
                        />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-3"><FiStar/> Mes Réservations</h2>
                        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-full">
                            <TabButton tabName="upcoming" label="À venir" icon={<FiSend/>} count={dashboardData?.upcomingTrips?.length || 0} />
                            <TabButton tabName="past" label="Historique" icon={<FiArchive/>} count={dashboardData?.pastTrips?.length || 0} />
                        </div>
                    </div>
                    
                    <ul className="space-y-3">
                        {activeTab === 'upcoming' && (
                            dashboardData?.upcomingTrips?.length > 0 ?
                                dashboardData.upcomingTrips.map(trip => <TripCard key={trip._id} reservation={trip} />) :
                                <p className="text-center text-gray-500 py-6">Vous n'avez pas d'autre voyage programmé.</p>
                        )}
                        {activeTab === 'past' && (
                            dashboardData?.pastTrips?.length > 0 ?
                                dashboardData.pastTrips.map(trip => <TripCard key={trip._id} reservation={trip} />) :
                                <p className="text-center text-gray-500 py-6">Vous n'avez aucun voyage dans votre historique.</p>
                        )}
                    </ul>
                     <Link to="/search" className="mt-6 w-full block text-center px-4 py-3 bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 text-blue-800 font-bold rounded-lg hover:shadow-lg hover:brightness-105 transition">
                        <FiPlusCircle className="inline mr-2"/> Réserver un Nouveau Voyage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboardPage;