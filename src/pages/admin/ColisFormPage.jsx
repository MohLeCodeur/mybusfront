// src/pages/admin/ColisFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiTag, FiDollarSign, FiArrowLeft } from 'react-icons/fi';
import StatusStepper from '../../components/admin/StatusStepper.jsx';

const ColisFormPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        trajet: '', description: '', poids: '',
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
        const loadData = async () => {
            try {
                if (!isEditMode) {
                    const trajetsRes = await api.get('/public/trajets/search');
                    setTrajets(trajetsRes.data.docs || []);
                }
                if (isEditMode) {
                    const colisRes = await api.get(`/admin/colis/${id}`);
                    setFormData({ ...colisRes.data, trajet: colisRes.data.trajet?._id || '' });
                    setDisplayData({ code_suivi: colisRes.data.code_suivi, prix: colisRes.data.prix, trajetInfo: colisRes.data.trajet });
                }
            } catch (err) { setError("Erreur de chargement."); } 
            finally { setFormLoading(false); }
        };
        loadData();
    }, [id, isEditMode]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (!isEditMode && !formData.trajet) {
            setError("Veuillez sélectionner un trajet.");
            setLoading(false);
            return;
        }
        try {
            const apiCall = isEditMode ? api.put(`/admin/colis/${id}`, formData) : api.post('/admin/colis', formData);
            await apiCall;
            navigate('/admin/colis');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };
    
    if (formLoading) return <div className="flex justify-center items-center h-96"><FiLoader className="animate-spin text-3xl"/></div>;

    return (
      <div className="max-w-2xl mx-auto">
        <Button variant="outline" onClick={() => navigate('/admin/colis')} className="mb-6 flex items-center gap-2">
            <FiArrowLeft/> Retour à la liste des colis
        </Button>
        {/* --- LIGNE CORRIGÉE : border-orange-400 -> border-pink-500 --- */}
        <Card className="shadow-2xl border-t-4 border-pink-500">
            <CardHeader>
                <CardTitle>{isEditMode ? 'Gérer le Colis' : 'Enregistrer un Nouveau Colis'}</CardTitle>
                <CardDescription>
                    {isEditMode ? `Mise à jour des informations pour le colis ${formData.code_suivi || ''}` : "Remplissez les détails pour enregistrer un nouveau colis."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isEditMode ? (
                        <div className="p-3 bg-gray-100 rounded-md text-sm">
                           <span className="font-semibold">Trajet Associé :</span> 
                           <span className="text-blue-600 ml-2">{displayData.trajetInfo ? `${displayData.trajetInfo.villeDepart} → ${displayData.trajetInfo.villeArrivee}` : 'N/A'}</span>
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="trajet" className="block text-sm font-medium text-gray-700 mb-1">Trajet du Colis</label>
                            <select id="trajet" name="trajet" value={formData.trajet} onChange={handleChange} required className="w-full border-gray-300 border p-3 rounded-lg bg-white">
                                <option value="" disabled>-- Choisir un trajet futur --</option>
                                {trajets.map(t => <option key={t._id} value={t._id}>{t.villeDepart} → {t.villeArrivee} ({new Date(t.dateDepart).toLocaleDateString('fr-FR')})</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description & Poids</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Contenu du colis..." required className="w-full border-gray-300 border p-3 rounded-lg mb-2" />
                        <input type="number" step="any" name="poids" value={formData.poids} onChange={handleChange} placeholder="Poids (kg)" required className="w-full md:w-1/2 border-gray-300 border p-3 rounded-lg" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expéditeur</label>
                            <input name="expediteur_nom" value={formData.expediteur_nom} onChange={handleChange} placeholder="Nom" required className="w-full border-gray-300 border p-3 rounded-lg mb-2" />
                            <input type="tel" name="expediteur_telephone" value={formData.expediteur_telephone} onChange={handleChange} placeholder="Téléphone" required className="w-full border-gray-300 border p-3 rounded-lg mb-2" />
                            <input type="email" name="expediteur_email" value={formData.expediteur_email} onChange={handleChange} placeholder="Email (notifications)" className="w-full border-gray-300 border p-3 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                            <input name="destinataire_nom" value={formData.destinataire_nom} onChange={handleChange} placeholder="Nom" required className="w-full border-gray-300 border p-3 rounded-lg mb-2" />
                            <input type="tel" name="destinataire_telephone" value={formData.destinataire_telephone} onChange={handleChange} placeholder="Téléphone" required className="w-full border-gray-300 border p-3 rounded-lg" />
                        </div>
                    </div>
                    {isEditMode && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mettre à jour le statut</label>
                            <select name="statut" value={formData.statut} onChange={handleChange} className="w-full border-gray-300 border p-3 rounded-lg bg-white">
                                <option value="enregistré">Enregistré</option><option value="encours">En cours</option><option value="arrivé">Arrivé</option><option value="annulé">Annulé</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg">
                            {loading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                            {isEditMode ? 'Enregistrer' : 'Créer le Colis'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
      </div>
    );
};
export default ColisFormPage;