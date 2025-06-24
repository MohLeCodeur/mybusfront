// src/pages/public/TrackingMapPage.jsx (CODE FINAL AVEC ICÔNES CORRIGÉES)

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api';
import { FiLoader, FiArrowLeft, FiMap, FiClock, FiCheckCircle, FiSunrise, FiSunset, FiNavigation2, FiUser, FiShare2, FiAlertTriangle } from 'react-icons/fi';

// ====================================================================
// --- DÉBUT : CORRECTION DES ICÔNES LEAFLET ---
// ====================================================================

// On supprime l'ancienne configuration défaillante de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

// On recrée l'icône par défaut manuellement pour un contrôle total.
// C'est la solution la plus robuste pour éviter les problèmes de build.
const defaultIcon = L.icon({
    iconUrl: '/assets/marker-icon.png', // Chemin vers l'image que vous avez ajoutée
    iconSize: [25, 41],       // Taille de l'icône
    iconAnchor: [12, 41],     // Point de l'icône qui correspondra à la position du marqueur
    popupAnchor: [1, -34],    // Point à partir duquel le popup doit s'ouvrir par rapport à l'icône
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', // On peut garder l'ombre depuis le CDN
    shadowSize: [41, 41]
});

// On peut aussi créer des icônes custom pour le bus et l'utilisateur si on le souhaite,
// mais pour la stabilité, on peut commencer par utiliser l'icône par défaut pour tout.
// Pour ce code, je vais garder des icônes distinctes mais en utilisant une méthode stable.
const createStyledIcon = (iconJsx, options = {}) => {
    // Cette méthode utilise du HTML et du CSS inline pour plus de stabilité.
    const iconHtml = `<div style="font-size: 24px; color: white; background-color: ${options.bgColor || 'blue'}; padding: 8px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${iconJsx}</div>`;
    return L.divIcon({
        html: iconHtml,
        className: 'bg-transparent border-0',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

const busIcon = createStyledIcon('<i class="fi-rr-bus">🚌</i>', { bgColor: '#1d4ed8' }); // Utiliser une classe d'icône ou un emoji
const userIcon = createStyledIcon('<i class="fi-rr-user">👤</i>', { bgColor: '#db2777' });
const startIcon = createStyledIcon('<i class="fi-rr-flag">🏁</i>', { bgColor: '#16a34a' });
const endIcon = createStyledIcon('<i class="fi-rr-cross-circle">📍</i>', { bgColor: '#dc2626' });

// ====================================================================
// --- FIN : CORRECTION DES ICÔNES LEAFLET ---
// ====================================================================


const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) { map.setView(center, zoom || map.getZoom(), { animate: true, pan: { duration: 1 } }); }
    }, [center, zoom, map]);
    return null;
};
const InfoCard = ({ icon, title, value }) => (
    <div><p className="text-xs text-gray-500 flex items-center gap-1">{icon} {title}</p><p className="font-bold text-lg text-gray-800">{value}</p></div>
);

const TrackingMapPage = () => {
    // ... Le reste de votre logique (états, useEffects, fonctions) reste EXACTEMENT LE MÊME ...
    // ... (Collez tout votre code logique existant ici)
    const { liveTripId } = useParams();
    const [liveTrip, setLiveTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userPosition, setUserPosition] = useState(null);
    const [userRoute, setUserRoute] = useState(null);
    const [geoError, setGeoError] = useState('');
    const [calculatingRoute, setCalculatingRoute] = useState(false);
    const [watchId, setWatchId] = useState(null);

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

    const toggleUserTracking = () => {
        if (!navigator.geolocation) {
            setGeoError("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
            setUserPosition(null);
            setUserRoute(null);
            setGeoError('');
            return;
        }
        const id = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserPosition([latitude, longitude]);
                setGeoError('');
            },
            () => {
                setGeoError("Impossible de suivre votre position. Veuillez autoriser l'accès.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        setWatchId(id);
    };

    useEffect(() => {
        if (userPosition && liveTrip?.trajetId?.coordsArrivee) {
            setCalculatingRoute(true);
            const payload = {
                pointA: { lat: userPosition[0], lng: userPosition[1] },
                pointB: { lat: liveTrip.trajetId.coordsArrivee.lat, lng: liveTrip.trajetId.coordsArrivee.lng }
            };
            api.post('/tracking/calculate-route', payload)
                .then(res => setUserRoute(res.data))
                .catch(() => setGeoError("Impossible de calculer l'itinéraire jusqu'à la destination."))
                .finally(() => setCalculatingRoute(false));
        }
    }, [userPosition, liveTrip?.trajetId?.coordsArrivee]);

    useEffect(() => {
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    if (loading) return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;
    if (error) return <div className="text-center p-8 text-red-500 bg-red-50">{error}</div>;
    if (!liveTrip) return <div className="text-center p-8">Aucun suivi trouvé.</div>;

    const busPosition = liveTrip.currentPosition ? [liveTrip.currentPosition.lat, liveTrip.currentPosition.lng] : null;
    const busRouteCoordinates = liveTrip.routeGeoJSON?.coordinates.map(c => [c[1], c[0]]);
    const userRouteCoordinates = userRoute?.geojson?.coordinates.map(c => [c[1], c[0]]);
    const startPosition = liveTrip.trajetId?.coordsDepart ? [liveTrip.trajetId.coordsDepart.lat, liveTrip.trajetId.coordsDepart.lng] : null;
    const endPosition = liveTrip.trajetId?.coordsArrivee ? [liveTrip.trajetId.coordsArrivee.lat, liveTrip.trajetId.coordsArrivee.lng] : null;
    const defaultCenter = startPosition || [12.6392, -8.0029];

    return (
        <div className="h-screen w-screen flex flex-col lg:grid lg:grid-cols-4">
            <aside className="h-1/2 lg:h-full lg:col-span-1 bg-white p-6 flex flex-col shadow-2xl z-10 overflow-y-auto">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6 shrink-0"><FiArrowLeft /> Mon Compte</Link>
                <div className="mb-4">
                    <div className="flex items-center gap-4"><FiSunrise className="text-2xl text-green-500 shrink-0"/><div><p className="text-xs text-gray-500">Départ</p><h2 className="text-xl font-bold text-gray-800">{liveTrip.originCityName}</h2></div></div>
                    <div className="h-8 border-l-2 border-dashed border-gray-300 ml-3 my-1"></div>
                    <div className="flex items-center gap-4"><FiSunset className="text-2xl text-red-500 shrink-0"/><div><p className="text-xs text-gray-500">Arrivée</p><h2 className="text-xl font-bold text-gray-800">{liveTrip.destinationCityName}</h2></div></div>
                </div>
                <div className="my-4 border-t pt-4 space-y-4">
                    <h3 className="font-bold text-gray-700">Détails du voyage du bus</h3>
                    <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-2 gap-4">
                        <InfoCard icon={<FiMap className="text-blue-500"/>} title="Distance" value={liveTrip.routeSummary?.distanceKm ? `${liveTrip.routeSummary.distanceKm} km` : 'N/A'} />
                        <InfoCard icon={<FiClock className="text-blue-500"/>} title="Arrivée Estimée" value={liveTrip.eta ? new Date(liveTrip.eta).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'} />
                        <InfoCard icon={<FiCheckCircle className="text-green-500"/>} title="Statut" value={<span className={`font-bold ${liveTrip.status === 'En cours' ? 'text-green-600 animate-pulse' : 'text-gray-700'}`}>{liveTrip.status}</span>} />
                    </div>
                </div>
                <div className="my-4 border-t pt-4 space-y-3">
                    <h3 className="font-bold text-gray-700">Mon Itinéraire vers la Destination</h3>
                    <button onClick={toggleUserTracking} className={`w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-lg transition ${ watchId ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-pink-500 text-white hover:bg-pink-600' }`}>
                        {watchId ? <><FiUser className="animate-pulse"/> Arrêter le suivi</> : <><FiShare2/> Suivre ma position</>}
                    </button>
                    {geoError && <p className="text-xs text-red-500 flex items-center gap-1"><FiAlertTriangle/> {geoError}</p>}
                    {calculatingRoute && <p className="text-xs text-gray-500 flex items-center gap-1"><FiLoader className="animate-spin"/> Calcul de votre itinéraire...</p>}
                    {userRoute && (
                        <div className="p-4 bg-pink-50 rounded-lg grid grid-cols-2 gap-4 animate-fade-in">
                            <InfoCard icon={<FiMap className="text-pink-500"/>} title="Ma Distance" value={`${userRoute.distanceKm} km`} />
                            <InfoCard icon={<FiClock className="text-pink-500"/>} title="Mon Temps Trajet" value={`${Math.floor(userRoute.durationMin / 60)}h${userRoute.durationMin % 60}`} />
                        </div>
                    )}
                </div>
                <div className="mt-auto pt-4 border-t text-center">
                    <p className="text-xs text-gray-400">Bus n°{liveTrip.busId?.numero || 'N/A'} - MyBus Tracking System</p>
                </div>
            </aside>
            <main className="h-1/2 lg:h-full lg:col-span-3 z-0">
                <MapContainer center={busPosition || defaultCenter} zoom={7} className="h-full w-full">
                    <ChangeView center={userPosition || busPosition || defaultCenter} />
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    {busRouteCoordinates && <Polyline positions={busRouteCoordinates} color="#1d4ed8" weight={6} opacity={0.8} />}
                    {busPosition && <Marker position={busPosition} icon={defaultIcon}><Popup>Position Actuelle du Bus</Popup></Marker>}
                    {startPosition && <Marker position={startPosition} icon={defaultIcon}><Popup><b>Départ:</b> {liveTrip.originCityName}</Popup></Marker>}
                    {endPosition && <Marker position={endPosition} icon={defaultIcon}><Popup><b>Arrivée:</b> {liveTrip.destinationCityName}</Popup></Marker>}
                    {userPosition && <Marker position={userPosition} icon={defaultIcon}><Popup>Votre Position</Popup></Marker>}
                    {userRouteCoordinates && <Polyline positions={userRouteCoordinates} color="#db2777" weight={4} opacity={0.9} dashArray="5, 10" />}
                </MapContainer>
            </main>
        </div>
    );
};

export default TrackingMapPage;