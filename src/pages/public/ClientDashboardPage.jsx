// src/pages/public/ClientDashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { FiClock, FiMapPin, FiBox, FiLoader, FiCheckCircle, FiArchive, FiPlusCircle, FiSearch, FiXCircle } from 'react-icons/fi';
import StatusStepper from '../../components/admin/StatusStepper.jsx';

// ==================================================================
// WIDGETS INTERNES (Inclus dans le même fichier)
// ==================================================================

// --- WIDGET 1 : Compte à rebours ---
const CountdownDisplay = ({ targetDateTime }) => {
    const [timeLeft, setTimeLeft] = useState(targetDateTime.getTime() - new Date().getTime());

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setTimeout(() => { setTimeLeft(timeLeft - 1000); }, 1000);
        return () => clearTimeout(timerId);
    }, [timeLeft]);

    if (timeLeft <= 0) {
        return <span className="text-lg font-bold text-green-500 animate-pulse">Départ imminent !</span>;
    }

    const formatTime = (value, label) => (
        <div className="text-center w-16">
            <span className="text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-blue-500">{String(value).padStart(2, '0')}</span>
            <span className="block text-xs uppercase text-gray-500 tracking-wider">{label}</span>
        </div>
    );

    const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const h = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const m = Math.floor((timeLeft / 1000 / 60) % 60);
    const s = Math.floor((timeLeft / 1000) % 60);

    return (
        <div className="flex justify-center gap-2 sm:gap-4">
            {d > 0 && formatTime(d, 'Jours')}
            {(d > 0 || h > 0) && formatTime(h, 'Heures')}
            {(d > 0 || h > 0 || m > 0) && formatTime(m, 'Minutes')}
            {formatTime(s, 'Secondes')}
        </div>
    );
};

// --- WIDGET 2 : Prochain Voyage ---
const TripWidget = ({ data }) => {
    if (!data || !data.reservation) {
        return (
            <div className="text-center p-8 bg-gray-50/50 rounded-lg">
                <p className="text-gray-600 mb-4">{data?.message || "Vous n'avez aucune réservation à venir."}</p>
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
                    <div className="p-6 bg-blue-50/50 rounded-lg text-center">
                        <CountdownDisplay targetDateTime={departureDateTime} />
                    </div>
                ) : (
                    <div className="text-center mt-4">
                        {data.liveTrip ? (
                            // --- BOUTON DE SUIVI AMÉLIORÉ ---
                            <Link 
                                to={`/tracking/map/${data.liveTrip._id}`} 
                                className="inline-block px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg hover:shadow-green-400/50 text-base"
                            >
                                <FiMapPin className="inline mr-2"/> Suivre en Temps Réel
                            </Link>
                        ) : (
                            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center gap-3 text-gray-600">
                                <p>{data.message || "Le suivi pour ce voyage est indisponible."}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- WIDGET 3 : Suivi de Colis ---
const ColisWidget = () => {
    const [code, setCode] = useState('');
    const [colis, setColis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleTrack = async (e) => { e.preventDefault(); if (!code.trim()) return; setLoading(true); setError(''); setColis(null); try { const { data } = await api.get(`/public/colis/track/${code}`); setColis(data); } catch (err) { setError(err.response?.data?.message || 'Colis introuvable.'); } finally { setLoading(false); } };
    return (
        <div className="space-y-4">
            <p className="text-gray-600 text-sm">Avez-vous un code de suivi ? Vérifiez le statut de votre colis ici.</p>
            <form onSubmit={handleTrack} className="flex gap-2">
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().trim())} placeholder="Entrez un code de suivi..." className="flex-grow border p-2 rounded-md focus:ring-2 focus:ring-pink-400"/>
                <button type="submit" disabled={loading} className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">{loading ? <FiLoader className="animate-spin"/> : <FiSearch />}</button>
            </form>
            {error && <p className="text-red-500 text-sm flex items-center gap-2"><FiXCircle/> {error}</p>}
            {colis && (<div className="p-4 rounded-lg border bg-gray-50 animate-fade-in"><div className="flex justify-between items-start"><div><p className="font-semibold">{colis.description}</p><p className="text-xs text-gray-500 font-mono">{colis.code_suivi}</p></div><p className="font-bold text-blue-600">{colis.prix?.toLocaleString('fr-FR')} FCFA</p></div><div className="mt-4"><StatusStepper currentStatus={colis.statut} /></div></div>)}
        </div>
    );
};

// --- WIDGET 4 : Historique des Voyages ---
const PastTripsWidget = ({ trips }) => {
    if (!trips || trips.length === 0) return <p className="text-center text-gray-400 py-4 text-sm">Aucun voyage passé trouvé.</p>;
    return (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {trips.slice(0, 5).map(trip => (
                <li key={trip._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div><p className="font-medium text-sm">{trip.trajet.villeDepart} → {trip.trajet.villeArrivee}</p><p className="text-xs text-gray-500">Le {new Date(trip.trajet.dateDepart).toLocaleDateString('fr-FR')}</p></div>
                    <FiCheckCircle className="text-green-500 text-xl"/>
                </li>
            ))}
        </ul>
    );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const ClientDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            api.get('/dashboard/client-data')
                .then(res => setDashboardData(res.data))
                .catch(console.error)
                .finally(() => { if (loading) setLoading(false); });
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [loading]);

    if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                  Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">{user?.prenom}</span> !
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><FiClock/> Voyage à la Une</h2>
                            <TripWidget data={dashboardData?.tripToDisplay} />
                        </div>
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><FiBox/> Suivi de Colis</h2>
                            <ColisWidget />
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border sticky top-24">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><FiArchive/> Voyages Passés</h2>
                            <PastTripsWidget trips={dashboardData?.pastTrips} />
                            <Link to="/search" className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition">
                                <FiPlusCircle/> Nouveau Voyage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboardPage;