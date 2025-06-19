// src/pages/admin/ReservationFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FiSave, FiLoader, FiArrowLeft } from 'react-icons/fi';

const ReservationFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [formData, setFormData] = useState({ statut: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/reservations/${id}`)
        .then(res => {
          setReservation(res.data);
          setFormData({ statut: res.data.statut });
        })
        .catch(() => setError('Impossible de charger la réservation.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/admin/reservations/${id}`, formData);
      navigate('/admin/reservations');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><FiLoader className="animate-spin text-3xl"/></div>;
  if (error || !reservation) return <p className="text-red-500 bg-red-50 p-4 rounded-lg">{error || 'Réservation non trouvée'}</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="outline" onClick={() => navigate('/admin/reservations')} className="mb-6 flex items-center gap-2">
        <FiArrowLeft/> Retour à la liste
      </Button>
      <Card className="shadow-2xl border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle>Modifier la Réservation</CardTitle>
          <CardDescription>ID de la réservation : <span className="font-mono">{reservation._id}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 border">
              <p><strong>Client:</strong> {reservation.client?.prenom} {reservation.client?.nom}</p>
              <p><strong>Trajet:</strong> {reservation.trajet?.villeDepart} → {reservation.trajet?.villeArrivee}</p>
              <p><strong>Date:</strong> {new Date(reservation.trajet?.dateDepart).toLocaleDateString()}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">Modifier le Statut</label>
              <select id="statut" name="statut" value={formData.statut} onChange={handleChange} className="w-full border p-3 rounded-lg bg-white">
                <option value="en_attente">En attente</option>
                <option value="confirmée">Confirmée</option>
                <option value="annulée">Annulée</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Attention : cette action est purement administrative et ne déclenche pas de remboursement.</p>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg">
                {saving ? <FiLoader className="animate-spin mr-2"/> : <FiSave className="mr-2" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default ReservationFormPage;