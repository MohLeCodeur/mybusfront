// src/pages/public/TrackingMapPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api';
import { FiLoader, FiArrowLeft, FiMap, FiClock, FiCheckCircle, FiSunrise, FiSunset, FiNavigation2 } from 'react-icons/fi';
import ReactDOMServer from 'react-dom/server';

// --- Fonctions Utilitaires et Composants Internes ---

// Fonction pour créer des icônes Leaflet personnalisées à partir de CSS et de composants React-Icons
const createDivIcon = (iconComponent) => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(iconComponent),
        className: 'bg-transparent border-0', // Important pour que seul l'icône soit visible
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Pointe inférieure au centre de l'icône
        popupAnchor: [0, -40]
    });
};

// Définition des icônes modernes
const busIcon = createDivIcon(<div className="relative"><FiNavigation2 size={24} className="text-white bg-blue-600 p-1.5 rounded-full shadow-lg animate-pulse" /></div>);
const startIcon = createDivIcon(<div className="p-2 bg-green-500 rounded-full shadow-lg"><FiSunrise size={20} className="text-white"/></div>);
const endIcon = createDivIcon(<div className="p-2 bg-red-500 rounded-full shadow-lg"><FiSunset size={20} className="text-white"/></div>);

// Composant pour recentrer la carte dynamiquement avec une animation douce
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom(), { animate: true, pan: { duration: 1 } });
        }
    }, [center, zoom, map]);
    return null;
};

// Carte d'information dans le panneau latéral
const InfoCard = ({ icon, title, value }) => (
    <div>
        <p className="text-sm text-gray-500 flex items-center gap-2">{icon} {title}</p>
        <p className="font-bold text-lg text-gray-800">{value}</p>
    </div>
);


// --- Composant Principal de la Page ---

const TrackingMapPage = () => {
    const { liveTripId } = useParams();
    const [liveTrip, setLiveTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTripData = () => {
            api.get(`/tracking/live/${liveTripId}`)
                .then(res => setLiveTrip(res.data))
                .catch(err => setError(err.response?.data?.message || "Erreur de chargement des données de suivi."))
                .finally(() => { if (loading) setLoading(false); });
        };
        fetchTripData();
        const interval = setInterval(fetchTripData, 20000); // Rafraîchit les données toutes les 20 secondes
        return () => clearInterval(interval);
    }, [liveTripId, loading]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen text-center p-8 text-red-500 bg-red-50">{error}</div>;
    }
    if (!liveTrip) {
        return <div className="flex justify-center items-center h-screen text-center p-8">Aucune information de suivi trouvée pour ce voyage.</div>;
    }

    const busPosition = liveTrip.currentPosition ? [liveTrip.currentPosition.lat, liveTrip.currentPosition.lng] : null;
    const routeCoordinates = liveTrip.routeGeoJSON?.coordinates.map(c => [c[1], c[0]]);
    const startPosition = liveTrip.trajetId?.coordsDepart ? [liveTrip.trajetId.coordsDepart.lat, liveTrip.trajetId.coordsDepart.lng] : null;
    const endPosition = liveTrip.trajetId?.coordsArrivee ? [liveTrip.trajetId.coordsArrivee.lat, liveTrip.trajetId.coordsArrivee.lng] : null;
    const defaultCenter = startPosition || [12.6392, -8.0029]; // Centre sur le départ, ou Bamako par défaut

    return (
        <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-4">
            {/* === PANNEAU LATÉRAL D'INFORMATIONS === */}
            <aside className="lg:col-span-1 bg-white p-6 flex flex-col shadow-2xl z-10 overflow-y-auto">
                <div className="shrink-0">
                    <Link to="/dashboard" className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6"><FiArrowLeft /> Retour à mon compte</Link>
                    <h1 className="text-2xl font-bold text-gray-800">{liveTrip.originCityName}</h1>
                    <div className="flex items-center text-gray-400 my-1">
                        <div className="w-1 h-8 bg-gray-200 ml-1.5"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">{liveTrip.destinationCityName}</h1>
                    <p className="text-sm mt-2">Bus n° <span className="font-semibold">{liveTrip.busId?.numero || 'N/A'}</span></p>
                </div>

                <div className="my-6 border-t pt-6">
                    <h2 className="font-bold text-gray-700 mb-3">Progression du Voyage</h2>
                    {liveTrip.progress?.percentage ? (
                        <>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                <div className="bg-gradient-to-r from-pink-500 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${liveTrip.progress.percentage}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Départ</span>
                                <span>{liveTrip.progress.percentage}%</span>
                                <span>Arrivée</span>
                            </div>
                            <p className="text-center text-sm mt-3">Distance restante: <span className="font-bold">{liveTrip.progress.remainingKm} km</span></p>
                        </>
                    ) : <p className="text-sm text-gray-400">Progression non disponible.</p>}
                </div>

                <div className="my-6 border-t pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <InfoCard icon={<FiClock className="text-blue-500"/>} title="Arrivée Estimée" value={liveTrip.eta ? new Date(liveTrip.eta).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'} />
                    <InfoCard icon={<FiCheckCircle className="text-green-500"/>} title="Statut" value={liveTrip.status} />
                </div>

                <div className="mt-auto pt-6 border-t">
                    <h3 className="font-bold text-gray-700 mb-2">Informations</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>La position du bus est mise à jour périodiquement.</p>
                        <p>L'heure d'arrivée est une estimation et peut varier en fonction du trafic et des conditions de route.</p>
                    </div>
                </div>
            </aside>

            {/* === CARTE === */}
            <main className="lg:col-span-3 z-0">
                <MapContainer center={busPosition || defaultCenter} zoom={8} className="h-full w-full">
                    <ChangeView center={busPosition} />
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    
                    {busPosition && <Marker position={busPosition} icon={busIcon}><Popup>Position Actuelle</Popup></Marker>}
                    {routeCoordinates && (
                        <>
                            {startPosition && <Marker position={startPosition} icon={startIcon}><Popup><b>Départ:</b> {liveTrip.originCityName}</Popup></Marker>}
                            {endPosition && <Marker position={endPosition} icon={endIcon}><Popup><b>Arrivée:</b> {liveTrip.destinationCityName}</Popup></Marker>}
                            <Polyline positions={routeCoordinates} color="#db2777" weight={5} opacity={0.8} />
                        </>
                    )}
                </MapContainer>
            </main>
        </div>
    );
};

export default TrackingMapPage;