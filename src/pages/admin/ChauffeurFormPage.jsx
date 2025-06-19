// src/pages/admin/ChauffeurFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiArrowLeft } from 'react-icons/fi';

const ChauffeurFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ prenom: '', nom: '', telephone: '', bus: '' });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const busResponse = await api.get('/admin/bus');
        setBuses(Array.isArray(busResponse.data) ? busResponse.data : []);
        
        if (isEditMode) {
          const chauffeurRes = await api.get(`/admin/chauffeurs/${id}`);
          setFormData({ ...chauffeurRes.data, bus: chauffeurRes.data.bus?._id || '' });
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
      const payload = { ...formData, bus: formData.bus || null };
      const apiCall = isEditMode 
        ? api.put(`/admin/chauffeurs/${id}`, payload) 
        : api.post('/admin/chauffeurs', payload);
      await apiCall;
      navigate('/admin/chauffeurs');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  if (formLoading) return <div className="flex justify-center items-center h-96"><FiLoader className="animate-spin text-3xl text-blue-500"/></div>;

  return (
    <div className="max-w-2xl mx-auto">
        <Button variant="outline" onClick={() => navigate('/admin/chauffeurs')} className="mb-6 flex items-center gap-2">
            <FiArrowLeft/> Retour à la liste des chauffeurs
        </Button>
        <Card className="shadow-2xl border-t-4 border-pink-500">
            <CardHeader>
                <CardTitle>{isEditMode ? 'Modifier les Informations du Chauffeur' : 'Ajouter un Nouveau Chauffeur'}</CardTitle>
                <CardDescription>
                    {isEditMode ? `Mise à jour du profil de ${formData.prenom} ${formData.nom}` : "Remplissez les détails pour enregistrer un nouveau chauffeur."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom du chauffeur" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom de famille" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Numéro de Téléphone</label>
                        <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Ex: 70000000" required className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label htmlFor="bus" className="block text-sm font-medium text-gray-700 mb-1">Affecter un Bus (optionnel)</label>
                        <select id="bus" name="bus" value={formData.bus} onChange={handleChange} className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            <option value="">— Aucun bus —</option>
                            {buses.map(b => (
                                <option key={b._id} value={b._id} disabled={b.etat !== 'en service'}>
                                    {b.numero} ({b.etat})
                                </option>
                            ))}
                        </select>
                         <p className="text-xs text-gray-500 mt-1">Seuls les bus "en service" peuvent être affectés.</p>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg hover:shadow-blue-500/50">
                            {loading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                            {isEditMode ? 'Enregistrer les modifications' : 'Ajouter le Chauffeur'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
};
export default ChauffeurFormPage;