// src/pages/admin/TrajetFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

const CITIES_COORDS = {
    'Bamako': { lat: 12.6392, lng: -8.0029 }, 'Kayes': { lat: 14.4469, lng: -11.4443 },
    'Koulikoro': { lat: 12.8628, lng: -7.5599 }, 'Sikasso': { lat: 11.3176, lng: -5.6665 },
    'Ségou': { lat: 13.4317, lng: -6.2658 }, 'Mopti': { lat: 14.4944, lng: -4.1970 },
    'Tombouctou': { lat: 16.7735, lng: -3.0074 }, 'Gao': { lat: 16.2666, lng: -0.0400 },
    'Kidal': { lat: 18.4411, lng: 1.4078 }, 'Taoudénit': { lat: 22.6736, lng: -3.9781 },
    'Ménaka': { lat: 15.9182, lng: 2.4014 }, 'Dioïla': { lat: 12.4939, lng: -6.7461 },
    'Niono': { lat: 14.2526, lng: -5.9930 }, 'Kita': { lat: 13.0444, lng: -9.4895 },
    'Douentza': { lat: 15.0019, lng: -2.9497 }, 'Bandiagara': { lat: 14.3499, lng: -3.6101 },
    'San': { lat: 13.3045, lng: -4.8955 }, 'Koutiala': { lat: 12.3917, lng: -5.4642 },
    'Goundam': { lat: 16.4144, lng: -3.6708 }, 'Nara': { lat: 15.1681, lng: -7.2863 },
    'Bougouni': { lat: 11.4194, lng: -7.4817 },
};

const TrajetFormPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        villeDepart: '', villeArrivee: '',
        coordsDepart: { lat: '', lng: '' }, coordsArrivee: { lat: '', lng: '' },
        dateDepart: '', heureDepart: '',
        prix: '', placesDisponibles: '', bus: '', isActive: true
    });
    
    const [buses, setBuses] = useState([]);
    const [selectedBusInfo, setSelectedBusInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const busRes = await api.get('/admin/bus/available');
                const availableBuses = Array.isArray(busRes.data) ? busRes.data : [];
                setBuses(availableBuses);
                
                if (isEditMode) {
                    const trajetRes = await api.get(`/public/trajets/${id}`);
                    const trajetData = trajetRes.data;
                    const { coordsDepart = {lat:'', lng:''}, coordsArrivee = {lat:'', lng:''}, ...rest } = trajetData;
                    setFormData({ ...rest, dateDepart: new Date(trajetData.dateDepart).toISOString().split('T')[0], bus: trajetData.bus?._id || '', coordsDepart, coordsArrivee, isActive: typeof trajetData.isActive === 'boolean' ? trajetData.isActive : true });

                    if (trajetData.bus?._id) {
                        const initialBus = availableBuses.find(b => b._id === trajetData.bus._id);
                        setSelectedBusInfo(initialBus);
                    }
                }
            } catch (err) { 
                setError("Erreur de chargement des données."); 
                console.error("Erreur de chargement:", err);
            } finally { 
                setFormLoading(false); 
            }
        };
        loadData();
    }, [id, isEditMode]);

    const handleCityChange = (e) => {
        const { name, value } = e.target;
        const newCoords = CITIES_COORDS[value] || { lat: '', lng: '' };
        const coordFieldName = name === 'villeDepart' ? 'coordsDepart' : 'coordsArrivee';
        setFormData(prev => ({ ...prev, [name]: value, [coordFieldName]: newCoords }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleBusChange = (e) => {
        const selectedBusId = e.target.value;
        const selectedBus = buses.find(b => b._id === selectedBusId);
        
        setSelectedBusInfo(selectedBus);
        setError('');

        setFormData(prev => ({
            ...prev,
            bus: selectedBusId,
            placesDisponibles: selectedBus ? selectedBus.capacite : ''
        }));
    };

    const handleCoordChange = (point, coord, value) => {
        setFormData(prev => ({ ...prev, [point]: { ...prev[point], [coord]: value } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (selectedBusInfo && !selectedBusInfo.hasChauffeur) {
            setError("Le bus sélectionné n'a pas de chauffeur. Veuillez en choisir un autre ou affecter un chauffeur à ce bus.");
            return;
        }

        if (!formData.placesDisponibles || parseInt(formData.placesDisponibles) <= 0) {
            setError("Veuillez sélectionner un bus pour définir le nombre de places.");
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData, bus: formData.bus || null };
            payload.prix = parseFloat(payload.prix);
            payload.placesDisponibles = parseInt(payload.placesDisponibles);
            
            if(payload.coordsDepart) {
                payload.coordsDepart.lat = parseFloat(payload.coordsDepart.lat);
                payload.coordsDepart.lng = parseFloat(payload.coordsDepart.lng);
            }
            if(payload.coordsArrivee) {
                payload.coordsArrivee.lat = parseFloat(payload.coordsArrivee.lat);
                payload.coordsArrivee.lng = parseFloat(payload.coordsArrivee.lng);
            }

            const apiCall = isEditMode ? api.put(`/admin/trajets/${id}`, payload) : api.post('/admin/trajets', payload);
            await apiCall;
            navigate('/admin/trajets');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };

    if (formLoading) return <div className="flex justify-center items-center h-96"><FiLoader className="animate-spin text-3xl"/></div>;

    return (
        <div className="max-w-2xl mx-auto">
            <Button variant="outline" onClick={() => navigate('/admin/trajets')} className="mb-6 flex items-center gap-2">
                <FiArrowLeft/> Retour à la liste des trajets
            </Button>
            <Card className="shadow-2xl border-t-4 border-pink-500">
                <CardHeader>
                    <CardTitle>{isEditMode ? 'Modifier le Trajet' : 'Créer un Nouveau Trajet'}</CardTitle>
                    <CardDescription>Remplissez les informations pour planifier un voyage.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="villeDepart" className="block text-sm font-medium text-gray-700 mb-1">Ville de départ</label>
                                <input id="villeDepart" name="villeDepart" list="cities" value={formData.villeDepart} onChange={handleCityChange} placeholder="Ex: Bamako" required className="w-full border p-2 rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="villeArrivee" className="block text-sm font-medium text-gray-700 mb-1">Ville d'arrivée</label>
                                <input id="villeArrivee" name="villeArrivee" list="cities" value={formData.villeArrivee} onChange={handleCityChange} placeholder="Ex: Sikasso" required className="w-full border p-2 rounded-md"/>
                            </div>
                            <datalist id="cities">
                                {Object.keys(CITIES_COORDS).map(city => <option key={city} value={city} />)}
                            </datalist>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="date" name="dateDepart" value={formData.dateDepart} onChange={handleChange} required className="border p-2 rounded-md" />
                            <input type="time" name="heureDepart" value={formData.heureDepart} onChange={handleChange} required className="border p-2 rounded-md" />
                        </div>
                        
                        <div>
                            <label htmlFor="bus" className="block text-sm font-medium text-gray-700 mb-1">Associer un bus</label>
                            <select id="bus" name="bus" value={formData.bus} onChange={handleBusChange} className="w-full border p-2 rounded-md bg-white focus:ring-2 focus:ring-blue-500" required>
                                <option value="">— Sélectionner un bus avec chauffeur —</option>
                                {buses.map(b => (
                                    <option key={b._id} value={b._id} disabled={b.etat !== 'en service'}>
                                        {b.numero} ({b.capacite} places) {b.hasChauffeur ? '✓ Chauffeur' : '✗ SANS CHAUFFEUR'}
                                    </option>
                                ))}
                            </select>
                            {selectedBusInfo && !selectedBusInfo.hasChauffeur && (
                                <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg flex items-center gap-2 text-sm border border-yellow-200">
                                    <FiAlertTriangle />
                                    <span>Ce bus n'a pas de chauffeur. Vous ne pouvez pas créer de trajet avec.</span>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">Prix du billet (FCFA)</label>
                                <input type="number" id="prix" name="prix" value={formData.prix} onChange={handleChange} placeholder="Ex: 10000" required className="border p-2 rounded-md w-full" />
                            </div>
                            <div>
                                <label htmlFor="placesDisponibles" className="block text-sm font-medium text-gray-700 mb-1">Places Disponibles</label>
                                <input 
                                    type="number" 
                                    id="placesDisponibles"
                                    name="placesDisponibles" 
                                    value={formData.placesDisponibles} 
                                    readOnly 
                                    placeholder="Auto (selon le bus)" 
                                    required 
                                    className="border p-2 rounded-md w-full bg-gray-100 cursor-not-allowed focus:ring-0" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t">
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-medium mb-2 text-gray-700">Coordonnées de Départ (auto-remplies)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" step="any" value={formData.coordsDepart.lat} onChange={(e) => handleCoordChange('coordsDepart', 'lat', e.target.value)} placeholder="Latitude" required className="border p-2 rounded-md"/>
                                    <input type="number" step="any" value={formData.coordsDepart.lng} onChange={(e) => handleCoordChange('coordsDepart', 'lng', e.target.value)} placeholder="Longitude" required className="border p-2 rounded-md"/>
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-medium mb-2 text-gray-700">Coordonnées d'Arrivée (auto-remplies)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" step="any" value={formData.coordsArrivee.lat} onChange={(e) => handleCoordChange('coordsArrivee', 'lat', e.target.value)} placeholder="Latitude" required className="border p-2 rounded-md"/>
                                    <input type="number" step="any" value={formData.coordsArrivee.lng} onChange={(e) => handleCoordChange('coordsArrivee', 'lng', e.target.value)} placeholder="Longitude" required className="border p-2 rounded-md"/>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                            <label htmlFor="isActive" className="font-medium text-gray-700">Rendre ce trajet visible au public ?</label>
                            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-6 w-6 rounded text-blue-600 focus:ring-blue-500 border-gray-300"/>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg">
                                {loading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                                {isEditMode ? 'Enregistrer les modifications' : 'Créer le Trajet'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
export default TrajetFormPage;