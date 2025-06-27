// src/pages/admin/ColisFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiTag, FiDollarSign, FiArrowLeft, FiTruck, FiInfo, FiPackage, FiUser, FiPhone, FiMail, FiEdit } from 'react-icons/fi';
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

    const [displayData, setDisplayData] = useState({ 
        code_suivi: '', 
        prix: 0, 
        trajetInfo: null,
        date_enregistrement: null
    });

    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // ====================================================================
                // --- DÉBUT DE LA CORRECTION ---
                // ====================================================================
                // Charger les trajets disponibles uniquement en mode création
                if (!isEditMode) {
                    // On appelle le nouvel endpoint dédié qui renvoie TOUS les trajets futurs
                    const trajetsRes = await api.get('/admin/trajets/available-for-colis');
                    
                    // La réponse est un simple tableau, pas un objet paginé
                    if (Array.isArray(trajetsRes.data)) {
                        setTrajets(trajetsRes.data);
                    }
                }
                // ====================================================================
                // --- FIN DE LA CORRECTION ---
                // ====================================================================

                // Charger les données du colis en mode édition
                if (isEditMode) {
                    const colisRes = await api.get(`/admin/colis/${id}`);
                    const colisData = colisRes.data;
                    
                    setFormData({ 
                        ...colisData, 
                        trajet: colisData.trajet?._id || '' 
                    });
                    
                    setDisplayData({ 
                        code_suivi: colisData.code_suivi, 
                        prix: colisData.prix,
                        trajetInfo: colisData.trajet,
                        date_enregistrement: colisData.date_enregistrement
                    });
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const validateForm = () => {
        if (!isEditMode && !formData.trajet) {
            setError("Veuillez sélectionner un trajet pour créer le colis.");
            return false;
        }

        if (formData.poids && (isNaN(formData.poids) || parseFloat(formData.poids) <= 0)) {
            setError("Le poids doit être un nombre positif.");
            return false;
        }

        // Validation du format téléphone (8 chiffres)
        const phoneRegex = /^\d{8}$/;
        if (!phoneRegex.test(formData.expediteur_telephone)) {
            setError("Le téléphone de l'expéditeur doit contenir 8 chiffres.");
            return false;
        }
        if (!phoneRegex.test(formData.destinataire_telephone)) {
            setError("Le téléphone du destinataire doit contenir 8 chiffres.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                ...formData,
                poids: parseFloat(formData.poids)
            };

            const apiCall = isEditMode 
                ? api.put(`/admin/colis/${id}`, payload) 
                : api.post('/admin/colis', payload);
            
            const response = await apiCall;
            
            if (!isEditMode) {
                setSuccess(`Colis créé avec succès ! Code de suivi : ${response.data.code_suivi}`);
                setTimeout(() => {
                    navigate('/admin/colis');
                }, 2000);
            } else {
                setSuccess('Colis mis à jour avec succès !');
                setTimeout(() => {
                    navigate('/admin/colis');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };

    if (formLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <FiLoader className="animate-spin text-3xl text-blue-500"/>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Bouton retour */}
            <Button 
                variant="outline" 
                onClick={() => navigate('/admin/colis')} 
                className="mb-6 flex items-center gap-2"
            >
                <FiArrowLeft/> Retour à la liste des colis
            </Button>

            <Card className="shadow-2xl border-t-4 border-pink-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FiPackage className="text-pink-500"/>
                        {isEditMode ? 'Gérer le Colis' : 'Enregistrer un Nouveau Colis'}
                    </CardTitle>
                    <CardDescription>
                        {isEditMode 
                            ? `Mise à jour des informations pour le colis ${displayData.code_suivi}` 
                            : "Remplissez les détails pour enregistrer un nouveau colis."}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Affichage des informations en mode édition */}
                    {isEditMode && (
                        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-pink-50 border border-blue-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiTag className="text-blue-500"/>
                                        <h3 className="font-semibold text-gray-700">Code Suivi</h3>
                                    </div>
                                    <p className="font-mono text-lg text-blue-600">{displayData.code_suivi}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiDollarSign className="text-green-500"/>
                                        <h3 className="font-semibold text-gray-700">Prix Calculé</h3>
                                    </div>
                                    <p className="font-bold text-lg text-green-600">
                                        {displayData.prix?.toLocaleString('fr-FR')} FCFA
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-1">Date d'enregistrement</h3>
                                    <p className="text-sm text-gray-600">
                                        {displayData.date_enregistrement 
                                            ? new Date(displayData.date_enregistrement).toLocaleString('fr-FR')
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Progression du colis</h3>
                                <StatusStepper currentStatus={formData.statut} />
                            </div>
                        </div>
                    )}

                    {/* Messages d'erreur et de succès */}
                    {error && (
                        <div className="text-red-500 bg-red-50 p-3 rounded-lg mb-4 flex items-center gap-2">
                            <FiInfo className="shrink-0"/>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-green-600 bg-green-50 p-3 rounded-lg mb-4 flex items-center gap-2">
                            <FiInfo className="shrink-0"/>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Trajet */}
                        {isEditMode ? (
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                    <FiTruck className="text-blue-500"/> 
                                    Trajet Associé (non modifiable)
                                </h3>
                                <p className="text-blue-600 font-medium">
                                    {displayData.trajetInfo ? 
                                        `${displayData.trajetInfo.villeDepart} → ${displayData.trajetInfo.villeArrivee}`
                                        : "Information non disponible"}
                                </p>
                                {displayData.trajetInfo && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Départ le {new Date(displayData.trajetInfo.dateDepart).toLocaleDateString('fr-FR')} 
                                        à {displayData.trajetInfo.heureDepart}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30">
                                <label htmlFor="trajet" className="font-semibold mb-2 text-gray-700 block">
                                    1. Sélectionner le Trajet du Colis
                                </label>
                                <select 
                                    id="trajet" 
                                    name="trajet" 
                                    value={formData.trajet} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="" disabled>-- Choisir un trajet futur --</option>
                                    {trajets.length === 0 ? (
                                        <option disabled>Aucun trajet disponible</option>
                                    ) : (
                                        trajets.map(t => (
                                            <option key={t._id} value={t._id}>
                                                {t.villeDepart} → {t.villeArrivee} 
                                                ({new Date(t.dateDepart).toLocaleDateString('fr-FR')} - {t.heureDepart})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        )}

                        {/* Section 2: Détails du colis */}
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                <FiPackage className="text-pink-500"/>
                                2. Détails du colis
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Description du contenu
                                    </label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange} 
                                        placeholder="Ex: Téléphone portable, Documents importants, Vêtements..." 
                                        required 
                                        rows="3"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Poids (en kg)
                                    </label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        name="poids" 
                                        value={formData.poids} 
                                        onChange={handleChange} 
                                        placeholder="Ex: 2.5" 
                                        required 
                                        className="border border-gray-300 p-3 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-pink-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3 & 4: Expéditeur et Destinataire */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Expéditeur */}
                            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                                <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                    <FiUser className="text-green-500"/>
                                    3. Informations de l'Expéditeur
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Nom complet
                                        </label>
                                        <input 
                                            name="expediteur_nom" 
                                            value={formData.expediteur_nom} 
                                            onChange={handleChange} 
                                            placeholder="Nom et prénom" 
                                            required 
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            <FiPhone className="inline mr-1"/>
                                            Téléphone
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="expediteur_telephone" 
                                            value={formData.expediteur_telephone} 
                                            onChange={handleChange} 
                                            placeholder="70000000" 
                                            pattern="[0-9]{8}"
                                            required 
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            <FiMail className="inline mr-1"/>
                                            Email (optionnel)
                                        </label>
                                        <input 
                                            type="email" 
                                            name="expediteur_email" 
                                            value={formData.expediteur_email} 
                                            onChange={handleChange} 
                                            placeholder="email@exemple.com" 
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Pour recevoir les notifications de suivi
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Destinataire */}
                            <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-amber-50">
                                <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                    <FiUser className="text-orange-500"/>
                                    4. Informations du Destinataire
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Nom complet
                                        </label>
                                        <input 
                                            name="destinataire_nom" 
                                            value={formData.destinataire_nom} 
                                            onChange={handleChange} 
                                            placeholder="Nom et prénom" 
                                            required 
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            <FiPhone className="inline mr-1"/>
                                            Téléphone
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="destinataire_telephone" 
                                            value={formData.destinataire_telephone} 
                                            onChange={handleChange} 
                                            placeholder="70000000" 
                                            pattern="[0-9]{8}"
                                            required 
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Pour notifier l'arrivée du colis
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Section 5: Statut (mode édition uniquement) */}
                        {isEditMode && (
                            <div className="p-4 border-2 border-yellow-200 rounded-lg bg-yellow-50/30">
                                <label className="block font-semibold mb-2 text-gray-700 flex items-center gap-2">
                                    <FiEdit className="text-yellow-600"/>
                                    5. Mettre à jour le statut
                                </label>
                                <select 
                                    name="statut" 
                                    value={formData.statut} 
                                    onChange={handleChange} 
                                    className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                >
                                    <option value="enregistré">Enregistré</option>
                                    <option value="encours">En cours</option>
                                    <option value="arrivé">Arrivé</option>
                                    <option value="annulé">Annulé</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-2">
                                    Attention : Cette action met à jour manuellement le statut du colis
                                </p>
                            </div>
                        )}

                        {/* Boutons d'action */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate('/admin/colis')}
                                className="px-6"
                            >
                                Annuler
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg hover:shadow-blue-500/50"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="animate-spin mr-2" />
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="mr-2" />
                                        {isEditMode ? 'Mettre à jour' : 'Enregistrer le colis'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ColisFormPage;