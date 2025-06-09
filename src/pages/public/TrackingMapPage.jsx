// src/pages/public/TrackingMapPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../../api';
import { FiLoader, FiArrowLeft } from 'react-icons/fi';

// Configuration de l'icône personnalisée pour le bus
// Assurez-vous d'avoir une image 'bus-icon.png' dans votre dossier public/assets/
const busIcon = new L.Icon({
    iconUrl: '/assets/bus-icon.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40], // La pointe de l'icône
    popupAnchor: [0, -40]
});

const TrackingMapPage = () => {
    const { liveTripId } = useParams();
    const [liveTrip, setLiveTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const mapRef = useRef();

    useEffect(() => {
        // Fonction pour récupérer les données du voyage
        const fetchTripData = () => {
            api.get(`/tracking/live/${liveTripId}`)
                .then(res => {
                    setLiveTrip(res.data);
                })
                .catch(err => {
                    setError(err.response?.data?.message || "Impossible de charger les données du voyage.");
                })
                .finally(() => {
                    if (loading) setLoading(false);
                });
        };

        fetchTripData(); // Appel initial

        // Rafraîchissement de la position toutes les 15 secondes
        const interval = setInterval(fetchTripData, 15000);

        return () => clearInterval(interval); // Nettoyage de l'intervalle
    }, [liveTripId, loading]);

    // Centrer la carte sur la position du bus quand elle change
    useEffect(() => {
        if (mapRef.current && liveTrip?.currentPosition) {
            mapRef.current.panTo([liveTrip.currentPosition.lat, liveTrip.currentPosition.lng]);
        }
    }, [liveTrip?.currentPosition]);


    if (loading) {
        return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-4xl text-blue-500"/></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500 bg-red-50">{error}</div>;
    }

    if (!liveTrip) {
        return <div className="text-center p-8">Aucune information de suivi trouvée.</div>;
    }
    
    // Position par défaut si le bus n'a pas encore de position
    const defaultPosition = [12.63, -8.00]; 
    const busPosition = liveTrip.currentPosition ? [liveTrip.currentPosition.lat, liveTrip.currentPosition.lng] : defaultPosition;

    return (
        <div className="h-screen w-screen flex flex-col">
            <header className="bg-white p-4 shadow-md z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Suivi en direct</h1>
                    <p className="text-sm text-gray-600">{liveTrip.originCityName} → {liveTrip.destinationCityName}</p>
                </div>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <FiArrowLeft />
                    Retour au Dashboard
                </Link>
            </header>
            
            <MapContainer center={busPosition} zoom={8} ref={mapRef} className="flex-grow z-0">
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {liveTrip.currentPosition && (
                    <Marker position={busPosition} icon={busIcon}>
                        <Popup>
                            Bus en route !<br />
                            Dernière mise à jour : {new Date(liveTrip.lastUpdated).toLocaleTimeString()}
                        </Popup>
                    </Marker>
                )}

                {/* NOTE: L'affichage de l'itinéraire (Polyline) n'est pas encore implémenté
                    car le backend ne calcule pas encore le GeoJSON de la route. */}
            </MapContainer>
        </div>
    );
};

export default TrackingMapPage;