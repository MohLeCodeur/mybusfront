// src/pages/admin/TrajetFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader } from 'react-icons/fi';

const TrajetFormPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        villeDepart: '',
        villeArrivee: '',
        compagnie: '',
        dateDepart: '',
        heureDepart: '',
        prix: '',
        placesDisponibles: '',
        bus: '',
        isActive: true // <-- On initialise le formulaire avec le trajet actif par défaut
    });
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const busRes = await api.get('/admin/bus');
                setBuses(Array.isArray(busRes.data) ? busRes.data : []);
                
                if (isEditMode) {
                    const trajetRes = await api.get(`/public/trajets/${id}`);
                    const trajetData = {
                        ...trajetRes.data,
                        dateDepart: new Date(trajetRes.data.dateDepart).toISOString().split('T')[0],
                        bus: trajetRes.data.bus?._id || '',
                        // S'assurer que 'isActive' est bien un booléen
                        isActive: typeof trajetRes.data.isActive === 'boolean' ? trajetRes.data.isActive : true
                    };
                    setFormData(trajetData);
                }
            } catch (err) {
                setError("Erreur de chargement des données.");
            } finally {
                setFormLoading(false);
            }
        };
        loadData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        // Logique spéciale pour la checkbox 'isActive'
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = { ...formData };
            if (payload.bus === '') {
                payload.bus = null;
            }
            
            const apiCall = isEditMode 
                ? api.put(`/admin/trajets/${id}`, payload) 
                : api.post('/admin/trajets', payload);
            
            await apiCall;
            navigate('/admin/trajets');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };

    if(formLoading) return <div>Chargement du formulaire...</div>;

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader><CardTitle>{isEditMode ? 'Modifier le trajet' : 'Ajouter un trajet'}</CardTitle></CardHeader>
            <CardContent>
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <input name="villeDepart" value={formData.villeDepart} onChange={handleChange} placeholder="Ville de départ" required className="border p-2 rounded-md" />
                        <input name="villeArrivee" value={formData.villeArrivee} onChange={handleChange} placeholder="Ville d'arrivée" required className="border p-2 rounded-md" />
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

                    {/* --- NOUVEAU CHAMP "ACTIF" --- */}
                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                        <label htmlFor="isActive" className="font-medium text-gray-700">
                            Rendre ce trajet visible au public ?
                            <p className="text-xs text-gray-500 font-normal">Si décoché, le trajet ne sera pas visible dans la recherche.</p>
                        </label>
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="h-6 w-6 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                    </div>
                    {/* ------------------------------------------- */}

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/trajets')}>Annuler</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                            {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
export default TrajetFormPage;