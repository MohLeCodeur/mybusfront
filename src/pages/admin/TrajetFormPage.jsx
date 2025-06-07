// src/pages/admin/TrajetFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FiSave, FiLoader } from 'react-icons/fi';

const TrajetFormPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        villeDepart: '', villeArrivee: '', compagnie: '',
        dateDepart: '', heureDepart: '', prix: '',
        placesDisponibles: '', bus: ''
    });
    const [buses, setBuses] = useState([]); // Initialisé comme un tableau vide
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                // --- CORRECTION CI-DESSOUS ---
                const busRes = await api.get('/admin/bus');
                // On extrait le tableau 'buses' de l'objet de réponse
                setBuses(busRes.data.buses || []); 
                // -----------------------------

                if (isEditMode) {
                    const trajetRes = await api.get(`/public/trajets/${id}`);
                    const trajetData = {
                        ...trajetRes.data,
                        dateDepart: new Date(trajetRes.data.dateDepart).toISOString().split('T')[0],
                        bus: trajetRes.data.bus?._id || ''
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const apiCall = isEditMode 
                ? api.put(`/admin/trajets/${id}`, formData) 
                : api.post('/admin/trajets', formData);
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
                    <select name="bus" value={formData.bus} onChange={handleChange} className="w-full border p-2 rounded-md">
                        <option value="">— Associer un bus (optionnel) —</option>
                        {buses.map(b => <option key={b._id} value={b._id}>{b.numero} ({b.capacite} places)</option>)}
                    </select>
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