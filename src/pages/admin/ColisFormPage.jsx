// src/pages/admin/ColisFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiTag, FiDollarSign } from 'react-icons/fi';
import StatusStepper from '../../components/admin/StatusStepper.jsx';

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
    // États séparés pour les données non modifiables
    const [displayData, setDisplayData] = useState({ code_suivi: '', prix: 0 });

    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(isEditMode);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            api.get(`/admin/colis/${id}`)
                .then(res => {
                    setFormData(res.data);
                    setDisplayData({ code_suivi: res.data.code_suivi, prix: res.data.prix });
                })
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
            if (isEditMode) {
                // --- Logique améliorée ---
                const { data: updatedColis } = await api.put(`/admin/colis/${id}`, formData);
                
                // Mettre à jour l'affichage du prix avec la nouvelle valeur renvoyée par le backend
                setDisplayData(prev => ({ ...prev, prix: updatedColis.prix }));

                // Donner un court instant à l'admin pour voir le prix mis à jour
                setTimeout(() => {
                    navigate('/admin/colis');
                }, 1000); // Redirige après 1 seconde

            } else {
                // La logique de création ne change pas
                await api.post('/admin/colis', formData);
                navigate('/admin/colis');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false); // On arrête le loader en cas d'erreur
        }
        // Pas de setLoading(false) ici si la redirection est immédiate
    };
    
    if(formLoading) return <div>Chargement du formulaire...</div>;

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader><CardTitle>{isEditMode ? 'Gérer le colis' : 'Enregistrer un nouveau colis'}</CardTitle></CardHeader>
            <CardContent>
                {isEditMode && (
                    <div className="mb-6 p-4 rounded-lg bg-gray-50 border grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-2">
                                <FiTag className="text-gray-500"/>
                                <h3 className="font-semibold">Code de Suivi</h3>
                            </div>
                            <p className="font-mono text-lg">{displayData.code_suivi}</p>
                        </div>
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-2">
                                <FiDollarSign className="text-gray-500"/>
                                <h3 className="font-semibold">Prix Calculé</h3>
                            </div>
                            <p className="font-mono text-lg">{displayData.prix?.toLocaleString('fr-FR')} FCFA</p>
                        </div>
                        <div className="md:col-span-1">
                            <h3 className="font-semibold mb-2">Statut Actuel</h3>
                            <StatusStepper currentStatus={formData.statut} />
                        </div>
                    </div>
                )}
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2 text-gray-700">Détails du colis</h3>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (ex: Téléphone, Documents...)" required className="w-full border p-2 rounded-md" />
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <input type="number" step="any" name="poids" value={formData.poids} onChange={handleChange} placeholder="Poids (kg)" required className="border p-2 rounded-md" />
                            <input type="number" name="distance" value={formData.distance} onChange={handleChange} placeholder="Distance (km)" required className="border p-2 rounded-md" />
                            <input type="number" name="valeur" value={formData.valeur} onChange={handleChange} placeholder="Valeur déclarée (FCFA)" required className="border p-2 rounded-md" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-700">Expéditeur</h3>
                            <input name="expediteur_nom" value={formData.expediteur_nom} onChange={handleChange} placeholder="Nom de l'expéditeur" required className="w-full border p-2 rounded-md mb-2" />
                            <input type="tel" name="expediteur_telephone" value={formData.expediteur_telephone} onChange={handleChange} placeholder="Téléphone de l'expéditeur" required className="w-full border p-2 rounded-md" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-700">Destinataire</h3>
                            <input name="destinataire_nom" value={formData.destinataire_nom} onChange={handleChange} placeholder="Nom du destinataire" required className="w-full border p-2 rounded-md mb-2" />
                            <input type="tel" name="destinataire_telephone" value={formData.destinataire_telephone} onChange={handleChange} placeholder="Téléphone du destinataire" required className="w-full border p-2 rounded-md" />
                        </div>
                    </div>
                     {isEditMode && (
                        <div>
                            <label className="block font-medium mb-1">Mettre à jour le statut</label>
                            <select name="statut" value={formData.statut} onChange={handleChange} className="w-full border p-2 rounded-md bg-gray-50">
                                <option value="enregistré">Enregistré</option>
                                <option value="encours">En cours de livraison</option>
                                <option value="arrivé">Arrivé à destination</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/colis')}>Annuler</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                            {isEditMode ? 'Mettre à jour le colis' : 'Enregistrer le colis'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
export default ColisFormPage;