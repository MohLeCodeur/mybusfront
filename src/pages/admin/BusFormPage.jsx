// src/pages/admin/BusFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card.jsx';
import { Button } from '@/components/ui/button';
import { FiSave, FiLoader } from 'react-icons/fi';

const BusFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ numero: '', etat: 'en service', capacite: 50 });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      api.get(`/admin/bus/${id}`) // URL CORRIGÉE
        .then(res => setFormData(res.data))
        .catch(err => setError('Bus non trouvé'))
        .finally(() => setFormLoading(false));
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
      const apiCall = isEditMode ? api.put(`/admin/bus/${id}`, formData) : api.post('/admin/bus', formData); // URLs CORRIGÉES
      await apiCall;
      navigate('/admin/bus');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  if (formLoading) return <div>Chargement du formulaire...</div>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Modifier le bus' : 'Ajouter un bus'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Numéro</label>
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} className="w-full border p-2 rounded-md" required />
          </div>
          <div>
            <label className="block font-medium mb-1">État</label>
            <select name="etat" value={formData.etat} onChange={handleChange} className="w-full border p-2 rounded-md">
              <option value="en service">En service</option>
              <option value="maintenance">Maintenance</option>
              <option value="hors service">Hors service</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Capacité</label>
            <input type="number" name="capacite" value={formData.capacite} onChange={handleChange} className="w-full border p-2 rounded-md" min="1" required />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/bus')}>Annuler</Button>
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
export default BusFormPage;