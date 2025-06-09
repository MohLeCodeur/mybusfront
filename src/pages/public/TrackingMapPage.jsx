// src/pages/public/TrackingMapPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api';
import { FiLoader, FiArrowLeft, FiMap, FiClock, FiPlay, FiStopCircle, FiFlag, FiNavigation } from 'react-icons/fi';
import ReactDOMServer from 'react-dom/server';
import { Button } from '../../components/ui/Button.jsx';
// --- Fonctions Utilitaires et Composants Internes ---

// Fonction pour créer des icônes Leaflet à partir de composants React-Icons
const createDivIcon = (iconComponent, options = {}) => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(iconComponent),
        className: 'bg-transparent border-0', // Important pour n'afficher que l'icône
        iconSize: [36, 36],
        iconAnchor: [18, 36], // Ancre en bas au centre
        popupAnchor: [0, -36],
        ...options
    });
};

// Définition des icônes
const busIcon = createDivIcon(<FiNavigation size={32} className="text-blue-600 drop-shadow-lg" />);
const startIcon = createDivIcon(<FiFlag size={32} className="text-green-600 drop-shadow-lg" />);
const endIcon = createDivIcon(<FiFlag size={32} className="text-red-600 drop-shadow-lg" />);

// Composant pour recentrer la carte dynamiquement
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom());
        }
    }, [center, zoom, map]);
    return null;
};


// --- Composant Principal de la Page ---

const TrackingMapPage = () => {
    const { liveTripId } = useParams();
    const [liveTrip, setLiveTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Logique de simulation du déplacement du bus
    const [simulating, setSimulating] = useState(false);
    const simulationIntervalRef = useRef(null);

    useEffect(() => {
        const fetchTripData = () => {
            api.get(`/tracking/live/${liveTripId}`)
                .then(res => setLiveTrip(res.data))
                .catch(err => setError(err.response?.data?.message || "Impossible de charger le suivi."))
                .finally(() => { if (loading) setLoading(false); });
        };

        fetchTripData();
        const refreshInterval = setInterval(fetchTripData, 20000); // Rafraîchit les données toutes les 20s

        return () => clearInterval(refreshInterval);
    }, [liveTripId, loading]);

    // Fonction pour simuler le déplacement du bus le long de l'itinéraire
    const startSimulation = () => {
        if (!liveTrip?.routeGeoJSON?.coordinates || simulating) return;
        setSimulating(true);
        let currentIndex = 0;

        simulationIntervalRef.current = setInterval(() => {
            if (currentIndex >= liveTrip.routeGeoJSON.coordinates.length - 1) {
                stopSimulation();
                setLiveTrip(prev => ({ ...prev, status: 'Terminé', currentPosition: prev.trajetId.coordsArrivee }));
                return;
            }
            const [lng, lat] = liveTrip.routeGeoJSON.coordinates[currentIndex];
            setLiveTrip(prev => ({ ...prev, currentPosition: { lat, lng } }));
            currentIndex++;
        }, 1000); // Avance d'un point chaque seconde
    };

    const stopSimulation = () => {
        clearInterval(simulationIntervalRef.current);
        setSimulating(false);
    };
    
    // Nettoyer l'intervalle de simulation si l'utilisateur quitte la page
    useEffect(() => {
        return () => clearInterval(simulationIntervalRef.current);
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;
    if (error) return <div className="text-center p-8 text-red-500 bg-red-50">{error}</div>;
    if (!liveTrip) return <div className="text-center p-8">Aucune information de suivi disponible pour ce voyage.</div>;

    const busPosition = liveTrip.currentPosition ? [liveTrip.currentPosition.lat, liveTrip.currentPosition.lng] : null;
    const routeCoordinates = liveTrip.routeGeoJSON?.coordinates.map(c => [c[1], c[0]]); // Inverser lng/lat pour Leaflet
    const startPosition = liveTrip.trajetId.coordsDepart ? [liveTrip.trajetId.coordsDepart.lat, liveTrip.trajetId.coordsDepart.lng] : null;
    const endPosition = liveTrip.trajetId.coordsArrivee ? [liveTrip.trajetId.coordsArrivee.lat, liveTrip.trajetId.coordsArrivee.lng] : null;


    return (
        <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-4">
            {/* Colonne de gauche : Infos et contrôles */}
            <aside className="lg:col-span-1 bg-white p-4 flex flex-col shadow-lg z-10 overflow-y-hidden">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4 shrink-0"><FiArrowLeft /> Mon Compte</Link>
                <div className="shrink-0">
                    <h1 className="text-xl font-bold">{liveTrip.originCityName} → {liveTrip.destinationCityName}</h1>
                    <p className="text-sm text-gray-500">Bus n° {liveTrip.busId?.numero || 'N/A'}</p>
                    <p className={`text-sm font-bold mt-1 ${liveTrip.status === 'En cours' ? 'text-green-600' : 'text-gray-600'}`}>{liveTrip.status}</p>
                </div>

                <div className="my-4 border-t pt-4 shrink-0">
                    {liveTrip.routeSummary ? (
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2"><FiMap /> <strong>Distance:</strong> {liveTrip.routeSummary.distanceKm} km</p>
                            <p className="flex items-center gap-2"><FiClock /> <strong>Durée estimée:</strong> {Math.floor(liveTrip.routeSummary.durationMin / 60)}h {liveTrip.routeSummary.durationMin % 60}min</p>
                        </div>
                    ) : ( <p className="text-sm text-gray-400">Calcul de l'itinéraire en cours...</p> )}
                </div>

                <div className="my-4 border-t pt-4 shrink-0">
                    <h2 className="font-bold mb-2">Simulation (pour démo)</h2>
                    <div className="flex gap-2">
                        <Button onClick={startSimulation} disabled={simulating || !routeCoordinates}><FiPlay className="mr-2"/> Démarrer</Button>
                        <Button onClick={stopSimulation} disabled={!simulating} variant="destructive"><FiStopCircle className="mr-2"/> Arrêter</Button>
                    </div>
                </div>

                <div className="my-4 border-t pt-4 flex-grow min-h-0 flex flex-col">
                    <h2 className="font-bold mb-2 shrink-0">Instructions de route</h2>
                    <ul className="text-xs space-y-2 overflow-y-auto h-full pr-2">
                        {liveTrip.routeInstructions?.length > 0 ? liveTrip.routeInstructions.map((step, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: step.instruction }} className="border-b pb-1"/>
                        )) : <li className="text-gray-400">Aucune instruction détaillée.</li>}
                    </ul>
                </div>
            </aside>

            {/* Colonne de droite : Carte */}
            <main className="lg:col-span-3">
                <MapContainer center={busPosition || startPosition || [12.63, -8.00]} zoom={8} className="h-full w-full">
                    <ChangeView center={busPosition} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    {/* Marqueur du bus */}
                    {busPosition && (
                        <Marker position={busPosition} icon={busIcon}>
                            <Popup>Position Actuelle</Popup>
                        </Marker>
                    )}

                    {/* Itinéraire et marqueurs de départ/arrivée */}
                    {routeCoordinates && (
                        <>
                            {startPosition && <Marker position={startPosition} icon={startIcon}><Popup>{liveTrip.originCityName}</Popup></Marker>}
                            {endPosition && <Marker position={endPosition} icon={endIcon}><Popup>{liveTrip.destinationCityName}</Popup></Marker>}
                            <Polyline positions={routeCoordinates} color="#3b82f6" weight={5} />
                        </>
                    )}
                </MapContainer>
            </main>
        </div>
    );
};

export default TrackingMapPage;