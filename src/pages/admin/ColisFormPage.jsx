// src/pages/admin/ColisFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiSave, FiLoader } from 'react-icons/fi';
import StatusStepper from '@/components/admin/StatusStepper';

const ColisFormPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        description: '', poids: '', distance: '', valeur: '',
        expediteur_nom: '', expediteur_telephone: '',
        destinataire_nom: '', destinataire_telephone: '',
        statut: 'enregistré'
    });
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(isEditMode);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            api.get(`/admin/colis/${id}`) // URL CORRIGÉE
                .then(res => setFormData(res.data))
                .catch(err => setError('Colis non trouvé'))
                .finally(() => setFormLoading(false));
        } else {
            setFormLoading(false);
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const apiCall = isEditMode ? api.put(`/admin/colis/${id}`, formData) : api.post('/admin/colis', formData); // URLs CORRIGÉES
            await apiCall;
            navigate('/admin/colis');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };
    
    if(formLoading) return <div>Chargement du formulaire...</div>;

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader><CardTitle>{isEditMode ? 'Gérer le colis' : 'Ajouter un nouveau colis'}</CardTitle></CardHeader>
            <CardContent>
                {isEditMode && <div className="mb-6"><h3 className="font-semibold mb-2">Statut Actuel</h3><StatusStepper currentStatus={formData.statut} /></div>}
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Détails du colis</h3>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full border p-2 rounded-md" />
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <input type="number" name="poids" value={formData.poids} onChange={handleChange} placeholder="Poids (kg)" required className="border p-2 rounded-md" />
                            <input type="number" name="distance" value={formData.distance} onChange={handleChange} placeholder="Distance (km)" required className="border p-2 rounded-md" />
                            <input type="number" name="valeur" value={formData.valeur} onChange={handleChange} placeholder="Valeur (FCFA)" required className="border p-2 rounded-md" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-2">Expéditeur</h3>
                            <input name="expediteur_nom" value={formData.expediteur_nom} onChange={handleChange} placeholder="Nom" required className="w-full border p-2 rounded-md mb-2" />
                            <input type="tel" name="expediteur_telephone" value={formData.expediteur_telephone} onChange={handleChange} placeholder="Téléphone" required className="w-full border p-2 rounded-md" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Destinataire</h3>
                            <input name="destinataire_nom" value={formData.destinataire_nom} onChange={handleChange} placeholder="Nom" required className="w-full border p-2 rounded-md mb-2" />
                            <input type="tel" name="destinataire_telephone" value={formData.destinataire_telephone} onChange={handleChange} placeholder="Téléphone" required className="w-full border p-2 rounded-md" />
                        </div>
                    </div>
                     {isEditMode && (
                        <div>
                            <label className="block font-medium mb-1">Changer le statut</label>
                            <select name="statut" value={formData.statut} onChange={handleChange} className="w-full border p-2 rounded-md">
                                <option value="enregistré">Enregistré</option>
                                <option value="encours">En cours</option>
                                <option value="arrivé">Arrivé</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/colis')}>Annuler</Button>
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
export default ColisFormPage;