// src/pages/admin/ChauffeurFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader } from 'react-icons/fi';

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
        
        // On vérifie que la réponse est un tableau et on le stocke
        if (Array.isArray(busResponse.data)) {
            setBuses(busResponse.data);
        } else {
            console.error("Format de réponse inattendu pour les bus:", busResponse.data);
            setBuses([]); // Sécurité pour éviter un crash
        }

        if (isEditMode) {
          const chauffeurRes = await api.get(`/admin/chauffeurs/${id}`);
          setFormData({ ...chauffeurRes.data, bus: chauffeurRes.data.bus?._id || '' });
        }
      } catch (err) {
        setError("Erreur de chargement des données.");
        console.error(err);
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

  if (formLoading) return <div>Chargement du formulaire...</div>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>{isEditMode ? 'Modifier le chauffeur' : 'Ajouter un nouveau chauffeur'}</CardTitle></CardHeader>
      <CardContent>
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required className="w-full border p-2 rounded-md" />
                <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required className="w-full border p-2 rounded-md" />
            </div>
          <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" required className="w-full border p-2 rounded-md" />
          
          <div className="space-y-1">
            <label htmlFor="bus-select" className="block font-medium text-sm text-gray-700">Affecter un bus (optionnel)</label>
            <select id="bus-select" name="bus" value={formData.bus} onChange={handleChange} className="w-full border p-2 rounded-md bg-gray-50">
                <option value="">— Aucun bus —</option>
                {buses.length > 0 ? (
                    buses.map(b => (
                        <option key={b._id} value={b._id} disabled={b.etat !== 'en service'}>
                            {b.numero} ({b.etat})
                        </option>
                    ))
                ) : (
                    <option disabled>Chargement des bus...</option>
                )}
            </select>
            <p className="text-xs text-gray-500">Seuls les bus "en service" sont sélectionnables.</p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/chauffeurs')}>Annuler</Button>
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
export default ChauffeurFormPage;