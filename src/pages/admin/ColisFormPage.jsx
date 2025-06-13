// src/pages/admin/ColisFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiTag, FiDollarSign, FiUser, FiPhone, FiTruck } from 'react-icons/fi';
import StatusStepper from '../../components/admin/StatusStepper.jsx';

const ColisFormPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        trajet: '',
        description: '',
        poids: '',
        expediteur_nom: '', expediteur_telephone: '', expediteur_email: '',
        destinataire_nom: '', destinataire_telephone: '',
        statut: 'enregistré'
    });
    const [displayData, setDisplayData] = useState({ code_suivi: '', prix: 0, trajetInfo: null });
    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // On ne charge la liste des trajets que si on est en mode création
                if (!isEditMode) {
                    const trajetsRes = await api.get('/public/trajets/search');
                    if (trajetsRes.data && Array.isArray(trajetsRes.data.docs)) {
                        setTrajets(trajetsRes.data.docs);
                    }
                }

                // Si on est en mode édition, on charge les données du colis
                if (isEditMode) {
                    const colisRes = await api.get(`/admin/colis/${id}`);
                    setFormData({ ...colisRes.data, trajet: colisRes.data.trajet?._id || '' });
                    setDisplayData({ 
                        code_suivi: colisRes.data.code_suivi, 
                        prix: colisRes.data.prix,
                        trajetInfo: colisRes.data.trajet // On stocke les infos du trajet populé
                    });
                }
            } catch (err) {
                setError("Erreur de chargement des données.");
                console.error(err);
            } finally {
                setFormLoading(false);
            }
        };
        loadInitialData();
    }, [id, isEditMode]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (!isEditMode && !formData.trajet) {
            setError("Veuillez sélectionner un trajet pour créer le colis.");
            setLoading(false);
            return;
        }
        try {
            const apiCall = isEditMode 
                ? api.put(`/admin/colis/${id}`, formData) 
                : api.post('/admin/colis', formData);
            await apiCall;
            navigate('/admin/colis');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };
    
    if (formLoading) return <div className="flex justify-center items-center h-96"><FiLoader className="animate-spin text-3xl"/></div>;

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader><CardTitle>{isEditMode ? 'Gérer le colis' : 'Enregistrer un nouveau colis'}</CardTitle></CardHeader>
            <CardContent>
                {isEditMode && (
                    <div className="mb-6 p-4 rounded-lg bg-gray-50 border grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* ... (affichage code_suivi, prix, StatusStepper) ... */}
                    </div>
                )}
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* --- LOGIQUE CONDITIONNELLE POUR LE TRAJET --- */}
                    {isEditMode ? (
                        // En mode édition, on affiche simplement le trajet associé
                        <div className="p-4 border rounded-lg bg-gray-100">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <FiTruck /> Trajet Associé (non modifiable)
                            </h3>
                            <p className="mt-1 text-blue-600">
                                {displayData.trajetInfo ? 
                                    `${displayData.trajetInfo.villeDepart} → ${displayData.trajetInfo.villeArrivee} (Le ${new Date(displayData.trajetInfo.dateDepart).toLocaleDateString('fr-FR')})`
                                    : "Information non disponible"}
                            </p>
                        </div>
                    ) : (
                        // En mode création, on affiche la liste déroulante
                        <div className="p-4 border rounded-lg bg-blue-50/50">
                            <label htmlFor="trajet" className="font-semibold mb-2 text-gray-700 block">1. Sélectionner le Trajet du Colis</label>
                            <select id="trajet" name="trajet" value={formData.trajet} onChange={handleChange} required className="w-full border p-2 rounded-md bg-white">
                                <option value="" disabled>-- Choisir un trajet futur --</option>
                                {trajets.map(t => (
                                    <option key={t._id} value={t._id}>
                                        {t.villeDepart} → {t.villeArrivee} (Le {new Date(t.dateDepart).toLocaleDateString('fr-FR')} - {t.heureDepart})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {/* ------------------------------------------- */}

                    {/* Le reste du formulaire est identique */}
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2 text-gray-700">2. Détails du colis</h3>
                        {/* ... inputs pour description, poids ... */}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2 text-gray-700">3. Expéditeur</h3>
                            {/* ... inputs pour expéditeur ... */}
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2 text-gray-700">4. Destinataire</h3>
                            {/* ... inputs pour destinataire ... */}
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
                        {/* ... boutons ... */}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
export default ColisFormPage;