// src/pages/public/ClientDashboardPage.jsx (CODE COMPLET ET AMÉLIORÉ)

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { FiClock, FiMapPin, FiBox, FiLoader, FiCheckCircle, FiArchive, FiPlusCircle, FiSearch, FiXCircle, FiCalendar, FiSend } from 'react-icons/fi';
import StatusStepper from '../../components/admin/StatusStepper.jsx';

// ==================================================================
// WIDGETS INTERNES (Légèrement modifiés ou nouveaux)
// ==================================================================

// --- WIDGET 1 : Compte à rebours (inchangé) ---
const CountdownDisplay = ({ targetDateTime }) => {
    // ... (le code de ce composant reste identique)
    const [timeLeft, setTimeLeft] = useState(targetDateTime.getTime() - new Date().getTime());
    useEffect(() => { if (timeLeft <= 0) return; const timerId = setTimeout(() => { setTimeLeft(timeLeft - 1000); }, 1000); return () => clearTimeout(timerId); }, [timeLeft]);
    if (timeLeft <= 0) { return <span className="text-lg font-bold text-green-500 animate-pulse">Départ imminent !</span>; }
    const formatTime = (v, l) => (<div className="text-center w-16"><span className="text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-blue-500">{String(v).padStart(2, '0')}</span><span className="block text-xs uppercase text-gray-500 tracking-wider">{l}</span></div>);
    const d = Math.floor(timeLeft / (36e5 * 24)), h = Math.floor((timeLeft / 36e5) % 24), m = Math.floor((timeLeft / 6e4) % 60), s = Math.floor((timeLeft / 1e3) % 60);
    return (<div className="flex justify-center gap-2 sm:gap-4">{d > 0 && formatTime(d, 'Jours')}{ (d > 0 || h > 0) && formatTime(h, 'Heures')}{(d > 0 || h > 0 || m > 0) && formatTime(m, 'Minutes')}{formatTime(s, 'Secondes')}</div>);
};

// --- WIDGET 2 : Carte de Voyage (Réutilisable) ---
const TripCard = ({ reservation }) => {
    if (!reservation?.trajet) return null;
    const { trajet } = reservation;
    const isFuture = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00Z`) > new Date();

    return (
        <li className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 border rounded-lg hover:bg-gray-50/80 hover:shadow-sm transition-all">
            <div className="flex-grow">
                <p className="font-bold text-gray-800">{trajet.villeDepart} → {trajet.villeArrivee}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1.5"><FiCalendar size={13}/> {new Date(trajet.dateDepart).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                    <span className="flex items-center gap-1.5"><FiClock size={13}/> {trajet.heureDepart}</span>
                </div>
            </div>
            {isFuture ? (
                 <Link to="/search" className="shrink-0 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200">Voir détails</Link>
            ) : (
                <span className="flex items-center gap-1.5 shrink-0 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"><FiCheckCircle size={13}/> Terminé</span>
            )}
        </li>
    );
};

// --- WIDGET 3 : Voyage à la Une (Amélioré) ---
const FeaturedTripWidget = ({ data }) => {
    if (!data || !data.reservation) {
        return (
            <div className="text-center p-8 bg-gray-50/50 rounded-lg">
                <p className="text-gray-600 mb-4">Vous n'avez aucun voyage à venir.</p>
                <Link to="/search" className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition">
                    Réserver un voyage
                </Link>
            </div>
        );
    }
    
    const { trajet } = data.reservation;
    const departureDateTime = new Date(`${new Date(trajet.dateDepart).toISOString().split('T')[0]}T${trajet.heureDepart}:00Z`);
    const isFuture = departureDateTime > new Date();

    return (
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">{isFuture ? "Prochain Voyage" : "Voyage en Cours / Récent"}</p>
                        <h3 className="font-bold text-2xl text-gray-800">{trajet.villeDepart} → {trajet.villeArrivee}</h3>
                        <p className="text-sm text-gray-500">{new Date(trajet.dateDepart).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {trajet.heureDepart}</p>
                    </div>
                </div>
                {isFuture ? (
                    <div className="p-6 bg-blue-50/50 rounded-lg text-center"><CountdownDisplay targetDateTime={departureDateTime} /></div>
                ) : (
                    <div className="text-center mt-4">
                        {data.liveTrip ? (
                            <Link to={`/tracking/map/${data.liveTrip._id}`} className="inline-block px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg hover:shadow-green-400/50 text-base">
                                <FiMapPin className="inline mr-2"/> Suivre en Temps Réel
                            </Link>
                        ) : (
                            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center gap-3 text-gray-600">Le suivi pour ce voyage est indisponible.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- WIDGET 4 : Suivi de Colis (Inchangé) ---
const ColisWidget = () => {
    // ... (le code de ce composant reste identique)
    const [code, setCode] = useState(''); const [colis, setColis] = useState(null); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
    const handleTrack = async (e) => { e.preventDefault(); if (!code.trim()) return; setLoading(true); setError(''); setColis(null); try { const { data } = await api.get(`/public/colis/track/${code}`); setColis(data); } catch (err) { setError(err.response?.data?.message || 'Colis introuvable.'); } finally { setLoading(false); } };
    return (<div className="space-y-4"><p className="text-gray-600 text-sm">Avez-vous un code de suivi ? Vérifiez le statut de votre colis ici.</p><form onSubmit={handleTrack} className="flex gap-2"><input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().trim())} placeholder="Entrez un code de suivi..." className="flex-grow border p-2 rounded-md focus:ring-2 focus:ring-pink-400"/><button type="submit" disabled={loading} className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">{loading ? <FiLoader className="animate-spin"/> : <FiSearch />}</button></form>{error && <p className="text-red-500 text-sm flex items-center gap-2"><FiXCircle/> {error}</p>}{colis && (<div className="p-4 rounded-lg border bg-gray-50 animate-fade-in"><div className="flex justify-between items-start"><div><p className="font-semibold">{colis.description}</p><p className="text-xs text-gray-500 font-mono">{colis.code_suivi}</p></div><p className="font-bold text-blue-600">{colis.prix?.toLocaleString('fr-FR')} FCFA</p></div><div className="mt-4"><StatusStepper currentStatus={colis.statut} /></div></div>)}</div>);
};


// --- COMPOSANT PRINCIPAL DE LA PAGE (RESTRUCTURÉ) ---
const ClientDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' ou 'past'

    useEffect(() => {
        api.get('/dashboard/client-data')
            .then(res => setDashboardData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;

    const TabButton = ({ tabName, label, icon, count }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tabName 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
        >
            {icon} {label} <span className="bg-white/20 text-xs rounded-full px-2">{count}</span>
        </button>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                  Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">{user?.prenom}</span> !
                </h1>
                
                {/* Section principale avec Voyage à la Une et Colis */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-12">
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-3"><FiClock/> À la une</h2>
                        <FeaturedTripWidget data={dashboardData?.tripToDisplay} />
                    </div>
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-3"><FiBox/> Suivi de Colis</h2>
                        <ColisWidget />
                    </div>
                </div>

                {/* Section "Mes Voyages" avec onglets */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-700">Mes Voyages</h2>
                        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-full">
                            <TabButton tabName="upcoming" label="À venir" icon={<FiSend/>} count={dashboardData?.upcomingTrips?.length || 0} />
                            <TabButton tabName="past" label="Historique" icon={<FiArchive/>} count={dashboardData?.pastTrips?.length || 0} />
                        </div>
                    </div>

                    {/* Contenu des onglets */}
                    <ul className="space-y-3">
                        {activeTab === 'upcoming' && (
                            dashboardData?.upcomingTrips?.length > 0
                                ? dashboardData.upcomingTrips.map(trip => <TripCard key={trip._id} reservation={trip} />)
                                : <p className="text-center text-gray-500 py-6">Vous n'avez pas d'autre voyage programmé.</p>
                        )}
                        {activeTab === 'past' && (
                            dashboardData?.pastTrips?.length > 0
                                ? dashboardData.pastTrips.map(trip => <TripCard key={trip._id} reservation={trip} />)
                                : <p className="text-center text-gray-500 py-6">Vous n'avez aucun voyage dans votre historique.</p>
                        )}
                    </ul>
                     <Link to="/search" className="mt-6 w-full block text-center px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition">
                        <FiPlusCircle className="inline mr-2"/> Réserver un nouveau voyage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboardPage;