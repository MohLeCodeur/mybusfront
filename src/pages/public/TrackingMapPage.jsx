// src/pages/public/TrackingMapPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api';

// Icône custom pour le bus
const busIcon = new L.Icon({
    iconUrl: '/assets/bus-icon.png', // Vous devrez ajouter cette image
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const TrackingMapPage = () => {
    const { liveTripId } = useParams();
    const [liveTrip, setLiveTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef();

    useEffect(() => {
        // Fonction pour récupérer les données du voyage en cours
        const fetchTripData = async () => {
            try {
                // Pour l'affichage initial, nous avons besoin de l'itinéraire complet.
                // Le backend devrait être adapté pour renvoyer le liveTrip avec le routeGeoJSON.
                // Pour l'instant, on suppose qu'il le renvoie.
                const { data } = await api.get(`/tracking/live/${liveTripId}`); 
                setLiveTrip(data);
            } catch (error) {
                console.error("Impossible de charger les données du voyage", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTripData();

        // Mettre en place un intervalle pour rafraîchir la position du bus
        const interval = setInterval(() => {
            // Cette route ne renvoie que la position, c'est plus léger
            api.get(`/tracking/live/${liveTripId}/position`)
                .then(res => {
                    setLiveTrip(prev => ({...prev, currentPosition: res.data.currentPosition}));
                });
        }, 15000); // Toutes les 15 secondes

        return () => clearInterval(interval);
    }, [liveTripId]);

    if(loading) return <div>Chargement de la carte...</div>;
    if(!liveTrip) return <div>Voyage non trouvé.</div>;
    
    const position = liveTrip.currentPosition ? [liveTrip.currentPosition.lat, liveTrip.currentPosition.lng] : [12.63, -8.00];

    return (
        <div>
            <h1>Suivi du trajet : {liveTrip.originCityName} → {liveTrip.destinationCityName}</h1>
            <MapContainer center={position} zoom={10} ref={mapRef} style={{ height: '80vh', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* Affiche la position actuelle du bus */}
                {liveTrip.currentPosition && (
                    <Marker position={position} icon={busIcon}>
                        <Popup>Position actuelle du bus</Popup>
                    </Marker>
                )}

                {/* Affiche l'itinéraire si disponible */}
                {liveTrip.routeGeoJSON && (
                    <Polyline positions={liveTrip.routeGeoJSON.coordinates.map(c => [c[1], c[0]])} color="blue" />
                )}
            </MapContainer>
        </div>
    );
};

export default TrackingMapPage;