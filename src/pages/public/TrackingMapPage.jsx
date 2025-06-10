// src/pages/public/TrackingMapPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api';
import { FiLoader, FiArrowLeft, FiMap, FiClock, FiCheckCircle, FiSunrise, FiSunset, FiNavigation2 } from 'react-icons/fi';
import ReactDOMServer from 'react-dom/server';

// --- Icônes et Composants Internes (Aucun changement ici) ---
const createDivIcon = (iconComponent) => L.divIcon({ html: ReactDOMServer.renderToString(iconComponent), className: 'bg-transparent border-0', iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40] });
const busIcon = createDivIcon(<div className="relative"><FiNavigation2 size={28} className="text-white bg-blue-600 p-1.5 rounded-full shadow-lg" /><div className="absolute inset-0 bg-blue-400 rounded-full animate-ping -z-10"></div></div>);
const startIcon = createDivIcon(<div className="p-2 bg-green-500 rounded-full shadow-lg"><FiSunrise size={20} className="text-white"/></div>);
const endIcon = createDivIcon(<div className="p-2 bg-red-500 rounded-full shadow-lg"><FiSunset size={20} className="text-white"/></div>);
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) { map.setView(center, zoom || map.getZoom(), { animate: true, pan: { duration: 1 } }); }
    }, [center, zoom, map]);
    return null;
};
const InfoCard = ({ icon, title, value }) => (
    <div>
        <p className="text-xs text-gray-500 flex items-center gap-1">{icon} {title}</p>
        <p className="font-bold text-base md:text-lg text-gray-800">{value}</p>
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
                .catch(err => setError(err.response?.data?.message || "Erreur de chargement."))
                .finally(() => { if (loading) setLoading(false); });
        };
        fetchTripData();
        const interval = setInterval(fetchTripData, 20000);
        return () => clearInterval(interval);
    }, [liveTripId, loading]);

    if (loading) return <div className="flex justify-center items-center h-screen w-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;
    if (error) return <div className="flex justify-center items-center h-screen w-screen text-center p-8 text-red-500 bg-red-50">{error}</div>;
    if (!liveTrip) return <div className="flex justify-center items-center h-screen w-screen text-center p-8">Aucun suivi trouvé.</div>;

    const busPosition = liveTrip.currentPosition ? [liveTrip.currentPosition.lat, liveTrip.currentPosition.lng] : null;
    const routeCoordinates = liveTrip.routeGeoJSON?.coordinates.map(c => [c[1], c[0]]);
    const startPosition = liveTrip.trajetId?.coordsDepart ? [liveTrip.trajetId.coordsDepart.lat, liveTrip.trajetId.coordsDepart.lng] : null;
    const endPosition = liveTrip.trajetId?.coordsArrivee ? [liveTrip.trajetId.coordsArrivee.lat, liveTrip.trajetId.coordsArrivee.lng] : null;
    const defaultCenter = startPosition || [12.6392, -8.0029];

    return (
        // --- GRILLE RESPONSIVE ---
        // Par défaut (mobile) : une seule colonne, les éléments s'empilent verticalement.
        // À partir du breakpoint 'lg' (grands écrans) : 4 colonnes.
        <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-4">
            
            {/* === PANNEAU LATÉRAL D'INFORMATIONS === */}
            {/* Prend toute la largeur sur mobile, et 1 colonne sur grand écran */}
            <aside className="lg:col-span-1 bg-white p-6 flex flex-col shadow-2xl z-10 overflow-y-auto">
                <div className="shrink-0">
                    <Link to="/dashboard" className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6"><FiArrowLeft /> Mon Compte</Link>
                    <div className="flex items-center gap-4">
                        <FiSunrise className="text-2xl text-green-500 shrink-0"/>
                        <div>
                            <p className="text-xs text-gray-500">Départ</p>
                            <h2 className="text-xl font-bold text-gray-800">{liveTrip.originCityName}</h2>
                        </div>
                    </div>
                    <div className="h-8 border-l-2 border-dashed border-gray-300 ml-3 my-1"></div>
                    <div className="flex items-center gap-4">
                        <FiSunset className="text-2xl text-red-500 shrink-0"/>
                        <div>
                            <p className="text-xs text-gray-500">Arrivée</p>
                            <h2 className="text-xl font-bold text-gray-800">{liveTrip.destinationCityName}</h2>
                        </div>
                    </div>
                </div>

                <div className="my-6 border-t pt-6">
                    <h3 className="font-bold text-gray-700 mb-3">Progression du Voyage</h3>
                    {liveTrip.progress?.percentage ? (
                        <>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                <div className="bg-gradient-to-r from-pink-500 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${liveTrip.progress.percentage}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{liveTrip.progress.percentage}%</span>
                                <span>Restant: {liveTrip.progress.remainingKm} km</span>
                            </div>
                        </>
                    ) : <p className="text-sm text-gray-400">Progression non disponible.</p>}
                </div>

                <div className="my-6 border-t pt-6 grid grid-cols-2 gap-4">
                    <InfoCard icon={<FiClock className="text-pink-500"/>} title="Arrivée Estimée" value={liveTrip.eta ? new Date(liveTrip.eta).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'} />
                    <InfoCard icon={<FiCheckCircle className="text-green-500"/>} title="Statut" value={<span className={liveTrip.status === 'En cours' ? 'animate-pulse' : ''}>{liveTrip.status}</span>} />
                </div>
            </aside>

            {/* === CARTE === */}
            {/* Prend toute la largeur sur mobile, et 3 colonnes sur grand écran */}
            {/* Sur mobile, ce bloc sera SOUS le panneau d'infos */}
            <main className="lg:col-span-3 z-0 h-96 lg:h-full w-full">
                <MapContainer center={busPosition || defaultCenter} zoom={7} className="h-full w-full">
                    <ChangeView center={busPosition} zoom={13} />
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