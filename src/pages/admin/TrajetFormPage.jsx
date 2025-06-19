// src/pages/admin/TrajetFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiArrowLeft } from 'react-icons/fi';

// --- Dictionnaire des Villes avec leurs Coordonnées GPS ---
const CITIES_COORDS = {
    'Bamako': { lat: 12.6392, lng: -8.0029 },
    'Kayes': { lat: 14.4469, lng: -11.4443 },
    'Koulikoro': { lat: 12.8628, lng: -7.5599 },
    'Sikasso': { lat: 11.3176, lng: -5.6665 },
    'Ségou': { lat: 13.4317, lng: -6.2658 },
    'Mopti': { lat: 14.4944, lng: -4.1970 },
    'Tombouctou': { lat: 16.7735, lng: -3.0074 },
    'Gao': { lat: 16.2666, lng: -0.0400 },
    'Kidal': { lat: 18.4411, lng: 1.4078 },
};
// --------------------------------------------------------

const TrajetFormPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        villeDepart: '', villeArrivee: '',
        coordsDepart: { lat: '', lng: '' }, coordsArrivee: { lat: '', lng: '' },
        compagnie: '', dateDepart: '', heureDepart: '',
        prix: '', placesDisponibles: '', bus: '', isActive: true
    });
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // ... (logique de chargement des données, inchangée)
    }, [id, isEditMode]);

    // --- NOUVEAU useEffect pour le pré-remplissage automatique ---
    useEffect(() => {
        const departCity = formData.villeDepart;
        if (CITIES_COORDS[departCity]) {
            setFormData(prev => ({ ...prev, coordsDepart: CITIES_COORDS[departCity] }));
        }
    }, [formData.villeDepart]);

    useEffect(() => {
        const arriveeCity = formData.villeArrivee;
        if (CITIES_COORDS[arriveeCity]) {
            setFormData(prev => ({ ...prev, coordsArrivee: CITIES_COORDS[arriveeCity] }));
        }
    }, [formData.villeArrivee]);
    // -------------------------------------------------------------

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleCoordChange = (point, coord, value) => {
        setFormData(prev => ({ ...prev, [point]: { ...prev[point], [coord]: value } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = { ...formData, bus: formData.bus || null };
            payload.coordsDepart.lat = parseFloat(payload.coordsDepart.lat);
            payload.coordsDepart.lng = parseFloat(payload.coordsDepart.lng);
            payload.coordsArrivee.lat = parseFloat(payload.coordsArrivee.lat);
            payload.coordsArrivee.lng = parseFloat(payload.coordsArrivee.lng);
            
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
                            {/* Input pour la ville avec une datalist pour l'autocomplétion */}
                            <div>
                                <label htmlFor="villeDepart">Ville de départ</label>
                                <input id="villeDepart" name="villeDepart" list="cities" value={formData.villeDepart} onChange={handleChange} placeholder="Ex: Bamako" required className="w-full border p-2 rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="villeArrivee">Ville d'arrivée</label>
                                <input id="villeArrivee" name="villeArrivee" list="cities" value={formData.villeArrivee} onChange={handleChange} placeholder="Ex: Sikasso" required className="w-full border p-2 rounded-md"/>
                            </div>
                            <datalist id="cities">
                                {Object.keys(CITIES_COORDS).map(city => <option key={city} value={city} />)}
                            </datalist>
                        </div>
                        <input name="compagnie" value={formData.compagnie} onChange={handleChange} placeholder="Compagnie" required className="w-full border p-2 rounded-md" />
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="date" name="dateDepart" value={formData.dateDepart} onChange={handleChange} required className="border p-2 rounded-md" />
                            <input type="time" name="heureDepart" value={formData.heureDepart} onChange={handleChange} required className="border p-2 rounded-md" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="number" name="prix" value={formData.prix} onChange={handleChange} placeholder="Prix (FCFA)" required className="border p-2 rounded-md" />
                            <input type="number" name="placesDisponibles" value={formData.placesDisponibles} onChange={handleChange} placeholder="Places disponibles" required className="border p-2 rounded-md" />
                        </div>
                        <select name="bus" value={formData.bus} onChange={handleChange} className="w-full border p-2 rounded-md bg-gray-50">
                            <option value="">— Associer un bus (optionnel) —</option>
                            {buses.map(b => <option key={b._id} value={b._id}>{b.numero} ({b.capacite} places)</option>)}
                        </select>
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
                            <label htmlFor="isActive" className="font-medium text-gray-700">Trajet Actif</label>
                            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-6 w-6 rounded"/>
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