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
        trajet: '',
        description: '',
        poids: '',
        expediteur_nom: '',
        expediteur_telephone: '',
        expediteur_email: '',
        destinataire_nom: '',
        destinataire_telephone: '',
        statut: 'enregistré'
    });
    const [displayData, setDisplayData] = useState({ code_suivi: '', prix: 0 });
    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const trajetsRes = await api.get('/public/trajets/search');
                if (trajetsRes.data && Array.isArray(trajetsRes.data.docs)) {
                    setTrajets(trajetsRes.data.docs);
                }

                if (isEditMode) {
                    const colisRes = await api.get(`/admin/colis/${id}`);
                    setFormData({ expediteur_email: '', ...colisRes.data, trajet: colisRes.data.trajet?._id || '' });
                    setDisplayData({ code_suivi: colisRes.data.code_suivi, prix: colisRes.data.prix });
                }
            } catch (err) {
                setError("Erreur de chargement des données. Veuillez rafraîchir la page.");
                console.error(err);
            } finally {
                setFormLoading(false);
            }
        };

        loadInitialData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.trajet) {
            setError("Veuillez sélectionner un trajet pour ce colis.");
            setLoading(false);
            return;
        }

        try {
            let savedColis;
            if (isEditMode) {
                // Pour une mise à jour, on peut appeler la route de mise à jour générale
                const response = await api.put(`/admin/colis/${id}`, formData);
                savedColis = response.data;
            } else {
                const response = await api.post('/admin/colis', formData);
                savedColis = response.data;
            }

            // Mettre à jour l'affichage si on est en mode édition
            if (isEditMode) {
                setDisplayData(prev => ({ ...prev, prix: savedColis.prix }));
            }
            
            // Rediriger après un court délai pour que l'utilisateur voie la mise à jour
            setTimeout(() => navigate('/admin/colis'), 700);

        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };
    
    if (formLoading) return <div className="flex justify-center items-center h-96"><FiLoader className="animate-spin text-3xl text-blue-500"/></div>;

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader><CardTitle>{isEditMode ? 'Gérer le colis' : 'Enregistrer un nouveau colis'}</CardTitle></CardHeader>
            <CardContent>
                {isEditMode && (
                    <div className="mb-6 p-4 rounded-lg bg-gray-50 border grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1"><FiTag className="text-gray-500"/><h3 className="font-semibold">Code Suivi</h3></div>
                            <p className="font-mono text-lg">{displayData.code_suivi}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1"><FiDollarSign className="text-gray-500"/><h3 className="font-semibold">Prix Calculé</h3></div>
                            <p className="font-mono text-lg">{displayData.prix?.toLocaleString('fr-FR')} FCFA</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Statut Actuel</h3>
                            <StatusStepper currentStatus={formData.statut} />
                        </div>
                    </div>
                )}
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="p-4 border rounded-lg bg-blue-50/50">
                        <label htmlFor="trajet" className="font-semibold mb-2 text-gray-700 block">1. Sélectionner le Trajet Associé</label>
                        <select id="trajet" name="trajet" value={formData.trajet} onChange={handleChange} required className="w-full border p-2 rounded-md bg-white">
                            <option value="" disabled>-- Choisir un trajet futur --</option>
                            {trajets.map(t => (
                                <option key={t._id} value={t._id}>
                                    {t.villeDepart} → {t.villeArrivee} (Le {new Date(t.dateDepart).toLocaleDateString('fr-FR')} - {t.heureDepart})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2 text-gray-700">2. Détails du colis</h3>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (ex: Téléphone, Documents...)" required className="w-full border p-2 rounded-md mb-2" />
                        <input type="number" step="any" name="poids" value={formData.poids} onChange={handleChange} placeholder="Poids (kg)" required className="border p-2 rounded-md w-full md:w-1/3" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2 text-gray-700">3. Expéditeur</h3>
                            <div className="space-y-2">
                                <input name="expediteur_nom" value={formData.expediteur_nom} onChange={handleChange} placeholder="Nom" required className="w-full border p-2 rounded-md" />
                                <input type="tel" name="expediteur_telephone" value={formData.expediteur_telephone} onChange={handleChange} placeholder="Téléphone" required className="w-full border p-2 rounded-md" />
                                <input type="email" name="expediteur_email" value={formData.expediteur_email} onChange={handleChange} placeholder="Email (pour les notifications)" className="w-full border p-2 rounded-md" />
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2 text-gray-700">4. Destinataire</h3>
                            <div className="space-y-2">
                                <input name="destinataire_nom" value={formData.destinataire_nom} onChange={handleChange} placeholder="Nom" required className="w-full border p-2 rounded-md" />
                                <input type="tel" name="destinataire_telephone" value={formData.destinataire_telephone} onChange={handleChange} placeholder="Téléphone" required className="w-full border p-2 rounded-md" />
                            </div>
                        </div>
                    </div>
                     
                    {isEditMode && (
                        <div className="p-4 border rounded-lg">
                            <label className="block font-medium mb-1">5. Mettre à jour le statut (manuel)</label>
                            <select name="statut" value={formData.statut} onChange={handleChange} className="w-full border p-2 rounded-md bg-gray-50">
                                <option value="enregistré">Enregistré</option>
                                <option value="encours">En cours</option>
                                <option value="arrivé">Arrivé</option>
                                <option value="annulé">Annulé</option>
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