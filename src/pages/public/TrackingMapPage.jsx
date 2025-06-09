// src/pages/public/TrackingMapPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api';
import { FiLoader, FiArrowLeft, FiMap, FiClock, FiCheckCircle, FiFlag, FiNavigation2 } from 'react-icons/fi';
import ReactDOMServer from 'react-dom/server';

// --- Fonctions Utilitaires et Composants Internes ---

// Fonction pour créer des icônes Leaflet personnalisées à partir de CSS et de composants React-Icons
const createDivIcon = (iconComponent) => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(iconComponent),
        className: 'bg-transparent border-0', // Important pour que seul l'icône soit visible
        iconSize: [36, 36],
        iconAnchor: [18, 36], // Pointe inférieure au centre de l'icône
        popupAnchor: [0, -36]
    });
};

// Définition des icônes
const busIcon = createDivIcon(<FiNavigation2 size={32} className="text-blue-600 drop-shadow-lg" />);
const startIcon = createDivIcon(<FiFlag size={32} className="text-green-600 drop-shadow-lg" />);
const endIcon = createDivIcon(<FiFlag size={32} className="text-red-600 drop-shadow-lg" />);

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

// Composant pour afficher une carte d'information dans le panneau flottant
const InfoCard = ({ icon, title, value }) => (
    <div className="flex items-center gap-3">
        <div className="bg-blue-100/50 p-2 rounded-lg">{icon}</div>
        <div>
            <p className="text-xs text-gray-500">{title}</p>
            <p className="font-bold text-sm text-gray-800">{value}</p>
        </div>
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
                .then(res => {
                    setLiveTrip(res.data);
                })
                .catch(err => {
                    setError(err.response?.data?.message || "Impossible de charger les données de suivi.");
                })
                .finally(() => {
                    if (loading) setLoading(false);
                });
        };

        fetchTripData(); // Appel initial
        const refreshInterval = setInterval(fetchTripData, 20000); // Rafraîchit les données toutes les 20 secondes

        return () => clearInterval(refreshInterval); // Nettoyage de l'intervalle
    }, [liveTripId, loading]);


    if (loading) {
        return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500 bg-red-50">{error}</div>;
    }

    if (!liveTrip) {
        return <div className="text-center p-8">Aucune information de suivi trouvée pour ce voyage.</div>;
    }
    
    // Extraction des données pour une meilleure lisibilité
    const busPosition = liveTrip.currentPosition ? [liveTrip.currentPosition.lat, liveTrip.currentPosition.lng] : null;
    const routeCoordinates = liveTrip.routeGeoJSON?.coordinates.map(c => [c[1], c[0]]); // Inversion [lng, lat] -> [lat, lng] pour Leaflet
    const startPosition = liveTrip.trajetId?.coordsDepart ? [liveTrip.trajetId.coordsDepart.lat, liveTrip.trajetId.coordsDepart.lng] : null;
    const endPosition = liveTrip.trajetId?.coordsArrivee ? [liveTrip.trajetId.coordsArrivee.lat, liveTrip.trajetId.coordsArrivee.lng] : null;
    const defaultCenter = startPosition || [12.6392, -8.0029]; // Centre sur le départ, ou Bamako par défaut

    return (
        <div className="h-screen w-screen relative">
            {/* Carte en plein écran en arrière-plan */}
            <MapContainer center={busPosition || defaultCenter} zoom={8} className="h-full w-full z-0">
                <ChangeView center={busPosition} />
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                {/* Marqueur du bus */}
                {busPosition && (
                    <Marker position={busPosition} icon={busIcon}>
                        <Popup>
                            <b>Position Actuelle du Bus</b><br />
                            Mise à jour à : {new Date(liveTrip.lastUpdated).toLocaleTimeString('fr-FR')}
                        </Popup>
                    </Marker>
                )}

                {/* Itinéraire et marqueurs de départ/arrivée */}
                {routeCoordinates && (
                    <>
                        {startPosition && <Marker position={startPosition} icon={startIcon}><Popup><b>Départ:</b> {liveTrip.originCityName}</Popup></Marker>}
                        {endPosition && <Marker position={endPosition} icon={endIcon}><Popup><b>Arrivée:</b> {liveTrip.destinationCityName}</Popup></Marker>}
                        <Polyline positions={routeCoordinates} color="#3b82f6" weight={5} opacity={0.7} />
                    </>
                )}
            </MapContainer>

            {/* Panneau d'information flottant */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[1000]">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-lg font-bold text-gray-800">{liveTrip.originCityName} → {liveTrip.destinationCityName}</h1>
                        <p className={`text-sm font-semibold ${liveTrip.status === 'En cours' ? 'text-green-600' : 'text-gray-500'}`}>{liveTrip.status}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 border-gray-200/80">
                        {liveTrip.routeSummary && (
                            <InfoCard icon={<FiMap className="text-blue-500"/>} title="Distance" value={`${liveTrip.routeSummary.distanceKm} km`} />
                        )}
                        {liveTrip.eta && (
                            <InfoCard icon={<FiClock className="text-blue-500"/>} title="Arrivée Estimée" value={new Date(liveTrip.eta).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} />
                        )}
                         <InfoCard icon={<FiCheckCircle className="text-blue-500"/>} title="Bus N°" value={liveTrip.busId?.numero || 'N/A'} />
                    </div>
                    <Link to="/dashboard" className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">
                        <FiArrowLeft /> Retour
                    </Link>
                </div>
            </div>

             {/* Bouton de retour flottant pour mobile */}
             <Link to="/dashboard" className="md:hidden absolute bottom-4 left-4 z-[1000] flex items-center justify-center h-12 w-12 bg-white rounded-full shadow-lg">
                <FiArrowLeft className="text-xl"/>
            </Link>
        </div>
    );
};

export default TrackingMapPage;