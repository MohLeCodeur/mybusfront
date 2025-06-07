// src/pages/admin/ChauffeurFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
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
        const busRes = await api.get('/admin/bus'); // URL CORRIGÉE
        setBuses(busRes.data);
        if (isEditMode) {
          const chauffeurRes = await api.get(`/admin/chauffeurs/${id}`); // URL CORRIGÉE
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
      const apiCall = isEditMode ? api.put(`/admin/chauffeurs/${id}`, payload) : api.post('/admin/chauffeurs', payload); // URLs CORRIGÉES
      await apiCall;
      navigate('/admin/chauffeurs');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  if (formLoading) return <div>Chargement...</div>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>{isEditMode ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}</CardTitle></CardHeader>
      <CardContent>
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required className="w-full border p-2 rounded-md" />
                <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required className="w-full border p-2 rounded-md" />
            </div>
          <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" required className="w-full border p-2 rounded-md" />
          <select name="bus" value={formData.bus} onChange={handleChange} className="w-full border p-2 rounded-md">
            <option value="">— Affecter un bus (optionnel) —</option>
            {buses.map(b => <option key={b._id} value={b._id}>{b.numero}</option>)}
          </select>
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