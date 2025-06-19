// src/pages/admin/BusFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiArrowLeft } from 'react-icons/fi';

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
      api.get(`/admin/bus/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => setError('Bus non trouvé ou erreur de chargement.'))
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
      const apiCall = isEditMode ? api.put(`/admin/bus/${id}`, formData) : api.post('/admin/bus', formData);
      await apiCall;
      navigate('/admin/bus');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  if (formLoading) return <div className="flex justify-center items-center h-96"><FiLoader className="animate-spin text-3xl"/></div>;

  return (
    <div className="max-w-2xl mx-auto">
        <Button variant="outline" onClick={() => navigate('/admin/bus')} className="mb-6 flex items-center gap-2">
            <FiArrowLeft/> Retour à la liste des bus
        </Button>
        <Card className="shadow-2xl border-t-4 border-pink-500">
            <CardHeader>
                <CardTitle>{isEditMode ? 'Modifier les informations du Bus' : 'Ajouter un Nouveau Bus'}</CardTitle>
                <CardDescription>
                    {isEditMode ? `Mise à jour du bus n° ${formData.numero}` : "Remplissez les détails pour enregistrer un nouveau véhicule dans la flotte."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Numéro d'immatriculation ou de flotte</label>
                    <input type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: B-101 ou AB-1234-MD" required />
                </div>
                <div>
                    <label htmlFor="etat" className="block text-sm font-medium text-gray-700 mb-1">État actuel du bus</label>
                    <select id="etat" name="etat" value={formData.etat} onChange={handleChange} className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="en service">En service</option>
                        <option value="maintenance">En maintenance</option>
                        <option value="hors service">Hors service</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="capacite" className="block text-sm font-medium text-gray-700 mb-1">Capacité (nombre de sièges)</label>
                    <input type="number" id="capacite" name="capacite" value={formData.capacite} onChange={handleChange} className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" min="1" required />
                </div>
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg hover:shadow-blue-500/50">
                    {loading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                    {isEditMode ? 'Enregistrer les modifications' : 'Ajouter le Bus'}
                    </Button>
                </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
};
export default BusFormPage;